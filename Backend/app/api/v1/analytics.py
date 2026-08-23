import json
import os
import pandas as pd
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.cache import cache
from app.api.v1.users import get_current_user
from app.models.user import User
from app.models.dataset import Dataset
from app.models.dataset_version import DatasetVersion
from app.services.analytics.dashboard_service import DashboardService
from app.services.analytics.summary_service import SummaryService
from app.services.analytics.quality_service import QualityService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get(
    "/dashboard",
    summary="Get aggregated analytics for the dashboard dashboard stats",
)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cache_key = f"dashboard_stats:{current_user.id}"
    cached_val = cache.get(cache_key)
    if cached_val is not None:
        return cached_val

    # Fetch all datasets owned by this user
    stmt = select(Dataset).where(Dataset.owner_id == current_user.id)
    result = await db.execute(stmt)
    datasets = result.scalars().all()

    total_datasets = len(datasets)
    if total_datasets == 0:
        res = {
            "totalDatasets": 0,
            "cleanedDatasets": 0,
            "qualityScore": 0,
            "storageUsed": "0.0",
            "originalRows": 0,
            "cleanedRows": 0,
            "originalColumns": 0,
            "cleanedColumns": 0
        }
        cache.set(cache_key, res, ttl=10)
        return res

    # Sum of rows, columns, and quality score calculations
    original_rows = sum(d.row_count for d in datasets)
    
    # Let's find latest versions for these datasets
    quality_scores = []
    cleaned_rows = 0
    cleaned_cols = 0
    cleaned_count = 0

    for d in datasets:
        # Latest version
        version_stmt = select(DatasetVersion).where(DatasetVersion.dataset_id == d.id).order_by(DatasetVersion.version_number.desc()).limit(1)
        v_res = await db.execute(version_stmt)
        latest_version = v_res.scalar_one_or_none()
        if latest_version:
            quality_scores.append(latest_version.quality_score)
            # Try to get row/col count of the version from the JSON if possible, otherwise use base dataset
            if os.path.exists(latest_version.cleaned_file_path):
                try:
                    with open(latest_version.cleaned_file_path, "r", encoding="utf-8") as f:
                        records = json.load(f)
                    df = pd.DataFrame(records)
                    cleaned_rows += len(df)
                    cleaned_cols += len(df.columns)
                except Exception:
                    cleaned_rows += d.row_count
                    cleaned_cols += d.column_count
            else:
                cleaned_rows += d.row_count
                cleaned_cols += d.column_count
            
            if latest_version.version_number > 1:
                cleaned_count += 1
        else:
            cleaned_rows += d.row_count
            cleaned_cols += d.column_count

    avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 100.0

    res = {
        "totalDatasets": total_datasets,
        "cleanedDatasets": cleaned_count or total_datasets, # default to total if none cleaned yet
        "qualityScore": round(avg_quality, 1),
        "storageUsed": f"{(original_rows * 0.0001):.1f}",
        "originalRows": original_rows,
        "cleanedRows": cleaned_rows,
        "originalColumns": datasets[0].column_count if datasets else 0,
        "cleanedColumns": int(cleaned_cols / total_datasets) if total_datasets else 0
    }
    cache.set(cache_key, res, ttl=10)
    return res

@router.get(
    "/datasets/{dataset_id}",
    summary="Get detailed analytics and summary statistics for a specific dataset",
)
async def get_dataset_analytics(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Fetch dataset metadata
    stmt = select(Dataset).where(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
    result = await db.execute(stmt)
    dataset = result.scalar_one_or_none()

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Read latest version of the dataset
    version_stmt = select(DatasetVersion).where(DatasetVersion.dataset_id == dataset.id).order_by(DatasetVersion.version_number.desc()).limit(1)
    v_res = await db.execute(version_stmt)
    latest_version = v_res.scalar_one_or_none()

    storage_path = latest_version.cleaned_file_path if latest_version else dataset.storage_path

    if not os.path.exists(storage_path):
        raise HTTPException(status_code=404, detail="Dataset file not found on disk")

    try:
        with open(storage_path, "r", encoding="utf-8") as f:
            records = json.load(f)
        df = pd.DataFrame(records)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dataset content: {str(e)}")

    # Generate stats using service layer
    stats = DashboardService.generate_dashboard_stats(df)
    summary = SummaryService.generate_dataset_summary(df)

    return {
        "dataset_id": dataset_id,
        "stats": stats,
        "summary": summary
    }
