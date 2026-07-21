from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.shared.auth.dependencies import require_admin
from app.modules.auth.models import User
from app.shared.types.content import ContentStatus

from app.modules.admin.schemas import (
    AdminNewsCreate, AdminNewsUpdate, AdminUserCreate, AdminUserUpdate,
    AdminArticleCreate, AdminArticleUpdate, AdminMagazineCreate, AdminMagazineUpdate,
    DashboardResponse, AnalyticsResponse
)
from app.modules.admin.repository import AdminRepository
from app.modules.admin.service import AdminService

from app.modules.news.service import NewsService
from app.modules.news.repository import NewsRepository
from app.modules.news.schemas import NewsPublish

from app.modules.auth.service import AuthService
from app.modules.auth.repository import UserRepository

router = APIRouter(prefix="/admin", tags=["Admin"])

# DASHBOARD & ANALYTICS
@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = AdminService(AdminRepository(db))
    return await service.get_dashboard()

@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = AdminService(AdminRepository(db))
    return await service.get_analytics()

# NEWS CRUD
@router.get("/news")
async def admin_list_news(
    cursor: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = NewsService(NewsRepository(db))
    content_status = ContentStatus(status.lower()) if status and status.lower() != "all" else None
    items, page_info = await service.list_news(limit=20, cursor=cursor, status=content_status)
    return {"items": items, "pageInfo": page_info.model_dump()}

@router.post("/news", status_code=status.HTTP_201_CREATED)
async def admin_create_news(
    payload: AdminNewsCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = NewsService(NewsRepository(db))
    news = await service.create_news(payload)
    
    if payload.status == ContentStatus.PUBLISHED:
        # TODO: refresh_home_cache() / trigger_isr_revalidation() should be called here
        news = await service.publish_news(news.id, NewsPublish(status=ContentStatus.PUBLISHED))
        
    return news

@router.put("/news/{news_id}")
async def admin_update_news(
    news_id: int,
    payload: AdminNewsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = NewsService(NewsRepository(db))
    news = await service.update_news(news_id, payload)
    
    if payload.status and payload.status != news.status:
        if payload.status == ContentStatus.PUBLISHED:
            # TODO: refresh_home_cache() / trigger_isr_revalidation() should be called here
            pass
        news = await service.publish_news(news_id, NewsPublish(status=payload.status))
        
    return news

@router.delete("/news/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_news(
    news_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = NewsService(NewsRepository(db))
    await service.delete_news(news_id)
    return None

# USERS CRUD
@router.post("/users", status_code=status.HTTP_201_CREATED)
async def admin_create_user(
    payload: AdminUserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Reuse password hashing from AuthService
    from app.modules.auth.schemas import RegisterRequest
    service = AuthService(db)
    # create_user doesn't exist on AuthService natively for direct admin creation, so we will use repo direct
    from app.core.security import hash_password
    from fastapi import HTTPException
    
    repo = UserRepository(db)
    if await repo.exists(payload.email):
        raise HTTPException(status_code=409, detail="User already exists")
        
    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
        email_verified=payload.email_verified
    )
    user = await repo.create(user)
    await repo.db.commit()
    await repo.db.refresh(user)
    return user

# ARTICLES CRUD
from app.modules.articles.service import ArticleService
from app.modules.articles.repository import ArticleRepository
from app.modules.articles.schemas import ArticlePublish

@router.get("/articles")
async def admin_list_articles(
    cursor: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = ArticleService(ArticleRepository(db))
    content_status = ContentStatus(status.lower()) if status and status.lower() != "all" else None
    items, page_info = await service.list_articles(limit=20, cursor=cursor, status=content_status)
    return {"items": items, "pageInfo": page_info.model_dump()}

@router.post("/articles", status_code=status.HTTP_201_CREATED)
async def admin_create_article(
    payload: AdminArticleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = ArticleService(ArticleRepository(db))
    article = await service.create_article(payload)
    if payload.status == ContentStatus.PUBLISHED:
        # TODO: refresh_home_cache() / trigger_isr_revalidation() should be called here
        article = await service.publish_article(article.id, ArticlePublish(status=ContentStatus.PUBLISHED))
    return article

@router.put("/articles/{article_id}")
async def admin_update_article(
    article_id: int,
    payload: AdminArticleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = ArticleService(ArticleRepository(db))
    article = await service.update_article(article_id, payload)
    if payload.status and payload.status != article.status:
        if payload.status == ContentStatus.PUBLISHED:
            # TODO: refresh_home_cache() / trigger_isr_revalidation() should be called here
            pass
        article = await service.publish_article(article_id, ArticlePublish(status=payload.status))
    return article

@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = ArticleService(ArticleRepository(db))
    await service.delete_article(article_id)
    return None

# MAGAZINE CRUD
from app.modules.magazine.service import MagazineService
from app.modules.magazine.repository import MagazineRepository
from app.modules.magazine.schemas import MagazinePublish

@router.get("/magazine")
async def admin_list_magazine(
    cursor: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = MagazineService(MagazineRepository(db))
    content_status = ContentStatus(status.lower()) if status and status.lower() != "all" else None
    items, page_info = await service.list_magazines(limit=20, cursor=cursor, status=content_status)
    return {"items": items, "pageInfo": page_info.model_dump()}

@router.post("/magazine", status_code=status.HTTP_201_CREATED)
async def admin_create_magazine(
    payload: AdminMagazineCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = MagazineService(MagazineRepository(db))
    magazine = await service.create_magazine(payload)
    if payload.status == ContentStatus.PUBLISHED:
        # TODO: refresh_home_cache() / trigger_isr_revalidation() should be called here
        magazine = await service.publish_magazine(magazine.id, MagazinePublish(status=ContentStatus.PUBLISHED))
    return magazine

@router.put("/magazine/{magazine_id}")
async def admin_update_magazine(
    magazine_id: int,
    payload: AdminMagazineUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = MagazineService(MagazineRepository(db))
    magazine = await service.update_magazine(magazine_id, payload)
    if payload.status and payload.status != magazine.status:
        if payload.status == ContentStatus.PUBLISHED:
            # TODO: refresh_home_cache() / trigger_isr_revalidation() should be called here
            pass
        magazine = await service.publish_magazine(magazine_id, MagazinePublish(status=payload.status))
    return magazine

@router.delete("/magazine/{magazine_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_magazine(
    magazine_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = MagazineService(MagazineRepository(db))
    await service.delete_magazine(magazine_id)
    return None

# DOMAINS CRUD
from app.modules.domains.service import DomainService
from app.modules.domains.repository import DomainRepository
from app.modules.domains.schemas import DomainCreate, DomainUpdate

@router.get("/domains")
async def admin_list_domains(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = DomainService(DomainRepository(db))
    return await service.list_domains()

@router.post("/domains", status_code=status.HTTP_201_CREATED)
async def admin_create_domain(
    payload: DomainCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = DomainService(DomainRepository(db))
    return await service.create_domain(payload)

@router.put("/domains/{slug}")
async def admin_update_domain(
    slug: str,
    payload: DomainUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = DomainService(DomainRepository(db))
    return await service.update_domain(slug, payload)

@router.delete("/domains/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_domain(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    import logging
    from sqlalchemy.exc import IntegrityError
    from app.shared.responses.errors import conflict_error
    logger = logging.getLogger(__name__)

    service = DomainService(DomainRepository(db))
    try:
        await service.delete_domain(slug)
    except IntegrityError as e:
        logger.error(f"IntegrityError deleting domain {slug}: {str(e)}")
        raise conflict_error(
            message="Cannot delete domain: it is still referenced by existing content."
        )
    return None

# TAGS CRUD
from app.modules.tags.service import TagService
from app.modules.tags.repository import TagRepository
from app.modules.tags.schemas import TagCreate, TagUpdate

@router.get("/tags")
async def admin_list_tags(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = TagService(TagRepository(db))
    return await service.list_tags()

@router.post("/tags", status_code=status.HTTP_201_CREATED)
async def admin_create_tag(
    payload: TagCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = TagService(TagRepository(db))
    return await service.create_tag(payload)

@router.put("/tags/{tag_id}")
async def admin_update_tag(
    tag_id: int,
    payload: TagUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = TagService(TagRepository(db))
    return await service.update_tag(tag_id, payload)

@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_tag(
    tag_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = TagService(TagRepository(db))
    await service.delete_tag(tag_id)
    return None

# FEATURED (not yet implemented — no `featured` table exists)
@router.get("/featured")
async def get_featured(current_user: User = Depends(require_admin)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Featured content is not yet implemented.")

@router.post("/featured")
async def create_featured(current_user: User = Depends(require_admin)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Featured content is not yet implemented.")

@router.delete("/featured/{id}")
async def delete_featured(id: int, current_user: User = Depends(require_admin)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Featured content is not yet implemented.")
