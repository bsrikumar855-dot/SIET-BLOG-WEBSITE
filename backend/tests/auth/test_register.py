import pytest
import random
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    """Verify user registration succeeds with clean inputs."""
    email = f"testregister_{random.randint(1000, 9999)}@siet.in"
    payload = {
        "name": "Register User",
        "email": email,
        "password": "Password123"
    }
    res = await client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 201
    assert res.json()["email"] == email

@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    """Verify user registration returns Conflict when email exists."""
    email = f"testduplicate_{random.randint(1000, 9999)}@siet.in"
    payload = {
        "name": "Register User",
        "email": email,
        "password": "Password123"
    }
    res = await client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 201

    res = await client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 409
    assert res.json()["success"] is False
