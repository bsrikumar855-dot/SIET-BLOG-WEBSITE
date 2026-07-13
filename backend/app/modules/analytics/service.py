from typing import Optional
from datetime import datetime, timezone
from app.modules.analytics.repository import AnalyticsRepository
from app.modules.analytics.schemas import RecordViewRequest, DashboardMetricsResponse, TrendingItemResponse

class AnalyticsService:
    def __init__(self, repository: AnalyticsRepository):
        self.repository = repository

    async def record_view(self, request: RecordViewRequest, user_id: Optional[int] = None) -> None:
        await self.repository.record_view(request.content_id, request.content_kind, user_id)
        await self.repository.db.commit()

    async def get_dashboard_metrics(self) -> DashboardMetricsResponse:
        current_date = datetime.now(timezone.utc).date()
        
        # In a real system, background tasks would populate the trending metrics
        # For immediate results if empty, we might calculate on the fly, but this violates 
        # the rule of not putting long-running aggregation in the synchronous request path.
        # We will assume a background job calls `calculate_and_save_trending`.
        
        total_views = await self.repository.get_total_views()
        total_likes = await self.repository.get_total_likes()
        total_bookmarks = await self.repository.get_total_bookmarks()
        
        trending_data = await self.repository.get_trending(current_date)
        
        top_content = [
            TrendingItemResponse(
                content_id=item.content_id,
                content_kind=item.content_kind,
                score=item.score
            ) for item in trending_data
        ]
        
        return DashboardMetricsResponse(
            total_views=total_views,
            total_likes=total_likes,
            total_bookmarks=total_bookmarks,
            top_content=top_content
        )

    async def trigger_trending_calculation(self) -> None:
        """Triggered by background worker or internal API to calculate trending items."""
        current_date = datetime.now(timezone.utc).date()
        await self.repository.calculate_and_save_trending(current_date)
        await self.repository.db.commit()
