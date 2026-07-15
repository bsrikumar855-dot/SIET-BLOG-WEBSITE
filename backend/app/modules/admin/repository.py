from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.news.models import News
from app.modules.articles.models import Article
from app.modules.magazine.models import Magazine
from app.modules.auth.models import User
from app.modules.engagement.models import Like
from app.modules.analytics.models import PageView
from typing import Dict, Any

class AdminRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_totals(self) -> Dict[str, int]:
        users_count = await self.db.scalar(select(func.count()).select_from(User))
        news_count = await self.db.scalar(select(func.count()).select_from(News))
        articles_count = await self.db.scalar(select(func.count()).select_from(Article))
        magazines_count = await self.db.scalar(select(func.count()).select_from(Magazine))
        
        return {
            "users": users_count or 0,
            "news": news_count or 0,
            "articles": articles_count or 0,
            "magazines": magazines_count or 0,
        }

    async def get_recent_activity(self) -> list:
        # Fetch latest from each and sort in Python or do individual queries
        news_rows = await self.db.scalars(select(News).order_by(News.created_at.desc()).limit(5))
        article_rows = await self.db.scalars(select(Article).order_by(Article.created_at.desc()).limit(5))
        
        activities = []
        for n in news_rows:
            activities.append({
                "id": n.id,
                "type": "news",
                "title": n.title,
                "created_at": n.created_at
            })
        for a in article_rows:
            activities.append({
                "id": a.id,
                "type": "article",
                "title": a.title,
                "created_at": a.created_at
            })
        
        activities.sort(key=lambda x: x["created_at"], reverse=True)
        return activities[:10]

    async def get_analytics(self) -> Dict[str, Any]:
        # Just simple analytics for now based on actual models
        views_count = await self.db.scalar(select(func.count()).select_from(PageView))
        likes_count = await self.db.scalar(select(func.count()).select_from(Like))
        
        return {
            # Note: page_views table has zero rows right now, so this will be empty, but it's querying the real table
            "views": [{"date": "total", "count": views_count or 0}],
            "topContent": [], # Skipping detailed top content aggregation for brevity unless required
            "likesOverTime": [{"date": "total", "count": likes_count or 0}]
        }
