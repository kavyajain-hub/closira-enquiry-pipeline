import time
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.crud.enquiry import crud_enquiry
from app.core.logging import logger

@celery_app.task(name="process_enquiry_sop")
def process_enquiry_sop(enquiry_id: int):
    """
    Asynchronously processes a customer enquiry. Matches keywords to standard SOPs,
    updates database records, and handles auto-escalations with structured JSON logs.
    """
    logger.info(
        "Processing enquiry SOP asynchronously.",
        extra={"extra_data": {"enquiry_id": enquiry_id}}
    )
    
    db = SessionLocal()
    try:
        enquiry = crud_enquiry.get(db, id=enquiry_id)
        if not enquiry:
            logger.error(
                "Async task failed. Enquiry not found.",
                extra={"extra_data": {"enquiry_id": enquiry_id}}
            )
            return {"status": "error", "detail": "Enquiry not found"}

        message_lower = enquiry.message.lower()

        # Hardcoded SOP keyword mappings
        # 1. Booking Enquiry
        booking_keywords = ["book", "reserve", "schedule", "appointment", "slot", "demo"]
        # 2. Pricing Question
        pricing_keywords = ["price", "cost", "how much", "quote", "rate", "fee", "pricing"]
        # 3. After-Hours
        hours_keywords = ["night", "closed", "weekend", "hours", "opening", "late"]
        # 4. Complaint (Direct Escalation)
        complaint_keywords = ["broken", "fail", "angry", "bad", "refund", "complaint", "terrible", "issue", "suck"]

        matched_sop = None
        suggested_response = None
        status = "qualified"

        # SOP Keyword Logic
        if any(kw in message_lower for kw in complaint_keywords):
            matched_sop = "SOP-003: High Priority Complaint"
            suggested_response = (
                f"Hi {enquiry.customer_name}, we are deeply sorry for the trouble. "
                "I have escalated your complaint directly to our manager who will call you shortly."
            )
            status = "escalated"
            
            logger.info(
                "Enquiry auto-escalated due to complaint keywords.",
                extra={
                    "extra_data": {
                        "enquiry_id": enquiry_id,
                        "customer_name": enquiry.customer_name,
                        "sop": matched_sop,
                        "status": status
                    }
                }
            )

        elif any(kw in message_lower for kw in booking_keywords):
            matched_sop = "SOP-001: Lead Qualification & Booking"
            suggested_response = (
                f"Hi {enquiry.customer_name}, thanks for reaching out! We would be delighted to schedule a session. "
                "Please let us know your preferred date and time, and we'll book your slot immediately."
            )
            
            logger.info(
                "Enquiry matched to Booking SOP.",
                extra={
                    "extra_data": {
                        "enquiry_id": enquiry_id,
                        "sop": matched_sop,
                        "status": status
                    }
                }
            )

        elif any(kw in message_lower for kw in pricing_keywords):
            matched_sop = "SOP-002: Service Pricing & Cataloging"
            suggested_response = (
                f"Hi {enquiry.customer_name}, thank you for your enquiry. Our custom platform packages start at "
                "just $99/month. We have sent our detailed price catalog to your email. Let us know if you'd like a call!"
            )
            
            logger.info(
                "Enquiry matched to Pricing SOP.",
                extra={
                    "extra_data": {
                        "enquiry_id": enquiry_id,
                        "sop": matched_sop,
                        "status": status
                    }
                }
            )

        elif any(kw in message_lower for kw in hours_keywords):
            matched_sop = "SOP-004: After-Hours Automated Routing"
            suggested_response = (
                f"Hi {enquiry.customer_name}, thanks for your message! Our offices are currently closed, but "
                "we have queued your enquiry and our support team will reply first thing in the morning."
            )
            
            logger.info(
                "Enquiry matched to After-Hours SOP.",
                extra={
                    "extra_data": {
                        "enquiry_id": enquiry_id,
                        "sop": matched_sop,
                        "status": status
                    }
                }
            )

        else:
            # No SOP Matched -> Flag as Escalated directly
            status = "escalated"
            
            logger.info(
                "No SOP matched. Enquiry flagged for manual escalation.",
                extra={
                    "extra_data": {
                        "enquiry_id": enquiry_id,
                        "customer_name": enquiry.customer_name,
                        "status": status
                    }
                }
            )

        # Update database with matches
        crud_enquiry.update_sop_match(
            db,
            db_obj=enquiry,
            matched_sop=matched_sop,
            suggested_response=suggested_response,
            status=status
        )

        return {
            "status": "processed",
            "enquiry_id": enquiry_id,
            "matched_sop": matched_sop,
            "assigned_status": status
        }

    except Exception as e:
        logger.error(
            f"Error processing async task for enquiry {enquiry_id}.",
            extra={"extra_data": {"error": str(e)}}
        )
        return {"status": "failed", "error": str(e)}
        
    finally:
        db.close()
