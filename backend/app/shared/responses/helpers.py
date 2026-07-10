from typing import Any, List, Optional
from app.shared.responses.schemas import SuccessResponse, ErrorResponse, ErrorDetail, PaginatedResponse, CursorPageInfo

def success(data: Any = None, message: Optional[str] = None) -> SuccessResponse:
    """Helper to generate standard success response envelope."""
    return SuccessResponse(success=True, data=data, message=message)

def created(data: Any = None, message: Optional[str] = None) -> SuccessResponse:
    """Helper to generate standard created response envelope."""
    return SuccessResponse(success=True, data=data, message=message)

def paginated(data: List[Any], next_cursor: Optional[str], has_next: bool, message: Optional[str] = None) -> PaginatedResponse:
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
