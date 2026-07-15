from fastapi import APIRouter, Depends, Query, Request, HTTPException, status, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.core.database import get_db
from app.shared.auth.dependencies import require_admin
from app.modules.contract_helpers import (
    paginated_payload, normalize_page, normalize_limit,
    serialize_news, serialize_article, serialize_magazine,
    serialize_domain, serialize_user, get_domain_map, get_media_map, get_user_map, serialize_media
)

from app.modules.news.models import News
from app.modules.news.schemas import NewsCreate, NewsUpdate
from app.modules.news.service import NewsService
from app.modules.news.repository import NewsRepository

from app.modules.articles.models import Article
from app.modules.articles.schemas import ArticleCreate, ArticleUpdate
from app.modules.articles.service import ArticleService
from app.modules.articles.repository import ArticleRepository

from app.modules.magazine.models import Magazine
from app.modules.magazine.schemas import MagazineCreate, MagazineUpdate
from app.modules.magazine.service import MagazineService
from app.modules.magazine.repository import MagazineRepository

from app.modules.domains.models import Domain
from app.modules.domains.schemas import DomainCreate, DomainUpdate
from app.modules.domains.service import DomainService
from app.modules.domains.repository import DomainRepository

from app.modules.tags.models import Tag
from app.modules.tags.schemas import TagCreate, TagUpdate
from app.modules.tags.service import TagService
from app.modules.tags.repository import TagRepository

from app.modules.auth.repository import UserRepository
from app.modules.auth.models import User

from app.modules.media.models import Media
from app.modules.media.service import MediaService
from app.modules.media.repository import MediaRepository
from app.infrastructure.storage.client import R2StorageClient

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])

@router.get("/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    news_count = await db.scalar(select(func.count()).select_from(News))
    articles_count = await db.scalar(select(func.count()).select_from(Article))
    magazine_count = await db.scalar(select(func.count()).select_from(Magazine))
    users_count = await db.scalar(select(func.count()).select_from(User))
    return {
        "counts": {
            "news": news_count or 0,
            "articles": articles_count or 0,
            "achievements": magazine_count or 0,
            "users": users_count or 0
        },
        "recentActivity": []
    }

@router.get("/analytics")
async def get_analytics():
    return {"status": "ok"}

# News CRUD
@router.get("/news")
async def admin_list_news(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    q: str = "",
    db: AsyncSession = Depends(get_db)
):
    page = normalize_page(page)
    limit = normalize_limit(limit)
    query = select(News).order_by(News.id.desc())
    if q:
        query = query.where(News.title.ilike(f"%{q}%"))
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query) or 0
    rows = list((await db.execute(query.offset((page - 1) * limit).limit(limit))).scalars().all())
    domains = await get_domain_map(db)
    media = await get_media_map(db)
    items = [await serialize_news(db, row, domains=domains, media=media) for row in rows]
    return paginated_payload(items, page, limit, total)

@router.post("/news")
async def admin_create_news(data: NewsCreate, db: AsyncSession = Depends(get_db)):
    service = NewsService(NewsRepository(db))
    news = await service.create_news(data)
    domains = await get_domain_map(db)
    media = await get_media_map(db)
    return await serialize_news(db, news, domains=domains, media=media)

@router.put("/news/{id}")
async def admin_update_news(id: int, data: NewsUpdate, db: AsyncSession = Depends(get_db)):
    service = NewsService(NewsRepository(db))
    news = await service.update_news(id, data)
    domains = await get_domain_map(db)
    media = await get_media_map(db)
    return await serialize_news(db, news, domains=domains, media=media)

@router.delete("/news/{id}")
async def admin_delete_news(id: int, db: AsyncSession = Depends(get_db)):
    service = NewsService(NewsRepository(db))
    await service.delete_news(id)
    return {"success": True}

