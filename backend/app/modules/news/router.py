from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.contract_helpers import (
    get_domain_map,
    get_media_map,
    normalize_limit,
    normalize_page,
    paginated_payload,
    search_filter,
    serialize_news,
)
from app.modules.domains.models import Domain
from app.modules.engagement.router import (
    bookmark_contract,
    bookmark_status_contract,
    like_contract,
    like_status_contract,
    unbookmark_contract,
    unlike_contract,
)
from app.modules.news.models import News
from app.shared.exceptions.custom import NotFoundException
from app.shared.types.content import ContentKind, ContentStatus

router = APIRouter(prefix="/news", tags=["News"])


def _current_user_id(request: Request) -> int | None:
    return int(request.state.user) if getattr(request.state, "user", None) else None


async def _news_page(
    db: AsyncSession,
    request: Request,
    page: int,
    limit: int,
    domain: str | None = None,
    q: str | None = None,
):
    page = normalize_page(page)
    limit = normalize_limit(limit)
    query = select(News).where(News.status == ContentStatus.PUBLISHED)
    count_query = select(func.count()).select_from(News).where(News.status == ContentStatus.PUBLISHED)

    if domain:
        domain_obj = (await db.execute(select(Domain).where(Domain.slug == domain))).scalars().first()
        if not domain_obj:
            raise NotFoundException("Domain not found.")
        query = query.where(News.domain_id == domain_obj.id)
        count_query = count_query.where(News.domain_id == domain_obj.id)

    if q:
        predicate = search_filter(News, q)
        query = query.where(predicate)
        count_query = count_query.where(predicate)

    total = await db.scalar(count_query) or 0
    result = await db.execute(query.order_by(News.published_at.desc().nullslast(), News.id.desc()).offset((page - 1) * limit).limit(limit))
    rows = list(result.scalars().all())
    domains = await get_domain_map(db)
    media = await get_media_map(db)
    items = [await serialize_news(db, row, domains=domains, media=media, current_user_id=_current_user_id(request)) for row in rows]
    return paginated_payload(items, page, limit, total)


@router.get("")
async def list_news(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await _news_page(db, request, page, limit)


@router.get("/latest")
async def latest_news(
    request: Request,
    limit: int = Query(6, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    payload = await _news_page(db, request, 1, limit)
    return payload["items"]


@router.get("/trending")
async def trending_news(
    request: Request,
    limit: int = Query(6, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    payload = await _news_page(db, request, 1, limit)
    return payload["items"]


@router.get("/domain/{domain}")
async def news_by_domain(
    domain: str,
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await _news_page(db, request, page, limit, domain=domain)


@router.get("/search")
async def search_news(
    q: str,
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await _news_page(db, request, page, limit, q=q)


@router.get("/{slug}")
async def get_news_by_slug(
    slug: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    row = (await db.execute(select(News).where(News.slug == slug))).scalars().first()
    if not row:
        raise NotFoundException("News item not found.")
    return await serialize_news(db, row, current_user_id=_current_user_id(request))


@router.get("/{slug}/like/status")
async def news_like_status(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await like_status_contract(db, request, News, slug, ContentKind.NEWS)


@router.post("/{slug}/like")
async def news_like(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await like_contract(db, request, News, slug, ContentKind.NEWS)


@router.delete("/{slug}/like")
async def news_unlike(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await unlike_contract(db, request, News, slug, ContentKind.NEWS)


@router.get("/{slug}/bookmark/status")
async def news_bookmark_status(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await bookmark_status_contract(db, request, News, slug, ContentKind.NEWS)


@router.post("/{slug}/bookmark")
async def news_bookmark(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await bookmark_contract(db, request, News, slug, ContentKind.NEWS)


@router.delete("/{slug}/bookmark")
async def news_unbookmark(slug: str, request: Request, db: AsyncSession = Depends(get_db)):
    return await unbookmark_contract(db, request, News, slug, ContentKind.NEWS)
