from typing import Any, Optional
from app.shared.exceptions.custom import (
    NotFoundException,
    ValidationException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    InternalErrorException
)

def not_found_error(message: str = "Requested resource not found.", details: Optional[Any] = None) -> NotFoundException:
    """Helper for returning a 404 Not Found error."""
    return NotFoundException(message=message, details=details)

def validation_error(message: str = "Request validation failed.", details: Optional[Any] = None) -> ValidationException:
    """Helper for returning a 422 Validation Error."""
    return ValidationException(message=message, details=details)

def unauthorized_error(message: str = "Authentication credentials were not provided or are invalid.", details: Optional[Any] = None) -> UnauthorizedException:
    """Helper for returning a 401 Unauthorized error."""
    return UnauthorizedException(message=message, details=details)

def forbidden_error(message: str = "You do not have permission to perform this action.", details: Optional[Any] = None) -> ForbiddenException:
    """Helper for returning a 403 Forbidden error."""
    return ForbiddenException(message=message, details=details)

def conflict_error(message: str = "Resource state conflict.", details: Optional[Any] = None) -> ConflictException:
    """Helper for returning a 409 Conflict error."""
    return ConflictException(message=message, details=details)

def internal_server_error(message: str = "An internal server error occurred.", details: Optional[Any] = None) -> InternalErrorException:
    """Helper for returning a 500 Internal Server Error."""
    return InternalErrorException(message=message, details=details)
