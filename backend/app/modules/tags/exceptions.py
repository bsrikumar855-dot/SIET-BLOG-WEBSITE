from app.shared.exceptions.custom import ConflictException, NotFoundException


class TagNotFoundException(NotFoundException):
    def __init__(self, message: str = "Tag not found"):
        super().__init__(message=message)

class TagAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "Tag with this name or slug already exists"):
        super().__init__(message=message)
