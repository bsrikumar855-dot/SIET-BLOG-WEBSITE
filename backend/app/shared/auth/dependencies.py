from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.auth.models import User
from app.modules.auth.repository import UserRepository
from app.shared.exceptions.custom import ForbiddenException, UnauthorizedException


async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    user_id = request.state.user
    if not user_id:
        raise UnauthorizedException("Not authenticated.")
    
    repo = UserRepository(db)
    user = await repo.get_by_id(int(user_id))
    if not user:
        raise UnauthorizedException("User not found.")
    return user

async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise ForbiddenException("Administrator role required.")
    return current_user

async def require_verified_email(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.email_verified:
        raise ForbiddenException("Email verification required.")
    return current_user
