from fastapi import APIRouter, Depends, Header, HTTPException, status

from app.core.config import settings
from app.modules.internal.dependencies import get_internal_service
from app.modules.internal.schemas import InternalActionResponse
from app.modules.internal.service import InternalService
from app.shared.responses.helpers import success
from app.shared.responses.schemas import SuccessResponse

router = APIRouter(prefix="/internal", tags=["Internal APIs"])


async def verify_internal_api_key(
    x_internal_key: str = Header(..., alias="X-Internal-Key"),
):
    if x_internal_key != settings.INTERNAL_API_KEY.get_secret_value():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key",
        )
    return x_internal_key


@router.post("/revalidate", response_model=SuccessResponse[InternalActionResponse])
async def revalidate_cache(
    key: str = Depends(verify_internal_api_key),
    service: InternalService = Depends(get_internal_service),
):
    res = await service.revalidate_cache()
    return success(data=res)


@router.post("/search/reindex", response_model=SuccessResponse[InternalActionResponse])
async def reindex_search(
    key: str = Depends(verify_internal_api_key),
    service: InternalService = Depends(get_internal_service),
):
    res = await service.reindex_search()
    return success(data=res)


@router.post("/news/fetch", response_model=SuccessResponse[InternalActionResponse])
async def fetch_news_external(
    key: str = Depends(verify_internal_api_key),
    service: InternalService = Depends(get_internal_service),
):
    res = await service.fetch_news_external()
    return success(data=res)
