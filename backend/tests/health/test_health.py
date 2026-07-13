import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_endpoints(client: AsyncClient):
    """Verify health endpoints respond successfully and return healthy status."""
    res = await client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["data"]["status"] == "healthy"

    res = await client.get("/api/v1/health/db")
    assert res.status_code == 200
    assert res.json()["data"]["status"] == "healthy"

    res = await client.get("/api/v1/health/search")
    assert res.status_code == 200
    assert res.json()["data"]["status"] == "healthy"

    res = await client.get("/api/v1/health/storage")
    assert res.status_code == 200
    assert res.json()["data"]["status"] == "healthy"
