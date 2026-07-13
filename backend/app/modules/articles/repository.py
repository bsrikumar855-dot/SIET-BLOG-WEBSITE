from typing import Optional, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.articles.models import Article
from app.modules.articles.schemas import ArticleUpdate
from app.shared.types.content import ContentStatus

from app.shared.repository.base import BaseRepository

class ArticleRepository(BaseRepository[Article]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Article)

    async def get_by_slug(self, slug: str) -> Optional[Article]:
        result = await self.db.execute(select(Article).where(Article.slug == slug))
        return result.scalars().first()

    async def get_paginated(
        self, 
        limit: int = 20, 
        cursor_id: Optional[int] = None, 
        status: Optional[ContentStatus] = None
    ) -> List[Article]:
        query = select(Article)
        
        if status:
            query = query.where(Article.status == status)
            
        if cursor_id is not None:
            query = query.where(Article.id < cursor_id)
            
        query = query.order_by(desc(Article.id)).limit(limit + 1)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
