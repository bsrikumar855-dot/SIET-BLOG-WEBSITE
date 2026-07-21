from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.news.repository import NewsRepository
from app.modules.news.service import NewsService


def get_news_repository(db: AsyncSession = Depends(get_db)) -> NewsRepository:
    return NewsRepository(db)

def get_news_service(repository: NewsRepository = Depends(get_news_repository)) -> NewsService:
    return NewsService(repository)
