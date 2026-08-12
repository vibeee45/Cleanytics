from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.dataset import Dataset

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Dataset).filter(Dataset.user_id == current_user.id)
    )
    datasets = result.scalars().all()

    total_datasets = len(datasets)
    cleaned_datasets = sum(1 for d in datasets if d.status == "completed")
    total_rows_processed = sum(d.row_count for d in datasets)
    
    avg_quality_score = (
        round(sum(d.quality_score for d in datasets) / total_datasets, 1)
        if total_datasets > 0 else 0.0
    )

    recent = [
        {
            "id": d.id,
            "name": d.name,
            "filename": d.original_filename,
            "status": d.status,
            "rows": d.row_count,
            "cols": d.col_count,
            "score": d.quality_score,
            "created_at": d.created_at.isoformat()
        }
        for d in datasets[:5]
    ]

    return {
        "total_datasets": total_datasets,
        "cleaned_datasets": cleaned_datasets,
        "total_rows_processed": total_rows_processed,
        "avg_quality_score": avg_quality_score,
        "recent_datasets": recent
    }
