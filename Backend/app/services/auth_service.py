import uuid
from datetime import datetime, timezone
from typing import Dict, Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.user import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserUpdate,
)
from app.services.notification_service import notification_service

_RESET_TOKENS: Dict[str, str] = {}  # token -> email reset map for development


class AuthService:
    @staticmethod
    async def register(db: AsyncSession, user_in: UserCreate) -> User:
        email_clean = user_in.email.lower().strip()
        
        # Check existing user in database
        stmt = select(User).where(User.email == email_clean)
        result = await db.execute(stmt)
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        new_user = User(
            id=str(uuid.uuid4()),
            email=email_clean,
            password_hash=hash_password(user_in.password),
            full_name=user_in.full_name,
            is_active=True,
            is_admin=False,
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    @staticmethod
    async def login(db: AsyncSession, credentials: UserLogin) -> TokenResponse:
        email_clean = credentials.email.lower().strip()
        
        stmt = select(User).where(User.email == email_clean)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account",
            )

        token_data = {"sub": user.id, "email": user.email}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    @staticmethod
    async def refresh(db: AsyncSession, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type for refresh",
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        user = await AuthService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        token_data = {"sub": user.id, "email": user.email}
        new_access = create_access_token(token_data)
        new_refresh = create_refresh_token(token_data)

        return TokenResponse(
            access_token=new_access,
            refresh_token=new_refresh,
            token_type="bearer",
        )

    @staticmethod
    async def forgot_password(db: AsyncSession, req: ForgotPasswordRequest) -> None:
        email_clean = req.email.lower().strip()
        stmt = select(User).where(User.email == email_clean)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if user:
            reset_token = str(uuid.uuid4())
            _RESET_TOKENS[reset_token] = email_clean
            await notification_service.send_password_reset_email(email_clean, reset_token)

    @staticmethod
    async def reset_password(db: AsyncSession, req: ResetPasswordRequest) -> None:
        email = _RESET_TOKENS.get(req.token)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token",
            )

        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        user.password_hash = hash_password(req.new_password)
        await db.commit()
        del _RESET_TOKENS[req.token]

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def update_user(db: AsyncSession, user_id: str, user_update: UserUpdate) -> User:
        user = await AuthService.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if user_update.email and user_update.email.lower().strip() != user.email:
            new_email = user_update.email.lower().strip()
            stmt = select(User).where(User.email == new_email)
            result = await db.execute(stmt)
            if result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use",
                )
            user.email = new_email

        if user_update.full_name is not None:
            user.full_name = user_update.full_name

        if user_update.password:
            user.password_hash = hash_password(user_update.password)

        await db.commit()
        await db.refresh(user)
        return user


auth_service = AuthService()
