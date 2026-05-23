from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud.enquiry import crud_enquiry
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryResponse,
    FollowupCreate,
    FollowupResponse,
    EscalateCreate,
    HistoryResponse,
    StatusTimelineResponse
)
from app.core.logging import logger
from app.workers.tasks import process_enquiry_sop

router = APIRouter()

@router.post("", response_model=dict, status_code=status.HTTP_202_ACCEPTED)
def create_enquiry(obj_in: EnquiryCreate, db: Session = Depends(get_db)):
    """
    Creates a new customer enquiry, logs the event, triggers the async SOP matching task,
    and returns a Job/Task ID immediately without blocking.
    """
    # 1. Save enquiry to database
    enquiry = crud_enquiry.create_enquiry(db, obj_in=obj_in)
    
    # 2. Log event in structured JSON format
    logger.info(
        "Customer enquiry created.",
        extra={
            "extra_data": {
                "enquiry_id": enquiry.id,
                "customer_name": enquiry.customer_name,
                "channel": enquiry.channel,
                "status": enquiry.status
            }
        }
    )
    
    # 3. Trigger async background process
    task = process_enquiry_sop.delay(enquiry.id)
    
    logger.info(
        "Async SOP task triggered.",
        extra={
            "extra_data": {
                "enquiry_id": enquiry.id,
                "job_id": task.id
            }
        }
    )
    
    return {
        "job_id": task.id,
        "enquiry_id": enquiry.id,
        "status": "queued",
        "message": "Enquiry successfully received. Processing asynchronously in Celery."
    }


@router.post("/{enquiry_id}/followup", response_model=FollowupResponse, status_code=status.HTTP_201_CREATED)
def schedule_followup(enquiry_id: int, obj_in: FollowupCreate, db: Session = Depends(get_db)):
    """
    Schedules an actionable follow-up task for an existing open enquiry.
    """
    # Verify enquiry exists
    enquiry = crud_enquiry.get(db, id=enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry with ID {enquiry_id} not found"
        )
        
    # Create followup
    followup = crud_enquiry.schedule_followup(db, enquiry_id=enquiry_id, obj_in=obj_in)
    
    logger.info(
        "Enquiry follow-up scheduled.",
        extra={
            "extra_data": {
                "enquiry_id": enquiry_id,
                "followup_id": followup.id,
                "delay_minutes": obj_in.delay_minutes,
                "due_at": followup.due_at.isoformat()
            }
        }
    )
    
    return followup


@router.post("/{enquiry_id}/escalate", response_model=EnquiryResponse, status_code=status.HTTP_200_OK)
def escalate_enquiry(enquiry_id: int, obj_in: EscalateCreate, db: Session = Depends(get_db)):
    """
    Manually escalates an enquiry to a human agent, providing an audit reason.
    """
    enquiry = crud_enquiry.get(db, id=enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry with ID {enquiry_id} not found"
        )
        
    updated_enquiry = crud_enquiry.escalate_enquiry(db, db_obj=enquiry, reason=obj_in.reason)
    
    logger.info(
        "Enquiry manually escalated.",
        extra={
            "extra_data": {
                "enquiry_id": enquiry_id,
                "reason": obj_in.reason,
                "status": updated_enquiry.status
            }
        }
    )
    
    return updated_enquiry


@router.get("/{enquiry_id}/history", response_model=HistoryResponse, status_code=status.HTTP_200_OK)
def get_enquiry_history(enquiry_id: int, db: Session = Depends(get_db)):
    """
    Retrieves full audit timeline logs, scheduled follow-ups, and meta details for an enquiry.
    """
    enquiry = crud_enquiry.get(db, id=enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry with ID {enquiry_id} not found"
        )
        
    history = crud_enquiry.get_history_by_enquiry_id(db, enquiry_id=enquiry_id)
    followups = crud_enquiry.get_followups_by_enquiry_id(db, enquiry_id=enquiry_id)
    
    return {
        "enquiry": enquiry,
        "history": history,
        "followups": followups
    }
