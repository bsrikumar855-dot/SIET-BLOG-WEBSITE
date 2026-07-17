from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Request, Response, status as http_status, File, UploadFile, BackgroundTasks, Query
from fastapi.routing import APIRoute
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import select, func, text, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db, async_session_maker
from app.core.config import settings
from app.core.security import hash_password
from app.shared.auth.dependencies import require_admin
from app.shared.exceptions.custom import APIException, ConflictException, NotFoundException
from app.shared.pagination.cursor import encode_cursor, decode_cursor
from app.shared.types.content import ContentStatus, MagazineType, MediaType

# Models
from app.modules.auth.models import User
from app.modules.domains.models import Domain
from app.modules.tags.models import Tag
from app.modules.media.models import Media
from app.modules.news.models import News
from app.modules.articles.models import Article
from app.modules.magazine.models import Magazine, MagazineAchievement, MagazineProjectLink

# Schemas
from app.modules.domains.schemas import DomainCreate, DomainUpdate
from app.modules.tags.schemas import TagCreate, TagUpdate
from app.modules.admin.schemas import (
    AdminUserCreate, AdminUserUpdate,
    NewsCreate, NewsUpdate,
    ArticleCreate, ArticleUpdate,
    MagazineCreate, MagazineUpdate
)

# Services / Helpers
from app.modules.admin.service import (
    get_cache, refresh_home_cache, record_admin_write, call_revalidate_webhook
)
from app.modules.media.service import MediaService
from app.modules.media.repository import MediaRepository
from app.infrastructure.storage.client import R2StorageClient

from app.modules.contract_helpers import (
    serialize_news, serialize_article, serialize_magazine,
    serialize_domain, serialize_tag, serialize_media, serialize_user
)

# Custom APIRoute to format all error responses under this router to match `{ "error": "...", "message": "...", "field"?: "..." }`
class AdminRoute(APIRoute):
    def get_route_handler(self):
        original_route_handler = super().get_route_handler()
        async def custom_route_handler(request: Request) -> Response:
            try:
                return await original_route_handler(request)
            except RequestValidationError as exc:
                errors = exc.errors()
                field = None
                message = "Request validation failed."
                if errors:
                    loc = errors[0].get("loc", [])
                    field = str(loc[-1]) if loc else None
                    message = errors[0].get("msg", "Validation error")
                return JSONResponse(
                    status_code=422,
                    content={
                        "error": "VALIDATION_ERROR",
                        "message": message,
                        "field": field
                    }
                )
            except APIException as exc:
                return JSONResponse(
                    status_code=exc.status_code,
                    content={
                        "error": exc.code,
                        "message": exc.message
                    }
                )
            except StarletteHTTPException as exc:
                return JSONResponse(
                    status_code=exc.status_code,
                    content={
                        "error": "HTTP_ERROR",
                        "message": exc.detail
                    }
                )
            except Exception as exc:
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "INTERNAL_SERVER_ERROR",
                        "message": str(exc)
                    }
                )
        return custom_route_handler

router = APIRouter(prefix="/admin", tags=["Admin"], route_class=AdminRoute)
status = http_status  # re-bind so status.HTTP_* works in decorators

# Background task for thumbnail generation
async def generate_thumbnail_task(media_id: int):
    async with async_session_maker() as db:
        media = await db.get(Media, media_id)
        if media:
            media.thumbnail_url = media.public_url
            await db.commit()

# Helper for content pagination
async def paginate_content(db: AsyncSession, model: Any, limit: int, cursor: Optional[str], status_str: Optional[str] = None):
    cursor_pub = None
    cursor_id = None
    if cursor:
        cursor_data = decode_cursor(cursor)
        if cursor_data:
            cursor_pub = cursor_data.get("published_at")
            cursor_id = cursor_data.get("id")

    stmt = select(model)
    if status_str and status_str.lower() != "all":
        try:
            status_enum = ContentStatus[status_str.upper()]
            stmt = stmt.where(model.status == status_enum)
        except KeyError:
            pass

    if hasattr(model, "published_at") and status_str != "draft":
        if cursor_pub and cursor_id:
            stmt = stmt.where(
                or_(
                    model.published_at < cursor_pub,
                    and_(model.published_at == cursor_pub, model.id < cursor_id)
                )
            )
        stmt = stmt.order_by(model.published_at.desc().nullslast(), model.id.desc()).limit(limit + 1)
    else:
        if cursor_id:
            stmt = stmt.where(model.id < cursor_id)
        stmt = stmt.order_by(model.id.desc()).limit(limit + 1)

    result = await db.execute(stmt)
    items = list(result.scalars().all())

    has_next = len(items) > limit
    if has_next:
        items = items[:limit]
        last_item = items[-1]
        cursor_data = {"id": last_item.id}
        if hasattr(last_item, "published_at") and last_item.published_at:
            cursor_data["published_at"] = last_item.published_at.isoformat()
        next_cursor = encode_cursor(cursor_data)
    else:
        next_cursor = None

    return items, next_cursor, has_next

