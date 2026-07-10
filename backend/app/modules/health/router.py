from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.shared.responses.schemas import SuccessResponse
from app.shared.responses.helpers import success
from app.modules.health.schemas import (
    HealthResponse, DatabaseHealthResponse, SearchHealthResponse, StorageHealthResponse
)
from app.modules.health.dependencies import get_health_service
from app.modules.health.service import HealthService

router = APIRouter(prefix="/health", tags=["Health Checks"])

@router.get("", response_model=SuccessResponse[HealthResponse])
async def check_health(service: HealthService = Depends(get_health_service)):
    res = await service.get_general_health()
    return success(data=res)

@router.get("/db", response_model=SuccessResponse[DatabaseHealthResponse])
async def check_db_health(
    db: AsyncSession = Depends(get_db),
    service: HealthService = Depends(get_health_service)
):
    res = await service.get_db_health(db)
    return success(data=res)

@router.get("/search", response_model=SuccessResponse[SearchHealthResponse])
async def check_search_health(service: HealthService = Depends(get_health_service)):
    res = await service.get_search_health()
    return success(data=res)

@router.get("/storage", response_model=SuccessResponse[StorageHealthResponse])
async def check_storage_health(service: HealthService = Depends(get_health_service)):
    res = await service.get_storage_health()
    return success(data=res)
