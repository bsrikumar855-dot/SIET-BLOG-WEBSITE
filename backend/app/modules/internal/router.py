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


@router.post("/revalidate")
async def revalidate_cache(key: str = Depends(verify_internal_api_key)):
    # No cache layer exists (home data is served via live queries) and the
    # frontend has no /internal/revalidate webhook to call. Nothing real to do here.
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Cache revalidation is not implemented — there is no cache layer to revalidate.",
    )


@router.post("/search/reindex", response_model=SuccessResponse[InternalActionResponse])
async def reindex_search(
    key: str = Depends(verify_internal_api_key),
    service: InternalService = Depends(get_internal_service),
):
    res = await service.reindex_search()
    return success(data=res)


@router.post("/news/fetch")
async def fetch_news_external(key: str = Depends(verify_internal_api_key)):
    # No RSS ingestion pipeline exists in this codebase.
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="External news ingestion is not implemented.",
    )


@router.post("/analytics/trigger", response_model=SuccessResponse[InternalActionResponse])
async def trigger_analytics(
    key: str = Depends(verify_internal_api_key),
    service: InternalService = Depends(get_internal_service),
):
    res = await service.trigger_analytics()
    return success(data=res)
