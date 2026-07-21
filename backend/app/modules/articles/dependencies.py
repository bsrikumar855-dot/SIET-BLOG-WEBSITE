from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.articles.repository import ArticleRepository
from app.modules.articles.service import ArticleService


def get_article_repository(db: AsyncSession = Depends(get_db)) -> ArticleRepository:
    return ArticleRepository(db)

def get_article_service(repository: ArticleRepository = Depends(get_article_repository)) -> ArticleService:
    return ArticleService(repository)
