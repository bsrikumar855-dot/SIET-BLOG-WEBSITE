from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class BaseResponse(BaseModel):
    success: bool
    message: Optional[str] = None

class SuccessResponse(BaseResponse, Generic[T]):
    success: bool = True
    data: Optional[T] = None

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ErrorResponse(BaseResponse):
    success: bool = False
    error: ErrorDetail

class CursorPageInfo(BaseModel):
    next_cursor: Optional[str] = None
    has_next: bool

class PaginatedResponse(BaseResponse, Generic[T]):
    success: bool = True
    data: List[T]
    page_info: CursorPageInfo
