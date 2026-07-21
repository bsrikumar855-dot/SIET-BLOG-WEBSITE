from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")

class BaseResponse(BaseModel):
    success: bool
    message: str | None = None

class SuccessResponse(BaseResponse, Generic[T]):
    success: bool = True
    data: T | None = None

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Any | None = None

class ErrorResponse(BaseResponse):
    success: bool = False
    error: ErrorDetail

class CursorPageInfo(BaseModel):
    next_cursor: str | None = None
    has_next: bool

class PaginatedResponse(BaseResponse, Generic[T]):
    success: bool = True
    data: list[T]
    page_info: CursorPageInfo
