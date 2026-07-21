from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.infrastructure.storage.client import R2StorageClient
from app.modules.contract_helpers import serialize_media
from app.modules.media.models import Media
from app.modules.media.repository import MediaRepository
from app.modules.media.service import MediaService
from app.shared.auth.dependencies import require_admin

router = APIRouter(prefix="/admin/media", tags=["Media"])


@router.get("")
async def list_media(db: AsyncSession = Depends(get_db)):
    rows = list((await db.execute(select(Media).order_by(Media.id.desc()))).scalars().all())
    return [serialize_media(row) for row in rows]


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_media(
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


@router.delete("/{media_id}")
async def delete_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_admin),
):
    await MediaService(MediaRepository(db), R2StorageClient()).delete_media(media_id)
    return {"success": True}
