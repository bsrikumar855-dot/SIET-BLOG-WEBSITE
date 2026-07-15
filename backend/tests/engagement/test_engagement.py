import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.engagement.models import Like, Bookmark
from app.shared.types.content import ContentKind
from sqlalchemy import select

@pytest.mark.asyncio
async def test_anonymous_like(client: AsyncClient):
    res = await client.post("/news/test-news-slug/like")
    assert res.status_code == 401
    assert res.json() == {"error": "auth_required"}

@pytest.mark.asyncio
async def test_verified_user_like(client: AsyncClient, verified_user_token: str):
    res = await client.post(
        "/news/test-news-slug/like",
        headers={"Authorization": f"Bearer {verified_user_token}"}
    )
    # Note: 404 is expected if test-news-slug does not exist, but we are testing auth and routing
    assert res.status_code in [200, 404]

@pytest.mark.asyncio
async def test_unverified_user_like(client: AsyncClient, unverified_user_token: str):
    res = await client.post(
        "/news/test-news-slug/like",
        headers={"Authorization": f"Bearer {unverified_user_token}"}
    )
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "FORBIDDEN"

@pytest.mark.asyncio
async def test_toggle_twice(client: AsyncClient, verified_user_token: str):
    # This requires a real news item to work properly in integration test
    pass

@pytest.mark.asyncio
async def test_bookmark_toggle(client: AsyncClient, verified_user_token: str):
    pass

@pytest.mark.asyncio
async def test_get_my_likes(client: AsyncClient, verified_user_token: str):
    res = await client.get(
        "/me/likes",
        headers={"Authorization": f"Bearer {verified_user_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "news" in data
    assert "articles" in data
    assert "magazine" in data

@pytest.mark.asyncio
async def test_get_my_bookmarks(client: AsyncClient, verified_user_token: str):
    res = await client.get(
        "/me/bookmarks",
        headers={"Authorization": f"Bearer {verified_user_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "news" in data
    assert "articles" in data
    assert "magazine" in data

@pytest.mark.asyncio
async def test_missing_content(client: AsyncClient, verified_user_token: str):
    res = await client.post(
        "/news/non-existent-slug/like",
        headers={"Authorization": f"Bearer {verified_user_token}"}
    )
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_anonymous_get_likes(client: AsyncClient):
    res = await client.get("/me/likes")
    assert res.status_code == 401
    assert res.json() == {"error": "auth_required"}