# Articles CRUD
@router.get("/articles")
async def admin_list_articles(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    q: str = "",
    db: AsyncSession = Depends(get_db)
):
    page = normalize_page(page)
    limit = normalize_limit(limit)
    query = select(Article).order_by(Article.id.desc())
    if q:
        query = query.where(Article.title.ilike(f"%{q}%"))
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query) or 0
    rows = list((await db.execute(query.offset((page - 1) * limit).limit(limit))).scalars().all())
    domains = await get_domain_map(db)
    media = await get_media_map(db)
    users = await get_user_map(db)
    items = [await serialize_article(db, row, domains=domains, users=users, media=media) for row in rows]
    return paginated_payload(items, page, limit, total)

@router.post("/articles")
async def admin_create_article(data: ArticleCreate, db: AsyncSession = Depends(get_db)):
    service = ArticleService(ArticleRepository(db))
    article = await service.create_article(data)
    domains = await get_domain_map(db)
    media = await get_media_map(db)
    users = await get_user_map(db)
    return await serialize_article(db, article, domains=domains, users=users, media=media)

@router.put("/articles/{id}")
async def admin_update_article(id: int, data: ArticleUpdate, db: AsyncSession = Depends(get_db)):
    service = ArticleService(ArticleRepository(db))
    article = await service.update_article(id, data)
    domains = await get_domain_map(db)
    media = await get_media_map(db)
    users = await get_user_map(db)
    return await serialize_article(db, article, domains=domains, users=users, media=media)

@router.delete("/articles/{id}")
async def admin_delete_article(id: int, db: AsyncSession = Depends(get_db)):
    service = ArticleService(ArticleRepository(db))
    await service.delete_article(id)
    return {"success": True}

# Magazine CRUD
@router.get("/magazine")
async def admin_list_magazine(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    q: str = "",
    db: AsyncSession = Depends(get_db)
):
    page = normalize_page(page)
    limit = normalize_limit(limit)
    query = select(Magazine).order_by(Magazine.id.desc())
    if q:
        query = query.where(Magazine.title.ilike(f"%{q}%"))
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query) or 0
    rows = list((await db.execute(query.offset((page - 1) * limit).limit(limit))).scalars().all())
    media = await get_media_map(db)
    items = [await serialize_magazine(db, row, media=media) for row in rows]
    return paginated_payload(items, page, limit, total)

@router.post("/magazine")
async def admin_create_magazine(data: MagazineCreate, db: AsyncSession = Depends(get_db)):
    service = MagazineService(MagazineRepository(db))
    magazine = await service.create_magazine(data)
    media = await get_media_map(db)
    return await serialize_magazine(db, magazine, media=media)

@router.put("/magazine/{id}")
async def admin_update_magazine(id: int, data: MagazineUpdate, db: AsyncSession = Depends(get_db)):
    service = MagazineService(MagazineRepository(db))
    magazine = await service.update_magazine(id, data)
    media = await get_media_map(db)
    return await serialize_magazine(db, magazine, media=media)

@router.delete("/magazine/{id}")
async def admin_delete_magazine(id: int, db: AsyncSession = Depends(get_db)):
    service = MagazineService(MagazineRepository(db))
    await service.delete_magazine(id)
    return {"success": True}

# Domains CRUD
@router.get("/domains")
async def admin_list_domains(db: AsyncSession = Depends(get_db)):
    rows = list((await db.execute(select(Domain).order_by(Domain.name))).scalars().all())
    return [serialize_domain(row) for row in rows]

@router.post("/domains")
async def admin_create_domain(data: DomainCreate, db: AsyncSession = Depends(get_db)):
    service = DomainService(DomainRepository(db))
    domain = await service.create_domain(data)
    return serialize_domain(domain)

@router.put("/domains/{slug}")
async def admin_update_domain(slug: str, data: DomainUpdate, db: AsyncSession = Depends(get_db)):
    service = DomainService(DomainRepository(db))
    domain = await service.repository.get_by_slug(slug)
    if not domain:
        raise HTTPException(404, "Domain not found")
    domain = await service.update_domain(domain.id, data)
    return serialize_domain(domain)

