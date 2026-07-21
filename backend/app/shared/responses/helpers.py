from typing import Any

from app.shared.responses.schemas import (
    CursorPageInfo,
    ErrorDetail,
    ErrorResponse,
    PaginatedResponse,
    SuccessResponse,
)


def success(data: Any = None, message: str | None = None) -> SuccessResponse:
    """Helper to generate standard success response envelope."""
    return SuccessResponse(success=True, data=data, message=message)

def created(data: Any = None, message: str | None = None) -> SuccessResponse:
    """Helper to generate standard created response envelope."""
    return SuccessResponse(success=True, data=data, message=message)

def paginated(data: list[Any], next_cursor: str | None, has_next: bool, message: str | None = None) -> PaginatedResponse:
    """Helper to generate standard paginated response envelope."""
    return PaginatedResponse(
        success=True,
        message=message,
        data=data,
        page_info=CursorPageInfo(next_cursor=next_cursor, has_next=has_next)
    )

def error(code: str, message: str, details: Any = None) -> ErrorResponse:
    """Helper to generate standard error response envelope."""
    return ErrorResponse(
        success=False,
        error=ErrorDetail(code=code, message=message, details=details)
    )
