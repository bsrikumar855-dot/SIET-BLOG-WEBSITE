import pytest
import random
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success_and_me_retrieval(client: AsyncClient):
    """Verify user login and profile retrieval using access token."""
    email = f"testlogin_{random.randint(1000, 9999)}@siet.in"
    register_payload = {
        "name": "Login User",
        "email": email,
        "password": "Password123"
    }
    res = await client.post("/api/v1/auth/register", json=register_payload)
    assert res.status_code == 201

    login_payload = {
        "email": email,
        "password": "Password123"
    }
    res = await client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 200

    data = res.json()
    access_token = data["access_token"]
    assert access_token is not None
    assert data["user"]["email"] == email

    # Retrieve profile
    headers = {"Authorization": f"Bearer {access_token}"}
    res = await client.get("/api/v1/auth/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == email

@pytest.mark.asyncio
async def test_login_failure(client: AsyncClient):
    """Verify login fails with HTTP 401 on incorrect credentials."""
    login_payload = {
        "email": "nonexistent@siet.in",
        "password": "WrongPassword123"
    }
    res = await client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 401
    assert res.json()["success"] is False