# Dashboard & Analytics
@router.get("/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    data = await get_cache(db, "dashboard_data")
    if not data:
        await refresh_home_cache(db)
        data = await get_cache(db, "dashboard_data")
    return data

@router.get("/analytics")
async def get_analytics(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    data = await get_cache(db, "analytics_data")
    if not data:
        await refresh_home_cache(db)
        data = await get_cache(db, "analytics_data")
    return data

# Domain CRUD
@router.get("/domains")
async def list_domains_admin(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    domains = list((await db.execute(select(Domain).order_by(Domain.name))).scalars().all())
    return [serialize_domain(d) for d in domains]

@router.post("/domains", status_code=status.HTTP_201_CREATED)
async def create_domain_admin(data: DomainCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    from app.shared.utils.slugs import generate_slug, ensure_unique_slug
    slug = generate_slug(data.name)
    slug = await ensure_unique_slug(db, Domain, slug)

    domain = Domain(name=data.name, slug=slug, description=data.description)
    db.add(domain)
    await db.commit()
    await db.refresh(domain)

    await record_admin_write(db, "domain", domain.name, "CREATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()

    return serialize_domain(domain)

@router.put("/domains/{slug}")
async def update_domain_admin(slug: str, data: DomainUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    domain = (await db.execute(select(Domain).where(Domain.slug == slug))).scalars().first()
    if not domain:
        raise NotFoundException("Domain not found.")
        
    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(domain, key, value)
    await db.commit()
    await db.refresh(domain)
    
    await record_admin_write(db, "domain", domain.name, "UPDATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return serialize_domain(domain)

@router.delete("/domains/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_domain_admin(slug: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    domain = (await db.execute(select(Domain).where(Domain.slug == slug))).scalars().first()
    if not domain:
        raise NotFoundException("Domain not found.")
        
    # Check if domain referenced by content
    news_count = await db.scalar(select(func.count()).select_from(News).where(News.domain_id == domain.id))
    article_count = await db.scalar(select(func.count()).select_from(Article).where(Article.domain_id == domain.id))
    if news_count or article_count:
        raise ConflictException("Domain is referenced by content.")
        
    name = domain.name
    await db.delete(domain)
    await db.commit()
    
    await record_admin_write(db, "domain", name, "DELETE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Tag CRUD
@router.get("/tags")
async def list_tags_admin(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    tags = list((await db.execute(select(Tag).order_by(Tag.name))).scalars().all())
    return [serialize_tag(t) for t in tags]

@router.post("/tags", status_code=status.HTTP_201_CREATED)
async def create_tag_admin(data: TagCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    # Create slug
    from app.shared.utils.slugs import generate_slug, ensure_unique_slug
    slug = generate_slug(data.name)
    slug = await ensure_unique_slug(db, Tag, slug)
    
    tag = Tag(name=data.name, slug=slug)
    db.add(tag)
    await db.commit()
    await db.refresh(tag)
    
    await record_admin_write(db, "tag", tag.name, "CREATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return serialize_tag(tag)

@router.put("/tags/{id}")
async def update_tag_admin(id: int, data: TagUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    tag = await db.get(Tag, id)
    if not tag:
        raise NotFoundException("Tag not found.")
        
    update_dict = data.model_dump(exclude_unset=True)
    if "name" in update_dict and update_dict["name"] != tag.name:
        from app.shared.utils.slugs import generate_slug, ensure_unique_slug
        slug = generate_slug(update_dict["name"])
        slug = await ensure_unique_slug(db, Tag, slug, exclude_id=id)
        tag.slug = slug
        tag.name = update_dict["name"]
        
    await db.commit()
    await db.refresh(tag)
    
    await record_admin_write(db, "tag", tag.name, "UPDATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return serialize_tag(tag)

@router.delete("/tags/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag_admin(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    tag = await db.get(Tag, id)
    if not tag:
        raise NotFoundException("Tag not found.")
        
    name = tag.name
    await db.delete(tag)
    await db.commit()
    
    await record_admin_write(db, "tag", name, "DELETE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# User CRUD
@router.get("/users")
async def list_users_admin(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    users = list((await db.execute(select(User).order_by(User.id.desc()))).scalars().all())
    return [serialize_user(u) for u in users]

@router.post("/users", status_code=status.HTTP_201_CREATED)
async def create_user_admin(data: AdminUserCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    # Check if user already exists
    existing = await db.scalar(select(User).where(User.email == data.email))
    if existing:
        raise ConflictException("Email already registered.")
        
    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
        email_verified=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    await record_admin_write(db, "user", user.email, "CREATE", current_user.email)
    return serialize_user(user)

@router.put("/users/{id}")
async def update_user_admin(id: int, data: AdminUserUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    user = await db.get(User, id)
    if not user:
        raise NotFoundException("User not found.")
        
    update_dict = data.model_dump(exclude_unset=True)
    if "email" in update_dict and update_dict["email"] != user.email:
        existing = await db.scalar(select(User).where(User.email == update_dict["email"]))
        if existing:
            raise ConflictException("Email already registered.")
            
    if "password" in update_dict:
        user.password_hash = hash_password(update_dict["password"])
        del update_dict["password"]
        
    for key, value in update_dict.items():
        setattr(user, key, value)
        
    await db.commit()
    await db.refresh(user)
    
    await record_admin_write(db, "user", user.email, "UPDATE", current_user.email)
    return serialize_user(user)

@router.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_admin(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    user = await db.get(User, id)
    if not user:
        raise NotFoundException("User not found.")
        
    email = user.email
    await db.delete(user)
    await db.commit()
    
    await record_admin_write(db, "user", email, "DELETE", current_user.email)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Media CRUD
@router.get("/media")
async def list_media_admin(cursor: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    limit = 20
    cursor_id = None
    if cursor:
        cursor_data = decode_cursor(cursor)
        if cursor_data:
            cursor_id = cursor_data.get("id")
            
    stmt = select(Media)
    if cursor_id:
        stmt = stmt.where(Media.id < cursor_id)
    stmt = stmt.order_by(Media.id.desc()).limit(limit + 1)
    
    result = await db.execute(stmt)
    rows = list(result.scalars().all())
    
    has_next = len(rows) > limit
    if has_next:
        rows = rows[:limit]
        next_cursor = encode_cursor({"id": rows[-1].id})
    else:
        next_cursor = None
        
    items = [
        {
            "id": str(item.id),
            "url": item.public_url,
            "type": item.media_type.value,
            "size": item.size_bytes,
            "uploadedAt": item.created_at.isoformat()
        }
        for item in rows
    ]
    return {
        "items": items,
        "next_cursor": next_cursor,
        "has_next": has_next
    }

@router.post("/media/upload", status_code=status.HTTP_201_CREATED)
async def upload_media_admin(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    file_bytes = await file.read()
    service = MediaService(MediaRepository(db), R2StorageClient())
    media = await service.upload_media(
        filename=file.filename or "upload.bin",
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(file_bytes),
        file_bytes=file_bytes,
        uploaded_by_id=current_user.id
    )
    # Trigger background task for thumbnail generation
    background_tasks.add_task(generate_thumbnail_task, media.id)
    
    await record_admin_write(db, "media", media.filename, "UPLOAD", current_user.email)
    
    return {"id": str(media.id), "url": media.public_url}

@router.delete("/media/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media_admin(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    service = MediaService(MediaRepository(db), R2StorageClient())
    media = await service.get_media(id)
    filename = media.filename
    await service.delete_media(id)
    
    await record_admin_write(db, "media", filename, "DELETE", current_user.email)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# News CRUD
@router.get("/news")
async def list_news_admin(cursor: Optional[str] = None, status_filter: Optional[str] = Query("all"), db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    items, next_cursor, has_next = await paginate_content(db, News, 20, cursor, status_filter)
    serialized = [await serialize_news(db, item) for item in items]
    return {
        "items": serialized,
        "next_cursor": next_cursor,
        "has_next": has_next
    }

@router.post("/news", status_code=status.HTTP_201_CREATED)
async def create_news_admin(data: NewsCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    # Generate unique slug
    from app.shared.utils.slugs import generate_slug, ensure_unique_slug
    slug = generate_slug(data.title)
    slug = await ensure_unique_slug(db, News, slug)
    
    pub_at = datetime.now(timezone.utc) if data.status == ContentStatus.PUBLISHED else None
    
    news = News(
        title=data.title,
        slug=slug,
        content=data.content,
        excerpt=data.excerpt,
        status=data.status,
        published_at=pub_at,
        domain_id=data.domain_id,
        featured_image_id=data.featured_image_id,
        author_id=data.author_id or current_user.id
    )
    db.add(news)
    await db.commit()
    await db.refresh(news)
    
    await record_admin_write(db, "news", news.title, "CREATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return await serialize_news(db, news)

@router.put("/news/{id}")
async def update_news_admin(id: int, data: NewsUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    news = await db.get(News, id)
    if not news:
        raise NotFoundException("News item not found.")
        
    update_dict = data.model_dump(exclude_unset=True)
    if "title" in update_dict and update_dict["title"] != news.title:
        from app.shared.utils.slugs import generate_slug, ensure_unique_slug
        slug = generate_slug(update_dict["title"])
        slug = await ensure_unique_slug(db, News, slug, exclude_id=id)
        news.slug = slug
        
    if "status" in update_dict:
        if update_dict["status"] == ContentStatus.PUBLISHED and news.status != ContentStatus.PUBLISHED:
            news.published_at = datetime.now(timezone.utc)
        elif update_dict["status"] != ContentStatus.PUBLISHED:
            news.published_at = None
            
    for key, value in update_dict.items():
        setattr(news, key, value)
        
    await db.commit()
    await db.refresh(news)
    
    await record_admin_write(db, "news", news.title, "UPDATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return await serialize_news(db, news)

@router.delete("/news/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news_admin(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    news = await db.get(News, id)
    if not news:
        raise NotFoundException("News item not found.")
        
    title = news.title
    await db.delete(news)
    await db.commit()
    
    await record_admin_write(db, "news", title, "DELETE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Articles CRUD
@router.get("/articles")
async def list_articles_admin(cursor: Optional[str] = None, status_filter: Optional[str] = Query("all"), db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    items, next_cursor, has_next = await paginate_content(db, Article, 20, cursor, status_filter)
    serialized = [await serialize_article(db, item) for item in items]
    return {
        "items": serialized,
        "next_cursor": next_cursor,
        "has_next": has_next
    }

@router.post("/articles", status_code=status.HTTP_201_CREATED)
async def create_article_admin(data: ArticleCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    from app.shared.utils.slugs import generate_slug, ensure_unique_slug
    slug = generate_slug(data.title)
    slug = await ensure_unique_slug(db, Article, slug)
    
    pub_at = datetime.now(timezone.utc) if data.status == ContentStatus.PUBLISHED else None
    
    article = Article(
        title=data.title,
        slug=slug,
        content=data.content,
        excerpt=data.excerpt,
        reading_time_minutes=data.reading_time_minutes,
        status=data.status,
        published_at=pub_at,
        domain_id=data.domain_id,
        featured_image_id=data.featured_image_id,
        author_id=data.author_id or current_user.id
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    
    await record_admin_write(db, "article", article.title, "CREATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return await serialize_article(db, article)

@router.put("/articles/{id}")
async def update_article_admin(id: int, data: ArticleUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    article = await db.get(Article, id)
    if not article:
        raise NotFoundException("Article not found.")
        
    update_dict = data.model_dump(exclude_unset=True)
    if "title" in update_dict and update_dict["title"] != article.title:
        from app.shared.utils.slugs import generate_slug, ensure_unique_slug
        slug = generate_slug(update_dict["title"])
        slug = await ensure_unique_slug(db, Article, slug, exclude_id=id)
        article.slug = slug
        
    if "status" in update_dict:
        if update_dict["status"] == ContentStatus.PUBLISHED and article.status != ContentStatus.PUBLISHED:
            article.published_at = datetime.now(timezone.utc)
        elif update_dict["status"] != ContentStatus.PUBLISHED:
            article.published_at = None
            
    for key, value in update_dict.items():
        setattr(article, key, value)
        
    await db.commit()
    await db.refresh(article)
    
    await record_admin_write(db, "article", article.title, "UPDATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return await serialize_article(db, article)

@router.delete("/articles/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article_admin(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    article = await db.get(Article, id)
    if not article:
        raise NotFoundException("Article not found.")
        
    title = article.title
    await db.delete(article)
    await db.commit()
    
    await record_admin_write(db, "article", title, "DELETE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Magazine CRUD
@router.get("/magazine")
async def list_magazine_admin(cursor: Optional[str] = None, status_filter: Optional[str] = Query("all"), db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    items, next_cursor, has_next = await paginate_content(db, Magazine, 20, cursor, status_filter)
    serialized = [await serialize_magazine(db, item) for item in items]
    return {
        "items": serialized,
        "next_cursor": next_cursor,
        "has_next": has_next
    }

@router.post("/magazine", status_code=status.HTTP_201_CREATED)
async def create_magazine_admin(data: MagazineCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    from app.shared.utils.slugs import generate_slug, ensure_unique_slug
    slug = generate_slug(data.title)
    slug = await ensure_unique_slug(db, Magazine, slug)
    
    pub_at = datetime.now(timezone.utc) if data.status == ContentStatus.PUBLISHED else None
    
    magazine = Magazine(
        title=data.title,
        slug=slug,
        description=data.description,
        magazine_type=data.magazine_type,
        publication_year=data.publication_year,
        status=data.status,
        published_at=pub_at,
        cover_image_id=data.cover_image_id,
        pdf_file_id=data.pdf_file_id
    )
    db.add(magazine)
    await db.commit()
    await db.refresh(magazine)
    
    # Add achievements
    if data.achievements:
        for ach in data.achievements:
            db.add(MagazineAchievement(magazine_id=magazine.id, title=ach.title, description=ach.description))
            
    # Add project links
    if data.project_links:
        for link in data.project_links:
            db.add(MagazineProjectLink(magazine_id=magazine.id, title=link.title, url=link.url))
            
    await db.commit()
    await db.refresh(magazine)
    
    await record_admin_write(db, "magazine", magazine.title, "CREATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return await serialize_magazine(db, magazine)

@router.put("/magazine/{id}")
async def update_magazine_admin(id: int, data: MagazineUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    magazine = await db.get(Magazine, id)
    if not magazine:
        raise NotFoundException("Magazine not found.")
        
    update_dict = data.model_dump(exclude_unset=True)
    if "title" in update_dict and update_dict["title"] != magazine.title:
        from app.shared.utils.slugs import generate_slug, ensure_unique_slug
        slug = generate_slug(update_dict["title"])
        slug = await ensure_unique_slug(db, Magazine, slug, exclude_id=id)
        magazine.slug = slug
        
    if "status" in update_dict:
        if update_dict["status"] == ContentStatus.PUBLISHED and magazine.status != ContentStatus.PUBLISHED:
            magazine.published_at = datetime.now(timezone.utc)
        elif update_dict["status"] != ContentStatus.PUBLISHED:
            magazine.published_at = None
            
    # Handle achievements
    if "achievements" in update_dict:
        achievements_data = update_dict.pop("achievements")
        # Clear existing
        await db.execute(text("DELETE FROM magazine_achievements WHERE magazine_id = :id"), {"id": id})
        if achievements_data:
            for ach in achievements_data:
                db.add(MagazineAchievement(magazine_id=id, title=ach["title"], description=ach.get("description")))
                
    # Handle project links
    if "project_links" in update_dict:
        links_data = update_dict.pop("project_links")
        # Clear existing
        await db.execute(text("DELETE FROM magazine_project_links WHERE magazine_id = :id"), {"id": id})
        if links_data:
            for link in links_data:
                db.add(MagazineProjectLink(magazine_id=id, title=link["title"], url=link["url"]))
                
    for key, value in update_dict.items():
        setattr(magazine, key, value)
        
    await db.commit()
    await db.refresh(magazine)
    
    await record_admin_write(db, "magazine", magazine.title, "UPDATE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    
    return await serialize_magazine(db, magazine)

@router.delete("/magazine/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_magazine_admin(id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_admin)):
    magazine = await db.get(Magazine, id)
    if not magazine:
        raise NotFoundException("Magazine not found.")
        
    title = magazine.title
    await db.delete(magazine)
    await db.commit()
    
    await record_admin_write(db, "magazine", title, "DELETE", current_user.email)
    await refresh_home_cache(db)
    await call_revalidate_webhook()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Featured Stubs (leave as 501 Not Implemented per contract — featured table not yet created)
@router.get("/featured")
async def get_featured(current_user: User = Depends(require_admin)):
    raise StarletteHTTPException(status_code=501, detail="Featured endpoints not implemented.")

@router.post("/featured")
async def create_featured(current_user: User = Depends(require_admin)):
    raise StarletteHTTPException(status_code=501, detail="Featured endpoints not implemented.")

@router.delete("/featured/{id}")
async def delete_featured(id: int, current_user: User = Depends(require_admin)):
    raise StarletteHTTPException(status_code=501, detail="Featured endpoints not implemented.")
