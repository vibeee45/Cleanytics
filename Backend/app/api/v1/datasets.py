import os
import shutil
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.dataset import Dataset
from app.schemas.dataset import DatasetResponse, CleaningConfigRequest
from app.services.cleaning_engine import PolarsCleaningEngine

router = APIRouter()

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a CSV or Excel file."
        )

    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{ext}"
    storage_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(storage_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Inspect dataset with Polars
    try:
        row_count, col_count, summary, quality_score = PolarsCleaningEngine.inspect_dataset(storage_path)
    except Exception as e:
        row_count, col_count, summary, quality_score = 0, 0, {"error": str(e)}, 0.0

    dataset = Dataset(
        id=file_id,
        user_id=current_user.id,
        name=name or file.filename,
        original_filename=file.filename,
        file_type=ext.replace('.', ''),
        storage_path=storage_path,
        status="uploaded",
        row_count=row_count,
        col_count=col_count,
        quality_score=quality_score,
        summary_metrics=summary
    )

    db.add(dataset)
    await db.commit()
    await db.refresh(dataset)
    return dataset

@router.get("/", response_model=List[DatasetResponse])
async def list_datasets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Dataset)
        .filter(Dataset.user_id == current_user.id)
        .order_by(Dataset.created_at.desc())
    )
    return result.scalars().all()

@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id)
    )
    dataset = result.scalars().first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@router.post("/{dataset_id}/clean", response_model=DatasetResponse)
async def clean_dataset(
    dataset_id: str,
    config: CleaningConfigRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id)
    )
    dataset = result.scalars().first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    cleaned_filename = f"cleaned_{dataset.id}.csv"
    cleaned_path = os.path.join(settings.PROCESSED_DIR, cleaned_filename)

    # Trigger high-speed cleaning engine
    final_rows, final_cols, summary, final_quality = PolarsCleaningEngine.clean_dataset(
        file_path=dataset.storage_path,
        output_path=cleaned_path,
        config=config.dict()
    )

    dataset.cleaned_path = cleaned_path
    dataset.status = "completed"
    dataset.row_count = final_rows
    dataset.col_count = final_cols
    dataset.quality_score = final_quality
    dataset.summary_metrics = summary

    await db.commit()
    await db.refresh(dataset)
    return dataset

@router.get("/{dataset_id}/download")
async def download_cleaned_dataset(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id)
    )
    dataset = result.scalars().first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    target_path = dataset.cleaned_path or dataset.storage_path
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="File on disk not found")

    download_name = f"cleaned_{dataset.original_filename}" if dataset.cleaned_path else dataset.original_filename
    return FileResponse(path=target_path, filename=download_name, media_type="text/csv")
