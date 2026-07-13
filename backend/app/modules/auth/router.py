from typing import Optional

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.modules.auth.constants import ACCESS_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE
from app.modules.auth.dependencies import get_current_user
from app.modules.auth.models import User
from app.modules.auth.schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    RefreshResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    UserResponse,
    VerifyEmailRequest,
)
from app.modules.auth.service import AuthService
from app.shared.exceptions.custom import UnauthorizedException
from app.shared.responses.helpers import created, success
from app.shared.responses.schemas import SuccessResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=SuccessResponse[RegisterResponse],
    status_code=status.HTTP_201_CREATED,
)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    user = await service.register(data)
    response_data = RegisterResponse(
        user=UserResponse.model_validate(user),
        message="Registration successful. Verification email sent.",
    )
    return created(data=response_data)


@router.post("/login", response_model=SuccessResponse[LoginResponse])
async def login(
    response: Response,
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    access_token, refresh_token, user = await service.login(data)
    response_data = LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )

    response.set_cookie(
        key=settings.ACCESS_COOKIE_NAME,
        value=access_token,
        max_age=ACCESS_COOKIE_MAX_AGE,
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
    )
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=refresh_token,
        max_age=REFRESH_COOKIE_MAX_AGE,
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
    )
    return success(data=response_data)


@router.post("/refresh", response_model=SuccessResponse[RefreshResponse])
async def refresh(
    request: Request,
    response: Response,
    refresh_token: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    token = refresh_token or request.cookies.get(settings.REFRESH_COOKIE_NAME)
    if not token:
        raise UnauthorizedException("Refresh token is missing.")

    service = AuthService(db)
    access_token = await service.refresh(token)
    response_data = RefreshResponse(access_token=access_token)

    response.set_cookie(
        key=settings.ACCESS_COOKIE_NAME,
        value=access_token,
        max_age=ACCESS_COOKIE_MAX_AGE,
        secure=settings.COOKIE_SECURE,
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
    )
    return success(data=response_data)


@router.post("/logout", response_model=SuccessResponse[str])
async def logout(response: Response):
    response.delete_cookie(key=settings.ACCESS_COOKIE_NAME, domain=settings.COOKIE_DOMAIN)
    response.delete_cookie(key=settings.REFRESH_COOKIE_NAME, domain=settings.COOKIE_DOMAIN)
    return success(data="Successfully logged out.")


@router.post("/verify-email", response_model=SuccessResponse[str])
async def verify_email(data: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    await service.verify_email(data.token)
    return success(data="Email verified successfully.")


@router.post("/resend-verification", response_model=SuccessResponse[str])
async def resend_verification(email: str, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    await service.resend_verification(email)
    return success(data="Verification email resent.")


@router.post("/forgot-password", response_model=SuccessResponse[str])
async def forgot_password(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    await service.forgot_password(data.email)
    return success(data="If the email exists, a password reset link has been sent.")


@router.post("/reset-password", response_model=SuccessResponse[str])
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    await service.reset_password(data)
    return success(data="Password has been reset successfully.")


@router.get("/me", response_model=SuccessResponse[UserResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    return success(data=UserResponse.model_validate(current_user))
