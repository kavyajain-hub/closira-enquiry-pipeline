from datetime import datetime, timedelta
from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.enquiry import Enquiry, StatusTimeline, Followup
from app.schemas.enquiry import EnquiryCreate, FollowupCreate

class CRUDEnquiry(CRUDBase[Enquiry, EnquiryCreate, Any]):
    def create_enquiry(self, db: Session, *, obj_in: EnquiryCreate) -> Enquiry:
        db_obj = Enquiry(
            customer_name=obj_in.customer_name,
            channel=obj_in.channel,
            message=obj_in.message,
            status="new"
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Create initial timeline record
        timeline_obj = StatusTimeline(
            enquiry_id=db_obj.id,
            status="new",
            event_type="created",
            notes=f"Enquiry successfully received via {obj_in.channel.value}"
        )
        db.add(timeline_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_history_by_enquiry_id(self, db: Session, *, enquiry_id: int) -> List[StatusTimeline]:
        return db.query(StatusTimeline).filter(StatusTimeline.enquiry_id == enquiry_id).order_by(StatusTimeline.created_at.asc()).all()

    def get_followups_by_enquiry_id(self, db: Session, *, enquiry_id: int) -> List[Followup]:
        return db.query(Followup).filter(Followup.enquiry_id == enquiry_id).order_by(Followup.created_at.desc()).all()

    def update_sop_match(
        self, db: Session, *, db_obj: Enquiry, matched_sop: Optional[str], suggested_response: Optional[str], status: str, ai_summary: Optional[str] = None
    ) -> Enquiry:
        db_obj.matched_sop = matched_sop
        db_obj.suggested_response = suggested_response
        db_obj.status = status
        db_obj.ai_summary = ai_summary
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Log to timeline
        event_type = "sop_matched" if status == "qualified" else "escalation_triggered"
        
        notes = ""
        if status == "qualified":
            notes = f"SOP Matched: {matched_sop}. Suggested response generated."
        else:
            notes = "No SOP matched automatically. Escalation triggered."
            
        if ai_summary:
            notes += f" AI Summary: {ai_summary}"

        timeline_obj = StatusTimeline(
            enquiry_id=db_obj.id,
            status=status,
            event_type=event_type,
            notes=notes
        )
        db.add(timeline_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def schedule_followup(self, db: Session, *, enquiry_id: int, obj_in: FollowupCreate) -> Followup:
        due_time = datetime.utcnow() + timedelta(minutes=obj_in.delay_minutes)
        db_obj = Followup(
            enquiry_id=enquiry_id,
            delay_minutes=obj_in.delay_minutes,
            message_template=obj_in.message_template,
            due_at=due_time,
            completed=False
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Log event to timeline
        timeline_obj = StatusTimeline(
            enquiry_id=enquiry_id,
            status="qualified",  # keep current status
            event_type="followup_scheduled",
            notes=f"Scheduled follow-up due in {obj_in.delay_minutes} minutes (Due at {due_time.strftime('%Y-%m-%d %H:%M:%S')} UTC)."
        )
        db.add(timeline_obj)
        db.commit()
        return db_obj

    def escalate_enquiry(self, db: Session, *, db_obj: Enquiry, reason: str) -> Enquiry:
        db_obj.status = "escalated"
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Log timeline
        timeline_obj = StatusTimeline(
            enquiry_id=db_obj.id,
            status="escalated",
            event_type="escalation_triggered",
            notes=f"Escalated to human agent. Reason: {reason}"
        )
        db.add(timeline_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

crud_enquiry = CRUDEnquiry(Enquiry)
