from typing import Generic, Type, TypeVar, Optional, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, db: AsyncSession, model: Type[T]):
        self.db = db
        self.model = model

    async def create(self, entity: T) -> T:
        """Saves a new entity instance to the database. Does not commit."""
        self.db.add(entity)
        await self.db.flush()
        return entity

    async def update(self, entity: T) -> T:
        """Marks an existing entity for update. Commits are handled by the service layer."""
        # The entity is usually already in the session, but we can do self.db.add if needed
        # self.db.add(entity)
        return entity

    async def delete(self, entity: T) -> None:
        """Deletes an entity instance from the database. Does not commit."""
        await self.db.delete(entity)

    async def get_by_id(self, entity_id: Any) -> Optional[T]:
        """Fetches an entity by its primary key ID."""
        stmt = select(self.model).where(self.model.id == entity_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def exists(self, entity_id: Any) -> bool:
        """Checks if an entity exists by its primary key ID."""
        stmt = select(self.model).where(self.model.id == entity_id)
        result = await self.db.execute(stmt)
        return result.scalars().first() is not None
