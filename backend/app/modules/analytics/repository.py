from datetime import date

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.analytics.models import PageView, TrendingMetric
from app.modules.engagement.models import Bookmark, Like
from app.shared.repository.base import BaseRepository
from app.shared.types.content import ContentKind


class AnalyticsRepository(BaseRepository[PageView]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, PageView)

    async def record_view(self, content_id: int, content_kind: ContentKind, user_id: int | None) -> PageView:
        view = PageView(content_id=content_id, content_kind=content_kind, user_id=user_id)
        self.db.add(view)
        return view

    async def get_total_views(self) -> int:
        query = select(func.count()).select_from(PageView)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_total_likes(self) -> int:
        query = select(func.count()).select_from(Like)
        result = await self.db.execute(query)
        return result.scalar() or 0
        
    async def get_total_bookmarks(self) -> int:
        query = select(func.count()).select_from(Bookmark)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_trending(self, current_date: date, limit: int = 10) -> list[TrendingMetric]:
        query = select(TrendingMetric).where(TrendingMetric.calculated_date == current_date)\
            .order_by(desc(TrendingMetric.score)).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # In a real scenario, this would aggregate views over the last N days
    async def calculate_and_save_trending(self, current_date: date) -> None:
        # A simple stub: group by content_id and count views to update trending scores
        query = select(PageView.content_id, PageView.content_kind, func.count(PageView.id).label("score"))\
            .group_by(PageView.content_id, PageView.content_kind)
        
        result = await self.db.execute(query)
        rows = result.all()
        
        for row in rows:
            metric = TrendingMetric(
                content_id=row.content_id,
                content_kind=row.content_kind,
                score=float(row.score),
                calculated_date=current_date
            )
            self.db.add(metric)
