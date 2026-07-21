import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_admin_dashboard_unauthorized(client: AsyncClient):
    res = await client.get("/api/v1/admin/dashboard")
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_admin_dashboard_authorized(client: AsyncClient, verified_user_token: str):
    res = await client.get(
        "/api/v1/admin/dashboard",
        headers={"Authorization": f"Bearer {verified_user_token}"}
    )
    assert res.status_code == 403