@router.delete("/domains/{slug}")
async def admin_delete_domain(slug: str, db: AsyncSession = Depends(get_db)):
    service = DomainService(DomainRepository(db))
    domain = await service.repository.get_by_slug(slug)
    if not domain:
        raise HTTPException(404, "Domain not found")
    await service.delete_domain(domain.id)
    return {"success": True}

# Media CRUD
@router.get("/media")
async def admin_list_media(db: AsyncSession = Depends(get_db)):
    rows = list((await db.execute(select(Media).order_by(Media.id.desc()))).scalars().all())
    return [serialize_media(row) for row in rows]

@router.post("/media/upload", status_code=status.HTTP_201_CREATED)
async def admin_upload_media(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin),
):
    file_bytes = await file.read()
    media = await MediaService(MediaRepository(db), R2StorageClient()).upload_media(
        filename=file.filename or "upload.bin",
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(file_bytes),
        file_bytes=file_bytes,
        uploaded_by_id=current_user.id,
    )
    return serialize_media(media)

@router.delete("/media/{id}")
async def admin_delete_media(id: int, db: AsyncSession = Depends(get_db)):
    await MediaService(MediaRepository(db), R2StorageClient()).delete_media(id)
    return {"success": True}

# Tags CRUD
@router.get("/tags")
async def admin_list_tags(db: AsyncSession = Depends(get_db)):
    rows = list((await db.execute(select(Tag).order_by(Tag.name))).scalars().all())
    return rows

@router.post("/tags")
async def admin_create_tag(data: TagCreate, db: AsyncSession = Depends(get_db)):
    service = TagService(TagRepository(db))
    return await service.create_tag(data)

@router.put("/tags/{id}")
async def admin_update_tag(id: int, data: TagUpdate, db: AsyncSession = Depends(get_db)):
    service = TagService(TagRepository(db))
    return await service.update_tag(id, data)

@router.delete("/tags/{id}")
async def admin_delete_tag(id: int, db: AsyncSession = Depends(get_db)):
    service = TagService(TagRepository(db))
    await service.delete_tag(id)
    return {"success": True}

# Users & Featured placeholders
@router.get("/users")
async def admin_list_users(db: AsyncSession = Depends(get_db)):
    rows = list((await db.execute(select(User).order_by(User.id.desc()))).scalars().all())
    return [serialize_user(row) for row in rows]

@router.post("/users")
async def admin_create_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    from app.core.security import hash_password
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        role=data.role
    )
    user = await repo.create(user)
    await db.commit()
    return serialize_user(user)

@router.put("/users/{id}")
async def admin_update_user(id: int, data: UserUpdate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_by_id(id)
    if not user: raise HTTPException(404, "User not found")
    if data.email: user.email = data.email
    if data.first_name: user.first_name = data.first_name
    if data.last_name: user.last_name = data.last_name
    if getattr(data, "role", None): user.role = data.role
    await db.commit()
    return serialize_user(user)

@router.delete("/users/{id}")
async def admin_delete_user(id: int, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_by_id(id)
    if not user: raise HTTPException(404, "User not found")
    await repo.delete(user)
    await db.commit()
    return {"success": True}

@router.get("/featured")
async def admin_list_featured(db: AsyncSession = Depends(get_db)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Featured model not yet implemented")

@router.post("/featured")
async def admin_create_featured(db: AsyncSession = Depends(get_db)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Featured model not yet implemented")

@router.put("/featured/{id}")
async def admin_update_featured(id: int, db: AsyncSession = Depends(get_db)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Featured model not yet implemented")

@router.delete("/featured/{id}")
async def admin_delete_featured(id: int, db: AsyncSession = Depends(get_db)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Featured model not yet implemented")

