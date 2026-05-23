from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class ChannelEnum(str, Enum):
    whatsapp = "whatsapp"
    email = "email"
    call = "call"

class EnquiryStatusEnum(str, Enum):
    new = "new"
    qualified = "qualified"
    escalated = "escalated"

class TimelineEventTypeEnum(str, Enum):
    created = "created"
    sop_matched = "sop_matched"
    escalation_triggered = "escalation_triggered"
    followup_scheduled = "followup_scheduled"
    resolved = "resolved"

# Shared properties
class EnquiryBase(BaseModel):
    customer_name: str = Field(..., description="The name of the customer submitting the enquiry", examples=["Sarah Jenkins"])
    channel: ChannelEnum = Field(..., description="Communication channel used", examples=["whatsapp"])
    message: str = Field(..., description="Inbound message content from the customer", examples=["I want to book a demo of your system pricing details."])

class EnquiryCreate(EnquiryBase):
    pass

class EnquiryResponse(EnquiryBase):
    id: int
    status: str
    matched_sop: Optional[str] = None
    suggested_response: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class FollowupCreate(BaseModel):
    delay_minutes: int = Field(..., gt=0, description="Delay in minutes until follow-up task is due", examples=[15])
    message_template: Optional[str] = Field(None, description="Optional message template to send", examples=["Hi {name}, following up on your query..."])

class FollowupResponse(BaseModel):
    id: int
    enquiry_id: int
    delay_minutes: int
    message_template: Optional[str]
    due_at: datetime
    completed: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class EscalateCreate(BaseModel):
    reason: str = Field(..., description="Reason for escalating this enquiry to a human agent", examples=["Pricing complaint - customer unhappy with quote."])


class StatusTimelineResponse(BaseModel):
    id: int
    enquiry_id: int
    status: str
    event_type: str
    notes: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class HistoryResponse(BaseModel):
    enquiry: EnquiryResponse
    history: List[StatusTimelineResponse]
    followups: List[FollowupResponse]

    model_config = {
        "from_attributes": True
    }
