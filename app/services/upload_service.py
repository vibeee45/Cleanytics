import os
import json
import pandas as pd
from typing import Dict, Any, Tuple, List
from fastapi import UploadFile, HTTPException

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "storage", "datasets")


class UploadService:
    @staticmethod
    def get_storage_path(dataset_id: str) -> str:
        os.makedirs(STORAGE_DIR, exist_ok=True)
        return os.path.join(STORAGE_DIR, f"{dataset_id}.json")

    @staticmethod
    async def process_and_save_upload(file: UploadFile, dataset_id: str) -> Tuple[str, str, int, int, List[str]]:
        """
        Parses CSV/Excel file, converts data to JSON format, saves to storage, and returns metadata.
        Returns: (storage_path, file_type, row_count, column_count, columns)
        """
        filename = file.filename or ""
        ext = os.path.splitext(filename.lower())[1]

        if ext == ".csv":
            file_type = "csv"
            try:
                # Read CSV in chunks or as whole
                df = pd.read_csv(file.file)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")
        elif ext in [".xlsx", ".xls"]:
            file_type = ext.replace(".", "")
            try:
                df = pd.read_excel(file.file)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to parse Excel file: {str(e)}")
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Please upload a .csv, .xlsx, or .xls file."
            )

        row_count = len(df)
        column_count = len(df.columns)
        columns = [str(col) for col in df.columns]

        # Convert DataFrame to dictionary list (JSON records format)
        # Replacing NaN/NaT values so json.dumps doesn't generate invalid NaN tokens
        df_cleaned = df.fillna("")
        records = df_cleaned.to_dict(orient="records")

        # Save to JSON file
        storage_path = UploadService.get_storage_path(dataset_id)
        try:
            with open(storage_path, "w", encoding="utf-8") as f:
                json.dump(records, f, ensure_ascii=False, indent=2)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to write dataset to local disk: {str(e)}")

        return storage_path, file_type, row_count, column_count, columns

    @staticmethod
    def get_preview_data(storage_path: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Reads a stored JSON file and returns a list of record preview data."""
        if not os.path.exists(storage_path):
            raise HTTPException(status_code=404, detail="Dataset file not found on disk.")

        try:
            with open(storage_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data[:limit]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to read dataset JSON: {str(e)}")

    @staticmethod
    def delete_dataset_file(storage_path: str) -> None:
        """Removes the stored dataset JSON file from disk."""
        if storage_path and os.path.exists(storage_path):
            try:
                os.remove(storage_path)
            except Exception:
                pass


upload_service = UploadService()
