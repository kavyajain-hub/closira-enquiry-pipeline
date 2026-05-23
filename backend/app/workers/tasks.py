import time
from app.core.celery_app import celery_app
from app.core.database import SessionLocal
from app.crud.enquiry import crud_enquiry
from app.core.logging import logger
from app.core.ai import analyze_enquiry_with_ai

@celery_app.task(name="process_enquiry_sop")
def process_enquiry_sop(enquiry_id: int):
    """
    Asynchronously processes a customer enquiry.
    Attempts to use the Google Gemini API to analyze intent, match SOPs, and draft replies.
    If Gemini is not configured or fails, gracefully falls back to local regex keyword matching.
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

        # Attempt to analyze the enquiry using real Gemini AI API
        ai_result = analyze_enquiry_with_ai(enquiry.customer_name, enquiry.message)

        if ai_result:
            # AI pipeline succeeded! Persist LLM insights
            matched_sop = ai_result.get("matched_sop")
            suggested_response = ai_result.get("suggested_response")
            status = ai_result.get("status")
            ai_summary = ai_result.get("ai_summary")

            logger.info(
                "Successfully processed enquiry using Google Gemini LLM API.",
                extra={
                    "extra_data": {
                        "enquiry_id": enquiry_id,
                        "matched_sop": matched_sop,
                        "status": status,
                        "ai_summary": ai_summary
                    }
                }
            )

            crud_enquiry.update_sop_match(
                db,
                db_obj=enquiry,
                matched_sop=matched_sop,
                suggested_response=suggested_response,
                status=status,
                ai_summary=ai_summary
            )

            return {
                "status": "processed",
                "mode": "ai_llm",
                "enquiry_id": enquiry_id,
                "matched_sop": matched_sop,
                "assigned_status": status
            }

        # Fallback Mode: Gemini API was skipped or failed. Use local regex keyword matching.
        logger.info(
            "Gemini API returned None or is disabled. Triggering local regex keyword fallback engine.",
            extra={"extra_data": {"enquiry_id": enquiry_id}}
        )

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
        fallback_summary = "Enquiry received. Processed locally via keyword-matching fallback engine."

        # SOP Keyword Logic
        if any(kw in message_lower for kw in complaint_keywords):
            matched_sop = "SOP-003: High Priority Complaint"
            suggested_response = (
                f"Hi {enquiry.customer_name}, we are deeply sorry for the trouble. "
                "I have escalated your complaint directly to our manager who will call you shortly."
            )
            status = "escalated"
            fallback_summary = "High-priority customer complaint detected via keyword search."
            
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
            fallback_summary = "Booking and scheduling enquiry detected via keyword search."
            
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
            fallback_summary = "Pricing structure and catalog query detected via keyword search."
            
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
            fallback_summary = "After-hours enquiry detected via keyword search."
            
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
            fallback_summary = "Inbound message with no matching keyword SOPs. Set to manual escalation."
            
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

        # Update database with fallback matches
        crud_enquiry.update_sop_match(
            db,
            db_obj=enquiry,
            matched_sop=matched_sop,
            suggested_response=suggested_response,
            status=status,
            ai_summary=fallback_summary
        )

        return {
            "status": "processed",
            "mode": "regex_fallback",
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
