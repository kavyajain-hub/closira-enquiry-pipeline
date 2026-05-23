from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class CommunicationBase(BaseModel):
    customer_email: EmailStr
    channel: str
    content: str

class CommunicationCreate(CommunicationBase):
    pass

class CommunicationResponse(CommunicationBase):
    id: int
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
