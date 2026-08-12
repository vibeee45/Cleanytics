import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, JSON
from app.core.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # csv, xlsx, json
    storage_path = Column(String, nullable=False)
    cleaned_path = Column(String, nullable=True)
    
    status = Column(String, default="uploaded") # uploaded, processing, completed, error
    row_count = Column(Integer, default=0)
    col_count = Column(Integer, default=0)
    quality_score = Column(Float, default=0.0) # 0 to 100
    
    summary_metrics = Column(JSON, nullable=True) # null_counts, duplicates, outlier_stats
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
