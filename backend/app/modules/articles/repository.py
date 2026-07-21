
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.articles.models import Article
from app.shared.repository.base import BaseRepository
from app.shared.types.content import ContentStatus


class ArticleRepository(BaseRepository[Article]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Article)

    async def get_by_slug(self, slug: str) -> Article | None:
        result = await self.db.execute(select(Article).where(Article.slug == slug))
        return result.scalars().first()

    async def get_paginated(
        self, 
        limit: int = 20, 
        cursor_id: int | None = None, 
        status: ContentStatus | None = None
    ) -> list[Article]:
        query = select(Article)
        
        if status:
            query = query.where(Article.status == status)
            
        if cursor_id is not None:
            query = query.where(Article.id < cursor_id)
            
        query = query.order_by(desc(Article.id)).limit(limit + 1)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
