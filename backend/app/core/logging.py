import logging
import json
import sys
from datetime import datetime

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        # Add extra properties if available
        if hasattr(record, "extra_data"):
            log_data["extra"] = record.extra_data
            
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

def setup_logging():
    logger = logging.getLogger("closira")
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers if setup is run multiple times
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)
        
    return logger

# Globally accessible logger instance
logger = setup_logging()
