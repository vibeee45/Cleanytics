from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.audit_log import AuditLog

class AuditService:
    @staticmethod
    async def create_entry(
        db: AsyncSession,
        user_id: Optional[str],
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
    ) -> AuditLog:
        """Create a new audit log entry in the database."""
        entry = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id
        )
        db.add(entry)
        await db.commit()
        await db.refresh(entry)
        return entry

    @staticmethod
    async def get_logs(
        db: AsyncSession,
        user_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[AuditLog]:
        """Fetch audit logs, optionally filtered by user_id."""
        stmt = select(AuditLog)
        if user_id:
            stmt = stmt.where(AuditLog.user_id == user_id)
        stmt = stmt.order_by(AuditLog.created_at.desc()).offset(offset).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

audit_service = AuditService()
