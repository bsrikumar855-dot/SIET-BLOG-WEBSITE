from fastapi import APIRouter, Depends, Response
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.modules.articles.models import Article
from app.modules.auth.constants import ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import User
from app.modules.auth.schemas import LoginRequest, RegisterRequest
from app.modules.auth.service import AuthService
from app.modules.contract_helpers import (
    get_domain_map,
    get_media_map,
    get_user_map,
    serialize_article,
    serialize_domain,
    serialize_magazine,
    serialize_news,
    serialize_user,
)
from app.modules.domains.models import Domain
from app.modules.magazine.models import Magazine
from app.modules.news.models import News
from app.shared.types.content import ContentStatus

router = APIRouter(tags=["Public Contract"])


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str | None = None) -> None:
    response.set_cookie(
        key=settings.ACCESS_COOKIE_NAME,
        value=access_token,
        max_age=ACCESS_COOKIE_MAX_AGE,
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
    )
    if refresh_token:
        response.set_cookie(
            key=settings.REFRESH_COOKIE_NAME,
            value=refresh_token,
            max_age=REFRESH_COOKIE_MAX_AGE,
            secure=settings.COOKIE_SECURE,
            httponly=True,
            samesite=settings.COOKIE_SAMESITE,
            domain=settings.COOKIE_DOMAIN,
        )


@router.post("/login")
async def login_alias(response: Response, data: LoginRequest, db: AsyncSession = Depends(get_db)):
    access_token, refresh_token, user = await AuthService(db).login(data)
    _set_auth_cookies(response, access_token, refresh_token)
    return serialize_user(user)


@router.post("/logout")
async def logout_alias(response: Response):
    response.delete_cookie(key=settings.ACCESS_COOKIE_NAME, domain=settings.COOKIE_DOMAIN)
    response.delete_cookie(key=settings.REFRESH_COOKIE_NAME, domain=settings.COOKIE_DOMAIN)
    return {"success": True}


@router.get("/me")
async def me_alias(current_user: User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.post("/register")
async def register_alias(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user = await AuthService(db).register(data)
    return serialize_user(user)


@router.get("/home")
async def home(db: AsyncSession = Depends(get_db)):
    domains = await get_domain_map(db)
    users = await get_user_map(db)
    media = await get_media_map(db)
    news_rows = list((await db.execute(select(News).where(News.status == ContentStatus.PUBLISHED).order_by(News.id.desc()).limit(8))).scalars().all())
    article_rows = list((await db.execute(select(Article).where(Article.status == ContentStatus.PUBLISHED).order_by(Article.id.desc()).limit(8))).scalars().all())
    magazine_rows = list((await db.execute(select(Magazine).where(Magazine.status == ContentStatus.PUBLISHED).order_by(Magazine.id.desc()).limit(8))).scalars().all())
    domain_rows = list((await db.execute(select(Domain).order_by(Domain.name).limit(12))).scalars().all())

    return {
        "news": [await serialize_news(db, row, domains=domains, media=media) for row in news_rows],
        "articles": [await serialize_article(db, row, domains=domains, users=users, media=media) for row in article_rows],
        "magazine": [await serialize_magazine(db, row, media=media) for row in magazine_rows],
        "domains": [serialize_domain(row) for row in domain_rows],
        "newsCount": await db.scalar(select(func.count()).select_from(News).where(News.status == ContentStatus.PUBLISHED)) or 0,
        "articlesCount": await db.scalar(select(func.count()).select_from(Article).where(Article.status == ContentStatus.PUBLISHED)) or 0,
        "magazineCount": await db.scalar(select(func.count()).select_from(Magazine).where(Magazine.status == ContentStatus.PUBLISHED)) or 0,
        "featureMosaic": [],
    }
