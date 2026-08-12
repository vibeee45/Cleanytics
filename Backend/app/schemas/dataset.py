from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel

class DatasetBase(BaseModel):
    name: str

class DatasetCreate(DatasetBase):
    pass

class DatasetResponse(DatasetBase):
    id: str
    user_id: str
    original_filename: str
    file_type: str
    status: str
    row_count: int
    col_count: int
    quality_score: float
    summary_metrics: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CleaningConfigRequest(BaseModel):
    fill_missing: Optional[bool] = True
    impute_strategy: Optional[str] = "auto" # auto, mean, median, mode, constant
    drop_duplicates: Optional[bool] = True
    normalize_headers: Optional[bool] = True
    detect_outliers: Optional[bool] = True
    auto_parse_dates: Optional[bool] = True
