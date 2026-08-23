import pytest
from fastapi.testclient import TestClient
from fastapi import status
from app.main import app
from app.core.cache import cache

client = TestClient(app)

def test_rbac_admin_routes():
    # 1. Create a regular user
    user_payload = {
        "email": "regularuser@example.com",
        "password": "SecurePassword123!",
        "full_name": "Regular User",
    }
    client.post("/api/v1/auth/register", json=user_payload)
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "regularuser@example.com", "password": "SecurePassword123!"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify regular user cannot access admin route
    resp = client.get("/api/v1/users", headers=headers)
    assert resp.status_code == status.HTTP_403_FORBIDDEN
    assert resp.json()["detail"] == "Admin access required"

def test_rate_limiting_auth():
    # Attempt registration multiple times to trigger rate limit (configured for 30 requests/minute)
    user_payload = {
        "email": "ratelimit@example.com",
        "password": "SecurePassword123!",
        "full_name": "Rate Limited User",
    }
    
    # Fire off requests sequentially. Since limit is 30, we can run a loop or manually verify the limit logic
    from app.core.rate_limit import auth_limiter
    
    # We can mock/force limit to 2 for quick testing
    auth_limiter.tokens["auth:test-ip"] = 0.5 # less than 1.0 token
    
    # Call endpoint with a custom header representing client IP or using rate limiter checking directly
    with pytest.raises(Exception) as exc_info:
        auth_limiter.check_rate_limit("auth:test-ip")
    assert "Too many requests" in str(exc_info.value)

def test_cache_system():
    # Verify SimpleCache operations
    cache.clear()
    assert cache.get("test-key") is None
    cache.set("test-key", {"data": "cached-value"}, ttl=5)
    assert cache.get("test-key") == {"data": "cached-value"}
    
    # Exceed TTL
    import time
    cache.cache["test-key"] = ({"data": "cached-value"}, time.time() - 1)
    assert cache.get("test-key") is None
