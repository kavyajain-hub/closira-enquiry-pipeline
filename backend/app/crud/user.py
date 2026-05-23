from typing import Optional, Any
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate

class CRUDUser(CRUDBase[User, UserCreate, Any]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        # Simple plain text password for now; in production hash this with bcrypt/passlib
        db_obj = User(
            email=obj_in.email,
            hashed_password=obj_in.password,  # In production, pass security.get_password_hash(obj_in.password)
            full_name=obj_in.full_name,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

crud_user = CRUDUser(User)
