from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.workers.tasks import send_ai_customer_message

router = APIRouter()

@router.post("/send-message")
def trigger_communication(message_data: dict, db: Session = Depends(get_db)):
    # Trigger Celery background task asynchronously
    task = send_ai_customer_message.delay(
        customer_email=message_data.get("email"),
        content=message_data.get("content")
    )
    return {
        "status": "queued",
        "task_id": task.id,
        "message": "AI customer communication task triggered asynchronously"
    }
