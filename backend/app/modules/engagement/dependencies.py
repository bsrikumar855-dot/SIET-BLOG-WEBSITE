from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.engagement.repository import EngagementRepository
from app.modules.engagement.service import EngagementService

def get_engagement_repository(db: AsyncSession = Depends(get_db)) -> EngagementRepository:
    return EngagementRepository(db)

def get_engagement_service(repository: EngagementRepository = Depends(get_engagement_repository)) -> EngagementService:
    return EngagementService(repository)
