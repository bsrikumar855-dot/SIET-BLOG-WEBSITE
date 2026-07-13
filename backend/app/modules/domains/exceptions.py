from app.shared.exceptions.custom import NotFoundException, ConflictException

class DomainNotFoundException(NotFoundException):
    def __init__(self, message: str = "Domain not found"):
        super().__init__(message=message)

class DomainAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "Domain with this name or slug already exists"):
        super().__init__(message=message)
