from typing import Optional, List, Tuple
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.news.models import News
from app.modules.news.schemas import NewsUpdate
from app.shared.types.content import ContentStatus

from app.shared.repository.base import BaseRepository

class NewsRepository(BaseRepository[News]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, News)

    async def get_by_slug(self, slug: str) -> Optional[News]:
        result = await self.db.execute(select(News).where(News.slug == slug))
        return result.scalars().first()

    async def get_paginated(
        self, 
        limit: int = 20, 
        cursor_id: Optional[int] = None, 
        status: Optional[ContentStatus] = None
    ) -> List[News]:
        query = select(News)
        
        if status:
            query = query.where(News.status == status)
            
        if cursor_id is not None:
            query = query.where(News.id < cursor_id)
            
        # Default order by descending ID for cursor pagination
        query = query.order_by(desc(News.id)).limit(limit + 1)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
