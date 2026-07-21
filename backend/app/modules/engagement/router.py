from typing import Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.articles.models import Article
from app.modules.auth.repository import UserRepository
from app.modules.contract_helpers import (
    get_domain_map,
    get_media_map,
    get_user_map,
    serialize_article,
    serialize_magazine,
    serialize_news,
)
from app.modules.engagement.models import Bookmark, Like
from app.modules.engagement.repository import EngagementRepository
from app.modules.engagement.service import EngagementService
from app.modules.magazine.models import Magazine
from app.modules.news.models import News
from app.shared.exceptions.custom import ForbiddenException, NotFoundException
from app.shared.types.content import ContentKind

router = APIRouter(tags=["Engagement"])

_CONTENT_TYPES: dict[str, tuple[Any, ContentKind]] = {
    "news": (News, ContentKind.NEWS),
    "articles": (Article, ContentKind.ARTICLE),
    "magazine": (Magazine, ContentKind.MAGAZINE),
}


async def _content_by_slug(db: AsyncSession, model: Any, slug: str):
    row = (await db.execute(select(model).where(model.slug == slug))).scalars().first()
    if not row:
        raise NotFoundException("Content item not found.")
    return row


async def _current_user(db: AsyncSession, request: Request):
    user_id = getattr(request.state, "user", None)
    if not user_id:
        return None
    return await UserRepository(db).get_by_id(int(user_id))


async def like_status_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    item = await _content_by_slug(db, model, slug)
    user = await _current_user(db, request)
    repo = EngagementRepository(db)
    liked = bool(await repo.get_like(user.id, item.id, kind)) if user else False
    return {"liked": liked, "count": await repo.count_likes(item.id, kind)}


async def bookmark_status_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    item = await _content_by_slug(db, model, slug)
    user = await _current_user(db, request)
    repo = EngagementRepository(db)
    bookmarked = bool(await repo.get_bookmark(user.id, item.id, kind)) if user else False
    return {"bookmarked": bookmarked}


async def like_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    user = await _current_user(db, request)
    if not user:
        return JSONResponse(status_code=401, content={"error": "auth_required"})
    if not user.email_verified:
        raise ForbiddenException("Email not verified.")
    item = await _content_by_slug(db, model, slug)
    result = await EngagementService(EngagementRepository(db)).toggle_like(user, item.id, kind)
    return {"liked": result.status, "count": await EngagementRepository(db).count_likes(item.id, kind)}


async def unlike_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    user = await _current_user(db, request)
    if not user:
        return JSONResponse(status_code=401, content={"error": "auth_required"})
    if not user.email_verified:
        raise ForbiddenException("Email not verified.")
    item = await _content_by_slug(db, model, slug)
    await EngagementService(EngagementRepository(db)).remove_like(user, item.id, kind)
    return {"liked": False, "count": await EngagementRepository(db).count_likes(item.id, kind)}


async def bookmark_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    user = await _current_user(db, request)
    if not user:
        return JSONResponse(status_code=401, content={"error": "auth_required"})
    if not user.email_verified:
        raise ForbiddenException("Email not verified.")
    item = await _content_by_slug(db, model, slug)
    result = await EngagementService(EngagementRepository(db)).toggle_bookmark(user, item.id, kind)
    return {"bookmarked": result.status}


async def unbookmark_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    user = await _current_user(db, request)
    if not user:
        return JSONResponse(status_code=401, content={"error": "auth_required"})
    if not user.email_verified:
        raise ForbiddenException("Email not verified.")
    item = await _content_by_slug(db, model, slug)
    await EngagementService(EngagementRepository(db)).remove_bookmark(user, item.id, kind)
    return {"bookmarked": False}


@router.get("/{content_type}/{slug}/like/status")
async def get_like_status(content_type: str, slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    model, kind = _content_by_type(content_type)
    return await like_status_contract(db, request, model, slug, kind)


@router.post("/{content_type}/{slug}/like")
async def post_like(content_type: str, slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    model, kind = _content_by_type(content_type)
    return await like_contract(db, request, model, slug, kind)


@router.delete("/{content_type}/{slug}/like")
async def delete_like(content_type: str, slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    model, kind = _content_by_type(content_type)
    return await unlike_contract(db, request, model, slug, kind)


@router.get("/{content_type}/{slug}/bookmark/status")
async def get_bookmark_status(content_type: str, slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    model, kind = _content_by_type(content_type)
    return await bookmark_status_contract(db, request, model, slug, kind)


@router.post("/{content_type}/{slug}/bookmark")
async def post_bookmark(content_type: str, slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    model, kind = _content_by_type(content_type)
    return await bookmark_contract(db, request, model, slug, kind)


@router.delete("/{content_type}/{slug}/bookmark")
async def delete_bookmark(content_type: str, slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    model, kind = _content_by_type(content_type)
    return await unbookmark_contract(db, request, model, slug, kind)


def _content_by_type(content_type: str) -> tuple[Any, ContentKind]:
    entry = _CONTENT_TYPES.get(content_type)
    if not entry:
        raise NotFoundException("Unknown content type.")
    return entry


async def _serialize_liked_or_bookmarked(db: AsyncSession, user_id: int, rows: list[Like] | list[Bookmark]) -> dict[str, Any]:
    domains = await get_domain_map(db)
    users = await get_user_map(db)
    media = await get_media_map(db)

    by_kind: dict[ContentKind, list[int]] = {ContentKind.NEWS: [], ContentKind.ARTICLE: [], ContentKind.MAGAZINE: []}
    for row in rows:
        by_kind[row.content_kind].append(row.content_id)

    news_rows = []
    if by_kind[ContentKind.NEWS]:
        news_rows = (await db.execute(select(News).where(News.id.in_(by_kind[ContentKind.NEWS])))).scalars().all()
    article_rows = []
    if by_kind[ContentKind.ARTICLE]:
        article_rows = (await db.execute(select(Article).where(Article.id.in_(by_kind[ContentKind.ARTICLE])))).scalars().all()
    magazine_rows = []
    if by_kind[ContentKind.MAGAZINE]:
        magazine_rows = (await db.execute(select(Magazine).where(Magazine.id.in_(by_kind[ContentKind.MAGAZINE])))).scalars().all()

    return {
        "news": [await serialize_news(db, row, domains=domains, media=media, current_user_id=user_id) for row in news_rows],
        "articles": [await serialize_article(db, row, domains=domains, users=users, media=media, current_user_id=user_id) for row in article_rows],
        "magazine": [await serialize_magazine(db, row, domains=domains, media=media, current_user_id=user_id) for row in magazine_rows],
    }


@router.get("/me/likes")
async def get_my_likes(request: Request, db: AsyncSession = Depends(get_db)):
    user = await _current_user(db, request)
    if not user:
        return JSONResponse(status_code=401, content={"error": "auth_required"})
    likes = (await db.execute(select(Like).where(Like.user_id == user.id))).scalars().all()
    return await _serialize_liked_or_bookmarked(db, user.id, likes)


@router.get("/me/bookmarks")
async def get_my_bookmarks(request: Request, db: AsyncSession = Depends(get_db)):
    user = await _current_user(db, request)
    if not user:
        return JSONResponse(status_code=401, content={"error": "auth_required"})
    bookmarks = (await db.execute(select(Bookmark).where(Bookmark.user_id == user.id))).scalars().all()
    return await _serialize_liked_or_bookmarked(db, user.id, bookmarks)
