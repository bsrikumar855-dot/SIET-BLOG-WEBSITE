from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.contract_helpers import serialize_tag
from app.modules.tags.models import Tag
from app.shared.exceptions.custom import NotFoundException

router = APIRouter(prefix="/tags", tags=["Tags"])


@router.get("")
async def list_tags(db: AsyncSession = Depends(get_db)):
    tags = list((await db.execute(select(Tag).order_by(Tag.name))).scalars().all())
    return [serialize_tag(tag) for tag in tags]


@router.get("/{tag}")
async def get_tag(tag: str, db: AsyncSession = Depends(get_db)):
    row = (await db.execute(select(Tag).where(Tag.slug == tag))).scalars().first()
    if not row:
        raise NotFoundException("Tag not found.")
    return serialize_tag(row)
