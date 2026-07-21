from app.shared.exceptions.custom import APIException, ForbiddenException


class UnverifiedEmailException(ForbiddenException):
    def __init__(self, message: str = "Email verification required to perform this action"):
        super().__init__(message=message)

class ContentNotFoundException(APIException):
    status_code = 404
    code = "CONTENT_NOT_FOUND"
    message = "The specified content does not exist."
