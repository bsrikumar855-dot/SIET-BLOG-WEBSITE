from typing import Any, Optional

class APIException(Exception):
    status_code: int = 500
    code: str = "INTERNAL_SERVER_ERROR"
    message: str = "An unexpected error occurred."
    details: Optional[Any] = None

    def __init__(self, message: Optional[str] = None, details: Optional[Any] = None):
        if message:
            self.message = message
        self.details = details

class ValidationException(APIException):
    status_code = 422
    code = "VALIDATION_ERROR"
    message = "Request validation failed."

class NotFoundException(APIException):
    status_code = 404
    code = "NOT_FOUND"
    message = "Requested resource not found."

class UnauthorizedException(APIException):
    status_code = 401
    code = "UNAUTHORIZED"
    message = "Authentication credentials were not provided or are invalid."

class ForbiddenException(APIException):
    status_code = 403
    code = "FORBIDDEN"
    message = "You do not have permission to perform this action."

class ConflictException(APIException):
    status_code = 409
    code = "CONFLICT"
    message = "Resource state conflict."

class InternalErrorException(APIException):
    status_code = 500
    code = "INTERNAL_SERVER_ERROR"
    message = "An internal server error occurred."
