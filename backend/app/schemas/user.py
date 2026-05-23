from pydantic import BaseModel, EmailStr
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None

# Properties to receive on user creation
class UserCreate(UserBase):
    email: EmailStr
    password: str

# Properties to return to client
class UserResponse(UserBase):
    id: int

    model_config = {
        "from_attributes": True
    }
