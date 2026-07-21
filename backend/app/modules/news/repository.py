from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.news.models import News
from app.shared.repository.base import BaseRepository
from app.shared.types.content import ContentStatus


class NewsRepository(BaseRepository[News]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, News)

    async def get_by_slug(self, slug: str) -> News | None:
        result = await self.db.execute(select(News).where(News.slug == slug))
        return result.scalars().first()

    async def get_paginated(
        self, 
        limit: int = 20, 
        cursor_id: int | None = None, 
        status: ContentStatus | None = None
    ) -> list[News]:
        query = select(News)
        
        if status:
            query = query.where(News.status == status)
            
        if cursor_id is not None:
            query = query.where(News.id < cursor_id)
            
        # Default order by descending ID for cursor pagination
        query = query.order_by(desc(News.id)).limit(limit + 1)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
