from app.shared.exceptions.custom import ConflictException, NotFoundException


class ArticleNotFoundException(NotFoundException):
    def __init__(self, message: str = "Article not found"):
        super().__init__(message=message)

class ArticleAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "Article with this title or slug already exists"):
        super().__init__(message=message)
