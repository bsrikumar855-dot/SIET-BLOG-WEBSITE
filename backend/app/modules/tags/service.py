from typing import List
from app.modules.tags.models import Tag
from app.modules.tags.schemas import TagCreate, TagUpdate
from app.modules.tags.repository import TagRepository
from app.modules.tags.exceptions import TagNotFoundException, TagAlreadyExistsException
from app.shared.utils.slugs import generate_slug, ensure_unique_slug

class TagService:
    def __init__(self, repository: TagRepository):
        self.repository = repository

    async def get_tag(self, tag_id: int) -> Tag:
        tag = await self.repository.get_by_id(tag_id)
        if not tag:
            raise TagNotFoundException()
        return tag

    async def get_tag_by_slug(self, slug: str) -> Tag:
        tag = await self.repository.get_by_slug(slug)
        if not tag:
            raise TagNotFoundException()
        return tag

    async def list_tags(self, skip: int = 0, limit: int = 100) -> List[Tag]:
        return await self.repository.get_all(skip, limit)

    async def create_tag(self, tag_in: TagCreate) -> Tag:
        slug = generate_slug(tag_in.name)
        slug = await ensure_unique_slug(self.repository.db, Tag, slug)
        
        tag = Tag(
            name=tag_in.name,
            slug=slug
        )
        tag = await self.repository.create(tag)
        await self.repository.db.commit()
        await self.repository.db.refresh(tag)
        return tag

    async def update_tag(self, tag_id: int, tag_in: TagUpdate) -> Tag:
        tag = await self.get_tag(tag_id)
        
        update_dict = tag_in.model_dump(exclude_unset=True)
        if "name" in update_dict and update_dict["name"] != tag.name:
            slug = generate_slug(update_dict["name"])
            slug = await ensure_unique_slug(self.repository.db, Tag, slug, exclude_id=tag_id)
            update_dict["slug"] = slug
            
        for key, value in update_dict.items():
            setattr(tag, key, value)
            
        tag = await self.repository.update(tag)
        await self.repository.db.commit()
        await self.repository.db.refresh(tag)
        return tag

    async def delete_tag(self, tag_id: int) -> None:
        tag = await self.get_tag(tag_id)
        await self.repository.delete(tag)
        await self.repository.db.commit()
