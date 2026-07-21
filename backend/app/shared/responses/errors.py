from typing import Any

from app.shared.exceptions.custom import (
    ConflictException,
    ForbiddenException,
    InternalErrorException,
    NotFoundException,
    UnauthorizedException,
    ValidationException,
)


def not_found_error(message: str = "Requested resource not found.", details: Any | None = None) -> NotFoundException:
    """Helper for returning a 404 Not Found error."""
    return NotFoundException(message=message, details=details)

def validation_error(message: str = "Request validation failed.", details: Any | None = None) -> ValidationException:
    """Helper for returning a 422 Validation Error."""
    return ValidationException(message=message, details=details)

def unauthorized_error(message: str = "Authentication credentials were not provided or are invalid.", details: Any | None = None) -> UnauthorizedException:
    """Helper for returning a 401 Unauthorized error."""
    return UnauthorizedException(message=message, details=details)

def forbidden_error(message: str = "You do not have permission to perform this action.", details: Any | None = None) -> ForbiddenException:
    """Helper for returning a 403 Forbidden error."""
    return ForbiddenException(message=message, details=details)

def conflict_error(message: str = "Resource state conflict.", details: Any | None = None) -> ConflictException:
    """Helper for returning a 409 Conflict error."""
    return ConflictException(message=message, details=details)

def internal_server_error(message: str = "An internal server error occurred.", details: Any | None = None) -> InternalErrorException:
    """Helper for returning a 500 Internal Server Error."""
    return InternalErrorException(message=message, details=details)
