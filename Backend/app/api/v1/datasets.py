import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.v1.users import get_current_user
from app.models.user import User
from app.models.dataset import Dataset
from app.models.dataset_version import DatasetVersion
from app.schemas.dataset import DatasetResponse, DatasetDetailResponse
from app.services.upload_service import upload_service

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.post(
    "/upload",
    response_model=DatasetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a new dataset (CSV/Excel)",
)
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    dataset_id = str(uuid.uuid4())
    
    # Process the file and save as JSON
    storage_path, file_type, row_count, column_count, columns = await upload_service.process_and_save_upload(
        file, dataset_id
    )

    # Save dataset metadata to DB
    new_dataset = Dataset(
        id=dataset_id,
        owner_id=current_user.id,
        filename=f"{dataset_id}.json",
        original_filename=file.filename or "unknown.csv",
        storage_path=storage_path,
        file_type=file_type,
        row_count=row_count,
        column_count=column_count,
        status="uploaded"
    )
    
    db.add(new_dataset)
    
    # Save the initial version record
    new_version = DatasetVersion(
        id=str(uuid.uuid4()),
        dataset_id=dataset_id,
        version_number=1,
        cleaned_file_path=storage_path,
        quality_score=100.0,  # start at 100% quality before checks
        summary_json="{\"message\": \"Initial upload\"}"
    )
    db.add(new_version)

    await db.commit()
    await db.refresh(new_dataset)
    
    return new_dataset


@router.get(
    "",
    response_model=List[DatasetResponse],
    summary="List all datasets for the authenticated user",
)
async def list_datasets(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Dataset).where(Dataset.owner_id == current_user.id).order_by(Dataset.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get(
    "/{dataset_id}",
    response_model=DatasetDetailResponse,
    summary="Get details of a specific dataset including JSON preview",
)
async def get_dataset_detail(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Dataset).where(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
    result = await db.execute(stmt)
    dataset = result.scalar_one_or_none()

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Read data from the JSON file
    preview = upload_service.get_preview_data(dataset.storage_path, limit=100)

    # Reconstruct columns from preview or keep metadata format
    columns = []
    if preview:
        columns = list(preview[0].keys())

    return DatasetDetailResponse(
        id=dataset.id,
        organization_id=dataset.organization_id,
        owner_id=dataset.owner_id,
        filename=dataset.filename,
        original_filename=dataset.original_filename,
        file_type=dataset.file_type,
        row_count=dataset.row_count,
        column_count=dataset.column_count,
        status=dataset.status,
        created_at=dataset.created_at,
        columns=columns,
        preview_data=preview
    )


@router.delete(
    "/{dataset_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a dataset record and its JSON file from disk",
)
async def delete_dataset(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Dataset).where(Dataset.id == dataset_id, Dataset.owner_id == current_user.id)
    result = await db.execute(stmt)
    dataset = result.scalar_one_or_none()

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Remove JSON file from disk
    upload_service.delete_dataset_file(dataset.storage_path)

    # Delete dataset from database (cascades version removal)
    await db.delete(dataset)
    await db.commit()

    return None
