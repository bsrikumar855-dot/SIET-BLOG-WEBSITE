import uuid
from typing import List, Optional
from app.modules.media.models import Media
from app.modules.media.schemas import MediaCreate
from app.modules.media.repository import MediaRepository
from app.modules.media.exceptions import MediaNotFoundException, MediaUploadException
from app.infrastructure.storage.client import R2StorageClient
from app.shared.types.content import MediaType

class MediaService:
    def __init__(self, repository: MediaRepository, storage_client: R2StorageClient):
        self.repository = repository
        self.storage = storage_client

    async def get_media(self, media_id: int) -> Media:
        media = await self.repository.get_by_id(media_id)
        if not media:
            raise MediaNotFoundException()
        return media

    async def list_media(self, skip: int = 0, limit: int = 100) -> List[Media]:
        return await self.repository.get_all(skip, limit)

    async def upload_media(
        self, 
        filename: str, 
        content_type: str, 
        size_bytes: int, 
        file_bytes: bytes,
        uploaded_by_id: Optional[int] = None
    ) -> Media:
        # Determine media type roughly
        media_type = MediaType.DOCUMENT
        if content_type.startswith("image/"):
            media_type = MediaType.IMAGE
        elif content_type.startswith("video/"):
            media_type = MediaType.VIDEO
        elif content_type.startswith("audio/"):
            media_type = MediaType.AUDIO

        # Generate unique key
        ext = filename.split(".")[-1] if "." in filename else ""
        file_key = f"{uuid.uuid4().hex}.{ext}" if ext else uuid.uuid4().hex

        # Upload to storage
        success = await self.storage.upload_file(file_bytes, file_key, content_type)
        if not success:
            raise MediaUploadException()

        public_url = self.storage.public_url(file_key)
        
        # Optionally generate thumbnail for images (stubbed for now)
        thumbnail_url = None
        if media_type == MediaType.IMAGE:
            # Assume we have a serverless function generating thumbnails or we just do client side
            # We will use the same URL for now or a specific subpath
            thumbnail_url = public_url 
            
        media = Media(
            filename=filename,
            file_key=file_key,
            media_type=media_type,
            mime_type=content_type,
            size_bytes=size_bytes,
            public_url=public_url,
            thumbnail_url=thumbnail_url,
            uploaded_by_id=uploaded_by_id
        )
        media = await self.repository.create(media)
        await self.repository.db.commit()
        await self.repository.db.refresh(media)
        return media

    async def delete_media(self, media_id: int) -> None:
        media = await self.get_media(media_id)
        
        try:
            await self.storage.delete_file(media.file_key)
        except Exception:
            pass # Graceful failure if missing remotely
            
        await self.repository.delete(media)
        await self.repository.db.commit()
