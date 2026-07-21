from app.shared.exceptions.custom import APIException


class AnalyticsException(APIException):
    status_code = 500
    code = "ANALYTICS_ERROR"
    message = "An error occurred while processing analytics."
