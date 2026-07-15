from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.home.service import HomeService

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("")
async def get_home(db: AsyncSession = Depends(get_db)):
    service = HomeService(db)
    return await service.get_home_payload()
