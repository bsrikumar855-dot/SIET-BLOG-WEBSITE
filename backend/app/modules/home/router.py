from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.home.service import HomeService

router = APIRouter(prefix="/home", tags=["Home"])


def _current_user_id(request: Request) -> int | None:
    return int(request.state.user) if getattr(request.state, "user", None) else None


@router.get("")
async def get_home(request: Request, db: AsyncSession = Depends(get_db)):
    service = HomeService(db)
    current_user_id = _current_user_id(request)
    return await service.get_home_data(current_user_id=current_user_id)
