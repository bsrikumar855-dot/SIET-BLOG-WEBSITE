class HeaderNames:
    REQUEST_ID = "X-Request-ID"
    INTERNAL_KEY = "X-Internal-Key"
    AUTHORIZATION = "Authorization"

class CookieNames:
    ACCESS_TOKEN = "access_token"
    REFRESH_TOKEN = "refresh_token"

class ErrorCodes:
    VALIDATION_ERROR = "VALIDATION_ERROR"
    NOT_FOUND = "NOT_FOUND"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    CONFLICT = "CONFLICT"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"

class Roles:
    ADMIN = "admin"
    USER = "user"

class PaginationDefaults:
    LIMIT = 20
    MAX_LIMIT = 100
