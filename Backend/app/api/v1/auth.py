from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.user import (
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    TokenRefreshRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(user_in: UserCreate):
    user_dict = auth_service.register(user_in)
    return user_dict


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login to obtain access and refresh tokens",
)
async def login(credentials: UserLogin):
    return auth_service.login(credentials)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token using a refresh token",
)
async def refresh_token(req: TokenRefreshRequest):
    return auth_service.refresh(req.refresh_token)


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Request a password reset token",
)
async def forgot_password(req: ForgotPasswordRequest):
    await auth_service.forgot_password(req)
    return MessageResponse(
        message="If an account exists with that email, a password reset link/token has been generated."
    )


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset password using a valid reset token",
)
async def reset_password(req: ResetPasswordRequest):
    auth_service.reset_password(req)
    return MessageResponse(message="Password reset successfully.")
