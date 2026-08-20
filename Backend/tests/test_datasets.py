import os
import json
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import engine, fallback_engine, Base
from app.services.upload_service import STORAGE_DIR

client = TestClient(app)


def test_dataset_upload_flow():
    # 1. Register and Login to get Auth token
    register_payload = {
        "email": "datasetuser@example.com",
        "password": "SecurePassword123!",
        "full_name": "Dataset Tester",
    }
    client.post("/api/v1/auth/register", json=register_payload)

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "datasetuser@example.com", "password": "SecurePassword123!"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Prepare sample CSV content
    csv_content = "id,name,age\n1,Alice,25\n2,Bob,30\n3,Charlie,35\n"
    
    # 3. Upload dataset
    upload_files = {"file": ("test_data.csv", csv_content, "text/csv")}
    upload_resp = client.post("/api/v1/datasets/upload", files=upload_files, headers=headers)
    assert upload_resp.status_code == 201
    
    data = upload_resp.json()
    dataset_id = data["id"]
    assert data["original_filename"] == "test_data.csv"
    assert data["file_type"] == "csv"
    assert data["row_count"] == 3
    assert data["column_count"] == 3
    assert data["status"] == "uploaded"

    # 4. Verify that the JSON file was created on disk
    expected_path = os.path.join(STORAGE_DIR, f"{dataset_id}.json")
    assert os.path.exists(expected_path)

    # 5. Read local JSON and check format
    with open(expected_path, "r") as f:
        records = json.load(f)
    assert len(records) == 3
    assert records[0]["name"] == "Alice"

    # 6. Retrieve all datasets list
    list_resp = client.get("/api/v1/datasets", headers=headers)
    assert list_resp.status_code == 200
    datasets = list_resp.json()
    assert len(datasets) >= 1
    assert any(d["id"] == dataset_id for d in datasets)

    # 7. Get dataset detail preview
    detail_resp = client.get(f"/api/v1/datasets/{dataset_id}", headers=headers)
    assert detail_resp.status_code == 200
    detail_data = detail_resp.json()
    assert detail_data["columns"] == ["id", "name", "age"]
    assert len(detail_data["preview_data"]) == 3

    # 8. Delete dataset
    delete_resp = client.delete(f"/api/v1/datasets/{dataset_id}", headers=headers)
    assert delete_resp.status_code == 204

    # 9. Verify database removal and file deletion from disk
    assert not os.path.exists(expected_path)
    
    get_removed_resp = client.get(f"/api/v1/datasets/{dataset_id}", headers=headers)
    assert get_removed_resp.status_code == 404
