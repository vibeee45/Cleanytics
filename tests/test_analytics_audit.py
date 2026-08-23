import os
import json
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analytics_and_audit_flow():
    # 1. Register and Login
    register_payload = {
        "email": "analytictest@example.com",
        "password": "SecurePassword123!",
        "full_name": "Analytics Tester",
    }
    client.post("/api/v1/auth/register", json=register_payload)

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "analytictest@example.com", "password": "SecurePassword123!"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload test CSV
    csv_content = "id,product,price\n1,Laptop,1200\n2,Phone,800\n3,Tablet,\n4,Laptop,1200\n"
    upload_files = {"file": ("sales_test.csv", csv_content, "text/csv")}
    upload_resp = client.post("/api/v1/datasets/upload", files=upload_files, headers=headers)
    assert upload_resp.status_code == 201
    dataset_id = upload_resp.json()["id"]

    # 3. Test Dashboard Analytics
    dashboard_resp = client.get("/api/v1/analytics/dashboard", headers=headers)
    assert dashboard_resp.status_code == 200
    db_data = dashboard_resp.json()
    assert db_data["totalDatasets"] == 1
    assert db_data["originalRows"] == 4

    # 4. Test Dataset Detailed Analytics
    detail_resp = client.get(f"/api/v1/analytics/datasets/{dataset_id}", headers=headers)
    assert detail_resp.status_code == 200
    analytics_data = detail_resp.json()
    assert analytics_data["dataset_id"] == dataset_id
    assert "stats" in analytics_data
    assert "summary" in analytics_data
    
    # 5. Check if quality calculation works
    assert analytics_data["stats"]["dataset_size"]["rows"] == 4
    assert analytics_data["stats"]["column_types"]["numeric"] >= 1

    # Clean up dataset
    client.delete(f"/api/v1/datasets/{dataset_id}", headers=headers)
