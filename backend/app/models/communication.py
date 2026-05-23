from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Communication(Base):
    __tablename__ = "communications"

    id = Column(Integer, primary_key=True, index=True)
    customer_email = Column(String, index=True, nullable=False)
    channel = Column(String, nullable=False)  # e.g., 'email', 'sms', 'whatsapp'
    content = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, sent, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
