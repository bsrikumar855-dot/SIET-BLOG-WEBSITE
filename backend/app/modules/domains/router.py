from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends

from app.core.database import get_db
from app.modules.articles.models import Article
from app.modules.contract_helpers import serialize_domain
from app.modules.domains.models import Domain
from app.modules.magazine.models import Magazine
from app.modules.news.models import News
from app.shared.exceptions.custom import NotFoundException
from app.shared.types.content import ContentStatus

router = APIRouter(prefix="/domains", tags=["Domains"])


async def _domain_count(db: AsyncSession, domain_id: int) -> int:
    news_count = await db.scalar(select(func.count()).select_from(News).where(News.domain_id == domain_id, News.status == ContentStatus.PUBLISHED)) or 0
    article_count = await db.scalar(select(func.count()).select_from(Article).where(Article.domain_id == domain_id, Article.status == ContentStatus.PUBLISHED)) or 0
    return news_count + article_count


@router.get("")
async def list_domains(db: AsyncSession = Depends(get_db)):
    domains = list((await db.execute(select(Domain).order_by(Domain.name))).scalars().all())
    return [serialize_domain(domain, await _domain_count(db, domain.id)) for domain in domains]


@router.get("/{domain}")
async def get_domain(domain: str, db: AsyncSession = Depends(get_db)):
    row = (await db.execute(select(Domain).where(Domain.slug == domain))).scalars().first()
    if not row:
        raise NotFoundException("Domain not found.")
    return serialize_domain(row, await _domain_count(db, row.id))
