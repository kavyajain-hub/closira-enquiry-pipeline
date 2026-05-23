from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.logging import logger

router = APIRouter()

@router.get("", status_code=status.HTTP_200_OK)
def check_health(db: Session = Depends(get_db)):
    """
    Checks the API health status and the database connection integrity.
    """
    health_status = {
        "status": "healthy",
        "database": "connected",
        "api_version": "1.0.0"
    }
    
    try:
        # Run a simple query to verify database link is active
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(
            f"Health check failed. Database connection error.",
            extra={"extra_data": {"error": str(e)}}
        )
        health_status["status"] = "unhealthy"
        health_status["database"] = "disconnected"
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=health_status
        )
        
    return health_status
