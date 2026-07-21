from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.analytics.models import TrendingMetric
from app.modules.articles.models import Article
from app.modules.contract_helpers import (
    get_domain_map,
    get_media_map,
    get_user_map,
    serialize_article,
    serialize_magazine,
    serialize_news,
)
from app.modules.magazine.models import Magazine
from app.modules.news.models import News
from app.shared.types.content import ContentKind, ContentStatus


class HomeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_home_data(self, current_user_id: int | None = None) -> dict:
        domains = await get_domain_map(self.db)
        users = await get_user_map(self.db)
        media = await get_media_map(self.db)

        # 1. Featured News (latest 6 published news)
        featured_rows = list(
            (
                await self.db.execute(
                    select(News)
                    .where(News.status == ContentStatus.PUBLISHED)
                    .order_by(News.published_at.desc().nullslast(), News.id.desc())
                    .limit(6)
                )
            )
            .scalars()
            .all()
        )

        # 2. Trending News (driven by the real TrendingMetric table)
        trending_rows = list(
            (
                await self.db.execute(
                    select(News)
                    .join(TrendingMetric, News.id == TrendingMetric.content_id)
                    .where(
                        TrendingMetric.content_kind == ContentKind.NEWS,
                        News.status == ContentStatus.PUBLISHED,
                    )
                    .order_by(TrendingMetric.score.desc())
                    .limit(6)
                )
            )
            .scalars()
            .all()
        )

        # 3. Latest Articles (latest 8 published articles)
        article_rows = list(
            (
                await self.db.execute(
                    select(Article)
                    .where(Article.status == ContentStatus.PUBLISHED)
                    .order_by(Article.published_at.desc().nullslast(), Article.id.desc())
                    .limit(8)
                )
            )
            .scalars()
            .all()
        )

        # 4. Latest Achievements (latest 8 published magazine items)
        magazine_rows = list(
            (
                await self.db.execute(
                    select(Magazine)
                    .options(
                        selectinload(Magazine.achievements),
                        selectinload(Magazine.project_links),
                    )
                    .where(Magazine.status == ContentStatus.PUBLISHED)
                    .order_by(Magazine.published_at.desc().nullslast(), Magazine.id.desc())
                    .limit(8)
                )
            )
            .scalars()
            .all()
        )

        featured = [
            await serialize_news(
                self.db,
                row,
                domains=domains,
                media=media,
                current_user_id=current_user_id,
            )
            for row in featured_rows
        ]

        trending = [
            await serialize_news(
                self.db,
                row,
                domains=domains,
                media=media,
                current_user_id=current_user_id,
            )
            for row in trending_rows
        ]

        latest_articles = [
            await serialize_article(
                self.db,
                row,
                domains=domains,
                users=users,
                media=media,
                current_user_id=current_user_id,
            )
            for row in article_rows
        ]

        latest_achievements = [
            await serialize_magazine(
                self.db,
                row,
                domains=domains,
                media=media,
                current_user_id=current_user_id,
            )
            for row in magazine_rows
        ]

        return {
            "featured": featured,
            "trending": trending,
            "latestArticles": latest_articles,
            "latestAchievements": latest_achievements,
        }
