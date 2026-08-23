import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON
from app.core.database import Base

class CleaningJob(Base):
    __tablename__ = "cleaning_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String, ForeignKey("datasets.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    status = Column(String, default="queued") # queued, processing, completed, failed
    progress_percent = Column(Integer, default=0)
    current_step = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
    
    config = Column(JSON, nullable=True) # rules selected by user
    result_summary = Column(JSON, nullable=True) # statistics of what was cleaned
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
