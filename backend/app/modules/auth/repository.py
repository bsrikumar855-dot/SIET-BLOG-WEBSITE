from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.repository.base import BaseRepository
from app.modules.auth.models import User

class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, User)

    async def get_by_email(self, email: str) -> Optional[User]:
        """Fetches a user profile by email address."""
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def exists(self, email: str) -> bool:
        """Checks if a user exists with the specified email address."""
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)
        return result.scalars().first() is not None

    async def get_by_verification_token(self, token_hash: str) -> Optional[User]:
        """Fetches a user profile matching a specific verification token hash."""
        stmt = select(User).where(User.verification_token_hash == token_hash)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_by_reset_token(self, token_hash: str) -> Optional[User]:
        """Fetches a user profile matching a specific reset token hash."""
        stmt = select(User).where(User.reset_token_hash == token_hash)
        result = await self.db.execute(stmt)
        return result.scalars().first()
