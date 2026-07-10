import pytest
import random
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_token_refresh(client: AsyncClient):
    """Verify standard access token refresh lifecycle using refresh token."""
    email = f"testrefresh_{random.randint(1000, 9999)}@siet.in"
    register_payload = {
        "name": "Refresh User",
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
    
    refresh_token = res.json()["data"]["refresh_token"]

    res = await client.post(f"/api/v1/auth/refresh?refresh_token={refresh_token}")
    assert res.status_code == 200
    assert res.json()["success"] is True
    assert res.json()["data"]["access_token"] is not None
