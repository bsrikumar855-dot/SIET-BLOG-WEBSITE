from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.modules.articles.models import Article
from app.modules.contract_helpers import (
    get_domain_map,
    get_media_map,
    get_user_map,
    search_filter,
    serialize_article,
    serialize_magazine,
    serialize_news,
)
from app.modules.domains.models import Domain
from app.modules.magazine.models import Magazine
from app.modules.news.models import News
from app.shared.types.content import ContentStatus

router = APIRouter(prefix="/search", tags=["Search"])


def _current_user_id(request: Request) -> int | None:
    return int(request.state.user) if getattr(request.state, "user", None) else None


@router.get("")
async def global_search(
    q: str = Query(""),
    type: str = Query("all"),
    domain: str | None = None,
    request: Request = None,  # type: ignore[assignment]  # FastAPI only special-cases the bare `Request` type, not `Request | None`
    db: AsyncSession = Depends(get_db),
):
    domains = await get_domain_map(db)
    users = await get_user_map(db)
    media = await get_media_map(db)
    current_user_id = _current_user_id(request) if request else None
    domain_id = None
    if domain:
        domain_obj = (await db.execute(select(Domain).where(Domain.slug == domain))).scalars().first()
        domain_id = domain_obj.id if domain_obj else -1

    response: dict[str, list[dict]] = {"news": [], "articles": [], "achievements": []}
    if type in ("all", "news"):
        news_query = select(News).where(News.status == ContentStatus.PUBLISHED)
        if q:
            news_query = news_query.where(search_filter(News, q))
        if domain_id is not None:
            news_query = news_query.where(News.domain_id == domain_id)
        news_rows = list((await db.execute(news_query.order_by(News.id.desc()).limit(20))).scalars().all())
        response["news"] = [
            await serialize_news(db, row, domains=domains, media=media, current_user_id=current_user_id)
            for row in news_rows
        ]

    if type in ("all", "articles"):
        article_query = select(Article).where(Article.status == ContentStatus.PUBLISHED)
        if q:
            article_query = article_query.where(search_filter(Article, q))
        if domain_id is not None:
            article_query = article_query.where(Article.domain_id == domain_id)
        article_rows = list((await db.execute(article_query.order_by(Article.id.desc()).limit(20))).scalars().all())
        response["articles"] = [
            await serialize_article(db, row, domains=domains, users=users, media=media, current_user_id=current_user_id)
            for row in article_rows
        ]

    if type in ("all", "magazine"):
        magazine_query = (
            select(Magazine)
            .options(selectinload(Magazine.achievements), selectinload(Magazine.project_links))
            .where(Magazine.status == ContentStatus.PUBLISHED)
        )
        if q:
            magazine_query = magazine_query.where(search_filter(Magazine, q))
        magazine_rows = list((await db.execute(magazine_query.order_by(Magazine.id.desc()).limit(20))).scalars().all())
        response["achievements"] = [
            await serialize_magazine(db, row, domains=domains, media=media, current_user_id=current_user_id)
            for row in magazine_rows
        ]

    return response
