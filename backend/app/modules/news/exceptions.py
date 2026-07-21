from app.shared.exceptions.custom import ConflictException, NotFoundException


class NewsNotFoundException(NotFoundException):
    def __init__(self, message: str = "News article not found"):
        super().__init__(message=message)

class NewsAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "News with this title or slug already exists"):
        super().__init__(message=message)
