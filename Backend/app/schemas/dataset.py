from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: str
    organization_id: Optional[str] = None
    owner_id: str
    filename: str
    original_filename: str
    file_type: str
    row_count: int
    column_count: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class DatasetDetailResponse(DatasetResponse):
    columns: List[str]
    preview_data: List[Dict[str, Any]]

    class Config:
        from_attributes = True
