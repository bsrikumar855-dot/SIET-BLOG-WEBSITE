from sqlalchemy import func, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, Query, Request

from app.core.database import get_db
from app.modules.contract_helpers import (
    get_media_map,
    normalize_limit,
    normalize_page,
    paginated_payload,
    search_filter,
    serialize_magazine,
)
from app.modules.engagement.router import bookmark_contract, bookmark_status_contract, like_contract, like_status_contract, unlike_contract, unbookmark_contract
from app.modules.magazine.models import Magazine
from app.shared.exceptions.custom import NotFoundException
from app.shared.types.content import ContentKind, ContentStatus, MagazineType

router = APIRouter(prefix="/magazine", tags=["Magazine"])


def _current_user_id(request: Request) -> int | None:
    return int(request.state.user) if getattr(request.state, "user", None) else None


async def _magazine_page(
    db: AsyncSession,
    request: Request,
    page: int,
    limit: int,
    magazine_type: str | None = None,
    year: int | None = None,
    q: str | None = None,
):
    page = normalize_page(page)
    limit = normalize_limit(limit)
    query = select(Magazine).options(selectinload(Magazine.achievements), selectinload(Magazine.project_links)).where(Magazine.status == ContentStatus.PUBLISHED)
    count_query = select(func.count()).select_from(Magazine).where(Magazine.status == ContentStatus.PUBLISHED)

    if magazine_type:
        try:
            parsed_type = MagazineType(magazine_type)
        except ValueError:
            raise NotFoundException("Magazine type not found.")
        query = query.where(Magazine.magazine_type == parsed_type)
        count_query = count_query.where(Magazine.magazine_type == parsed_type)

    if year:
        query = query.where(Magazine.publication_year == year)
        count_query = count_query.where(Magazine.publication_year == year)

    if q:
        predicate = search_filter(Magazine, q)
        query = query.where(predicate)
        count_query = count_query.where(predicate)

    total = await db.scalar(count_query) or 0
    result = await db.execute(query.order_by(Magazine.published_at.desc().nullslast(), Magazine.id.desc()).offset((page - 1) * limit).limit(limit))
    rows = list(result.scalars().all())
    media = await get_media_map(db)
    items = [await serialize_magazine(db, row, media=media, current_user_id=_current_user_id(request)) for row in rows]
    return paginated_payload(items, page, limit, total)


@router.get("")
async def list_magazine(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    q: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    return await _magazine_page(db, request, page, limit, q=q)


@router.get("/type/{type}")
async def magazine_by_type(
    type: str,
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await _magazine_page(db, request, page, limit, magazine_type=type)


@router.get("/year/{year}")
async def magazine_by_year(
    year: int,
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await _magazine_page(db, request, page, limit, year=year)


@router.get("/{slug}")
async def get_magazine_by_slug(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    row = (
        await db.execute(
            select(Magazine)
            .options(selectinload(Magazine.achievements), selectinload(Magazine.project_links))
            .where(Magazine.slug == slug)
        )
    ).scalars().first()
    if not row:
        raise NotFoundException("Magazine item not found.")
    return await serialize_magazine(db, row, current_user_id=_current_user_id(request))


@router.get("/{slug}/like/status")
async def magazine_like_status(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await like_status_contract(db, request, Magazine, slug, ContentKind.MAGAZINE)


@router.post("/{slug}/like")
async def magazine_like(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await like_contract(db, request, Magazine, slug, ContentKind.MAGAZINE)


@router.delete("/{slug}/like")
async def magazine_unlike(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await unlike_contract(db, request, Magazine, slug, ContentKind.MAGAZINE)


@router.get("/{slug}/bookmark/status")
async def magazine_bookmark_status(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await bookmark_status_contract(db, request, Magazine, slug, ContentKind.MAGAZINE)


@router.post("/{slug}/bookmark")
async def magazine_bookmark(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await bookmark_contract(db, request, Magazine, slug, ContentKind.MAGAZINE)


@router.delete("/{slug}/bookmark")
async def magazine_unbookmark(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await unbookmark_contract(db, request, Magazine, slug, ContentKind.MAGAZINE)
