from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.shared.exceptions.custom import APIException
from app.shared.responses.schemas import ErrorResponse, ErrorDetail
from app.core.logging import logger

async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
    error_response = ErrorResponse(
        success=False,
        error=ErrorDetail(
            code=exc.code,
            message=exc.message,
            details=exc.details
        )
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    details = exc.errors()
    error_response = ErrorResponse(
        success=False,
        error=ErrorDetail(
            code="VALIDATION_ERROR",
            message="Request validation failed.",
            details=details
        )
    )
    return JSONResponse(
        status_code=422,
        content=error_response.model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(f"Unhandled exception occurred: {exc}")
    error_response = ErrorResponse(
        success=False,
        error=ErrorDetail(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred."
        )
    )
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump()
    )

def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(APIException, api_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)
