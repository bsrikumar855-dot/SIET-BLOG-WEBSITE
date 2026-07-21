from app.shared.exceptions.custom import APIException, NotFoundException


class MediaNotFoundException(NotFoundException):
    def __init__(self, message: str = "Media not found"):
        super().__init__(message=message)

class MediaUploadException(APIException):
    status_code = 500
    code = "MEDIA_UPLOAD_FAILED"
    message = "Failed to upload media to storage provider."
