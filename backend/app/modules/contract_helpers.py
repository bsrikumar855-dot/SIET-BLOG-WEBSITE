from __future__ import annotations

from math import ceil
from typing import Any, Sequence

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.articles.models import Article
from app.modules.auth.models import User
from app.modules.domains.models import Domain
from app.modules.engagement.models import Bookmark, Like
from app.modules.magazine.models import Magazine
from app.modules.media.models import Media
from app.modules.news.models import News
from app.modules.tags.models import Tag
from app.shared.types.content import ContentKind


async def get_domain_map(db: AsyncSession) -> dict[int, Domain]:
    result = await db.execute(select(Domain))
    return {domain.id: domain for domain in result.scalars().all()}


async def get_user_map(db: AsyncSession) -> dict[int, User]:
    result = await db.execute(select(User))
    return {user.id: user for user in result.scalars().all()}


async def get_media_map(db: AsyncSession) -> dict[int, Media]:
    result = await db.execute(select(Media))
    return {media.id: media for media in result.scalars().all()}


async def like_count(db: AsyncSession, content_id: int, kind: ContentKind) -> int:
    result = await db.execute(
        select(func.count())
        .select_from(Like)
        .where(Like.content_id == content_id, Like.content_kind == kind)
    )
    return result.scalar() or 0


async def is_bookmarked(
    db: AsyncSession,
    content_id: int,
    kind: ContentKind,
    user_id: int | None,
) -> bool:
    if not user_id:
        return False
    result = await db.execute(
        select(Bookmark.id).where(
            Bookmark.user_id == user_id,
            Bookmark.content_id == content_id,
            Bookmark.content_kind == kind,
        )
    )
    return result.scalar() is not None


def domain_payload(domain: Domain | None) -> dict[str, Any]:
    if not domain:
        return {"slug": "general", "name": "General", "count": 0}
    return {"slug": domain.slug, "name": domain.name, "count": 0}


def user_payload(user: User | None) -> dict[str, Any]:
    if not user:
        return {"id": "0", "name": "SIET Editorial Desk", "role": "editor"}
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }


def paginated_payload(items: Sequence[Any], page: int, limit: int, total: int) -> dict[str, Any]:
    pages = max(1, ceil(total / limit)) if limit else 1
    return {"items": list(items), "page": page, "pages": pages, "total": total}


def normalize_page(page: int) -> int:
    return page if page > 0 else 1


def normalize_limit(limit: int) -> int:
    return min(max(limit, 1), 100)


def search_filter(model: Any, q: str | None):
    if not q:
        return None
    pattern = f"%{q}%"
    fields = [model.title]
    if hasattr(model, "content"):
        fields.append(model.content)
    if hasattr(model, "excerpt"):
        fields.append(model.excerpt)
    if hasattr(model, "description"):
        fields.append(model.description)
    return or_(*[field.ilike(pattern) for field in fields])


async def serialize_news(
    db: AsyncSession,
    item: News,
    domains: dict[int, Domain] | None = None,
    media: dict[int, Media] | None = None,
    current_user_id: int | None = None,
) -> dict[str, Any]:
    domains = domains or await get_domain_map(db)
    media = media or await get_media_map(db)
    kind = ContentKind.NEWS
    image = media.get(item.featured_image_id).public_url if item.featured_image_id in media else None
    return {
        "id": str(item.id),
        "slug": item.slug,
        "title": item.title,
        "aiSummary": item.excerpt or item.content[:220],
        "sourceUrl": "",
        "sourceName": "SIET News",
        "domain": domain_payload(domains.get(item.domain_id)),
        "tags": [],
        "image": image,
        "publishedAt": (item.published_at or item.created_at).isoformat(),
        "trending": False,
        "likes": await like_count(db, item.id, kind),
        "bookmarked": await is_bookmarked(db, item.id, kind, current_user_id),
        "content": item.content,
    }


async def serialize_article(
    db: AsyncSession,
    item: Article,
    domains: dict[int, Domain] | None = None,
    users: dict[int, User] | None = None,
    media: dict[int, Media] | None = None,
    current_user_id: int | None = None,
) -> dict[str, Any]:
    domains = domains or await get_domain_map(db)
    users = users or await get_user_map(db)
    media = media or await get_media_map(db)
    kind = ContentKind.ARTICLE
    cover = media.get(item.featured_image_id).public_url if item.featured_image_id in media else None
    return {
        "id": str(item.id),
        "slug": item.slug,
        "title": item.title,
        "excerpt": item.excerpt or item.content[:220],
        "body": item.content,
        "author": user_payload(users.get(item.author_id)),
        "domain": domain_payload(domains.get(item.domain_id)),
        "tags": [],
        "cover": cover,
        "publishedAt": (item.published_at or item.created_at).isoformat(),
        "readingMinutes": item.reading_time_minutes,
        "likes": await like_count(db, item.id, kind),
        "bookmarked": await is_bookmarked(db, item.id, kind, current_user_id),
    }


async def serialize_magazine(
    db: AsyncSession,
    item: Magazine,
    domains: dict[int, Domain] | None = None,
    media: dict[int, Media] | None = None,
    current_user_id: int | None = None,
) -> dict[str, Any]:
    media = media or await get_media_map(db)
    kind = ContentKind.MAGAZINE
    gallery = []
    if item.cover_image_id in media:
        gallery.append(media[item.cover_image_id].public_url)
    return {
        "id": str(item.id),
        "slug": item.slug,
        "title": item.title,
        "description": item.description or "",
        "student": {"id": "0", "name": "SIET Student", "role": "student"},
        "department": "AI Research Lab",
        "year": item.publication_year,
        "type": item.magazine_type.value,
        "domain": {"slug": "achievements", "name": "Achievements", "count": 0},
        "gallery": gallery,
        "certificateUrl": media.get(item.pdf_file_id).public_url if item.pdf_file_id in media else None,
        "projectLinks": [
            {"label": link.title, "url": link.url}
            for link in getattr(item, "project_links", [])
        ],
        "achievements": [
            {"id": str(achievement.id), "title": achievement.title, "description": achievement.description}
            for achievement in getattr(item, "achievements", [])
        ],
        "likes": await like_count(db, item.id, kind),
        "bookmarked": await is_bookmarked(db, item.id, kind, current_user_id),
    }


def serialize_domain(item: Domain, count: int = 0) -> dict[str, Any]:
    return {"slug": item.slug, "name": item.name, "count": count}


def serialize_tag(item: Tag) -> dict[str, Any]:
    return {"slug": item.slug, "name": item.name}


def serialize_media(item: Media) -> dict[str, Any]:
    return {
        "id": str(item.id),
        "url": item.public_url,
        "filename": item.filename,
        "uploadedAt": item.created_at.isoformat(),
        "mimeType": item.mime_type,
        "sizeBytes": item.size_bytes,
        "mediaType": item.media_type.value,
    }


def serialize_user(item: User) -> dict[str, Any]:
    return {"id": str(item.id), "name": item.name, "email": item.email, "role": item.role}
