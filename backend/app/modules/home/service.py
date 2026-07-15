from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.articles.models import Article
from app.modules.magazine.models import Magazine
from app.modules.news.models import News
from app.modules.analytics.models import TrendingMetric
from app.shared.types.content import ContentStatus, ContentKind
from app.modules.contract_helpers import (
    get_domain_map,
    get_media_map,
    get_user_map,
    serialize_article,
    serialize_magazine,
    serialize_news,
)

class HomeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_home_payload(self) -> dict:
        domains = await get_domain_map(self.db)
        users = await get_user_map(self.db)
        media = await get_media_map(self.db)

        # Placeholder for featured (most recent news). In the future, this should be driven by a 'featured' flag.
        featured_rows = list((await self.db.execute(select(News).where(News.status == ContentStatus.PUBLISHED).order_by(News.id.desc()).limit(4))).scalars().all())
        
        # Trending queries the actual metrics table
        trending_rows = list((await self.db.execute(
            select(News)
            .join(TrendingMetric, News.id == TrendingMetric.content_id)
            .where(TrendingMetric.content_kind == ContentKind.NEWS, News.status == ContentStatus.PUBLISHED)
            .order_by(TrendingMetric.score.desc())
            .limit(4)
        )).scalars().all())
        article_rows = list((await self.db.execute(select(Article).where(Article.status == ContentStatus.PUBLISHED).order_by(Article.id.desc()).limit(8))).scalars().all())
        magazine_rows = list((await self.db.execute(select(Magazine).where(Magazine.status == ContentStatus.PUBLISHED).order_by(Magazine.id.desc()).limit(8))).scalars().all())

        return {
            "featured": [await serialize_news(self.db, row, domains=domains, media=media) for row in featured_rows],
            "trending": [await serialize_news(self.db, row, domains=domains, media=media) for row in trending_rows],
            "latestArticles": [await serialize_article(self.db, row, domains=domains, users=users, media=media) for row in article_rows],
            "latestAchievements": [await serialize_magazine(self.db, row, media=media) for row in magazine_rows],
        }
