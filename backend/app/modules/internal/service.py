from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.search.client import MeilisearchClient
from app.modules.analytics.repository import AnalyticsRepository
from app.modules.analytics.service import AnalyticsService
from app.modules.articles.models import Article
from app.modules.magazine.models import Magazine
from app.modules.news.models import News
from app.shared.types.content import ContentStatus


class InternalService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.search_client = MeilisearchClient()

    async def reindex_search(self) -> dict:
        """Push every published news/article/magazine row into its Meilisearch index."""
        counts = {"news": 0, "articles": 0, "magazine": 0}

        news_rows = (
            await self.db.execute(select(News).where(News.status == ContentStatus.PUBLISHED))
        ).scalars().all()
        for news_row in news_rows:
            ok = await self.search_client.index_document(
                "news",
                {
                    "id": news_row.id,
                    "slug": news_row.slug,
                    "title": news_row.title,
                    "content": news_row.content,
                    "excerpt": news_row.excerpt,
                },
            )
            if ok:
                counts["news"] += 1

        article_rows = (
            await self.db.execute(select(Article).where(Article.status == ContentStatus.PUBLISHED))
        ).scalars().all()
        for article_row in article_rows:
            ok = await self.search_client.index_document(
                "articles",
                {
                    "id": article_row.id,
                    "slug": article_row.slug,
                    "title": article_row.title,
                    "content": article_row.content,
                    "excerpt": article_row.excerpt,
                },
            )
            if ok:
                counts["articles"] += 1

        magazine_rows = (
            await self.db.execute(select(Magazine).where(Magazine.status == ContentStatus.PUBLISHED))
        ).scalars().all()
        for magazine_row in magazine_rows:
            ok = await self.search_client.index_document(
                "magazine",
                {
                    "id": magazine_row.id,
                    "slug": magazine_row.slug,
                    "title": magazine_row.title,
                    "description": magazine_row.description,
                },
            )
            if ok:
                counts["magazine"] += 1

        total = sum(counts.values())
        return {"status": "success", "message": f"Reindexed {total} documents.", "counts": counts}

    async def trigger_analytics(self) -> dict:
        service = AnalyticsService(AnalyticsRepository(self.db))
        await service.trigger_trending_calculation()
        return {"status": "success", "message": "Trending metrics recalculated."}
