from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.api.v1.users import get_current_user
from app.models.user import User
from app.services.history.audit_service import audit_service

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str]
    action: str
    entity_type: str
    entity_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

@router.get(
    "/logs",
    response_model=List[AuditLogResponse],
    summary="Get user audit logs",
)
async def get_audit_logs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    # Only fetch logs belonging to this user (unless admin, but standard users only see their own logs)
    logs = await audit_service.get_logs(db, user_id=current_user.id, limit=limit, offset=offset)
    return logs
