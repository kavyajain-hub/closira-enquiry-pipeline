from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, index=True, nullable=False)
    channel = Column(String, index=True, nullable=False)  # whatsapp, email, call
    message = Column(Text, nullable=False)
    status = Column(String, index=True, default="new")  # new, qualified, escalated
    matched_sop = Column(String, nullable=True)
    suggested_response = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    history = relationship("StatusTimeline", back_populates="enquiry", cascade="all, delete-orphan")
    followups = relationship("Followup", back_populates="enquiry", cascade="all, delete-orphan")


class StatusTimeline(Base):
    __tablename__ = "status_timelines"

    id = Column(Integer, primary_key=True, index=True)
    enquiry_id = Column(Integer, ForeignKey("enquiries.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, nullable=False)
    event_type = Column(String, nullable=False)  # created, sop_matched, escalation_triggered, followup_scheduled, resolved
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    enquiry = relationship("Enquiry", back_populates="history")


class Followup(Base):
    __tablename__ = "followups"

    id = Column(Integer, primary_key=True, index=True)
    enquiry_id = Column(Integer, ForeignKey("enquiries.id", ondelete="CASCADE"), nullable=False)
    delay_minutes = Column(Integer, nullable=False)
    message_template = Column(Text, nullable=True)
    due_at = Column(DateTime(timezone=True), nullable=False)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    enquiry = relationship("Enquiry", back_populates="followups")
