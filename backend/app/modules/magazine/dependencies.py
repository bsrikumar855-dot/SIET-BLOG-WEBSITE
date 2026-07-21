from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.magazine.repository import MagazineRepository
from app.modules.magazine.service import MagazineService


def get_magazine_repository(db: AsyncSession = Depends(get_db)) -> MagazineRepository:
    return MagazineRepository(db)

def get_magazine_service(repository: MagazineRepository = Depends(get_magazine_repository)) -> MagazineService:
    return MagazineService(repository)
