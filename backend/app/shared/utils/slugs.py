import re
import unicodedata
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

def generate_slug(text: str) -> str:
    """Generates a URL-friendly slug from a string."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8")
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[-\s]+", "-", text).strip("-")

async def ensure_unique_slug(db: AsyncSession, model, slug: str, exclude_id: Optional[int] = None) -> str:
    """Ensures a slug is unique in the given model."""
    original_slug = slug
    counter = 1
    while True:
        query = select(model).where(model.slug == slug)
        if exclude_id is not None:
            query = query.where(model.id != exclude_id)
        result = await db.execute(query)
        if not result.scalars().first():
            return slug
        slug = f"{original_slug}-{counter}"
        counter += 1
