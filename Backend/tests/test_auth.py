import asyncio
import pytest
from fastapi.testclient import TestClient

from app.core.database import engine, fallback_engine, Base
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True, scope="module")
def setup_database():
    async def init_tables():
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        except Exception:
            pass
        try:
            async with fallback_engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        except Exception:
            pass

    asyncio.run(init_tables())


def test_register_user_success():
    payload = {
        "email": "testuser_db@example.com",
        "password": "SecurePassword123!",
        "full_name": "Test DB User",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser_db@example.com"
    assert data["full_name"] == "Test DB User"
    assert "id" in data
    assert "password_hash" not in data


def test_register_duplicate_user_fails():
    payload = {
        "email": "testuser_db@example.com",
        "password": "AnotherPassword123!",
        "full_name": "Duplicate User",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_success():
    login_payload = {
        "email": "testuser_db@example.com",
        "password": "SecurePassword123!",
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password_fails():
    login_payload = {
        "email": "testuser_db@example.com",
        "password": "WrongPassword123!",
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_get_users_me_authenticated():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testuser_db@example.com", "password": "SecurePassword123!"},
    )
    token = login_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    me_resp = client.get("/api/v1/users/me", headers=headers)
    assert me_resp.status_code == 200
    data = me_resp.json()
    assert data["email"] == "testuser_db@example.com"
    assert data["full_name"] == "Test DB User"


def test_get_users_me_unauthenticated_fails():
    me_resp = client.get("/api/v1/users/me")
    assert me_resp.status_code == 401


def test_update_users_me_authenticated():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testuser_db@example.com", "password": "SecurePassword123!"},
    )
    token = login_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    update_payload = {"full_name": "Updated DB User Name"}
    update_resp = client.put("/api/v1/users/me", json=update_payload, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["full_name"] == "Updated DB User Name"


def test_token_refresh_flow():
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "testuser_db@example.com", "password": "SecurePassword123!"},
    )
    refresh_token = login_resp.json()["refresh_token"]

    refresh_resp = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refresh_resp.status_code == 200
    data = refresh_resp.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_forgot_and_reset_password_flow():
    forgot_resp = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "testuser_db@example.com"},
    )
    assert forgot_resp.status_code == 200
    assert "message" in forgot_resp.json()
