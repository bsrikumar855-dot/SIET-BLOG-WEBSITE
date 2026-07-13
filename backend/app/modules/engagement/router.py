from typing import Any

from fastapi import APIRouter, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.repository import UserRepository
from app.modules.engagement.models import Bookmark, Like
from app.modules.engagement.repository import EngagementRepository
from app.modules.engagement.service import EngagementService
from app.shared.exceptions.custom import NotFoundException, UnauthorizedException
from app.shared.types.content import ContentKind

router = APIRouter(prefix="/engagement", tags=["Engagement"])


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


async def _required_user(db: AsyncSession, request: Request):
    user = await _current_user(db, request)
    if not user:
        raise UnauthorizedException("Authentication required.")
    return user


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
    item = await _content_by_slug(db, model, slug)
    user = await _required_user(db, request)
    result = await EngagementService(EngagementRepository(db)).toggle_like(user, item.id, kind)
    return {"liked": result.status, "count": await EngagementRepository(db).count_likes(item.id, kind)}


async def unlike_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    item = await _content_by_slug(db, model, slug)
    user = await _required_user(db, request)
    repo = EngagementRepository(db)
    existing = await repo.get_like(user.id, item.id, kind)
    if existing:
        await repo.remove_like(existing)
        await db.commit()
    return {"liked": False, "count": await repo.count_likes(item.id, kind)}


async def bookmark_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    item = await _content_by_slug(db, model, slug)
    user = await _required_user(db, request)
    result = await EngagementService(EngagementRepository(db)).toggle_bookmark(user, item.id, kind)
    return {"bookmarked": result.status}


async def unbookmark_contract(
    db: AsyncSession,
    request: Request,
    model: Any,
    slug: str,
    kind: ContentKind,
):
    item = await _content_by_slug(db, model, slug)
    user = await _required_user(db, request)
    repo = EngagementRepository(db)
    existing = await repo.get_bookmark(user.id, item.id, kind)
    if existing:
        await repo.remove_bookmark(existing)
        await db.commit()
    return {"bookmarked": False}
