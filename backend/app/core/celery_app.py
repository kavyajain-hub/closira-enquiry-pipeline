from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "closira_tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Optional configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Auto-discover tasks from app.workers directory
celery_app.autodiscover_tasks(["app.workers"])
