from app.shared.exceptions.custom import APIException

class InvalidCredentialsException(APIException):
    status_code = 401
    code = "INVALID_CREDENTIALS"
    message = "Invalid email or password."

class EmailAlreadyRegisteredException(APIException):
    status_code = 409
    code = "EMAIL_ALREADY_REGISTERED"
    message = "Email is already registered."

class InvalidTokenException(APIException):
    status_code = 401
    code = "INVALID_TOKEN"
    message = "Provided token is invalid or has expired."
