from app.shared.exceptions.custom import ConflictException, NotFoundException


class MagazineNotFoundException(NotFoundException):
    def __init__(self, message: str = "Magazine not found"):
        super().__init__(message=message)

class MagazineAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "Magazine with this title or slug already exists"):
        super().__init__(message=message)
