import uuid
from datetime import datetime, timezone
from typing import Dict, Optional

from fastapi import HTTPException, status

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.schemas.user import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)
from app.services.notification_service import notification_service

# In-memory user repository for Phase 2 authentication system
# In Phase 3, this will be wired to PostgreSQL via SQLAlchemy.
_USERS_DB: Dict[str, dict] = {}
_USERS_BY_EMAIL: Dict[str, str] = {}
_RESET_TOKENS: Dict[str, str] = {}  # token -> email


class AuthService:
    @staticmethod
    def register(user_in: UserCreate) -> dict:
        email_clean = user_in.email.lower().strip()
        if email_clean in _USERS_BY_EMAIL:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        user_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        user_dict = {
            "id": user_id,
            "email": email_clean,
            "full_name": user_in.full_name,
            "password_hash": hash_password(user_in.password),
            "is_active": True,
            "is_admin": False,
            "created_at": now,
            "updated_at": now,
        }

        _USERS_DB[user_id] = user_dict
        _USERS_BY_EMAIL[email_clean] = user_id
        return user_dict

    @staticmethod
    def login(credentials: UserLogin) -> TokenResponse:
        email_clean = credentials.email.lower().strip()
        user_id = _USERS_BY_EMAIL.get(email_clean)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        user = _USERS_DB[user_id]
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account",
            )

        token_data = {"sub": user["id"], "email": user["email"]}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    @staticmethod
    def refresh(refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type for refresh",
            )

        user_id = payload.get("sub")
        if not user_id or user_id not in _USERS_DB:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        user = _USERS_DB[user_id]
        token_data = {"sub": user["id"], "email": user["email"]}
        new_access = create_access_token(token_data)
        new_refresh = create_refresh_token(token_data)

        return TokenResponse(
            access_token=new_access,
            refresh_token=new_refresh,
            token_type="bearer",
        )

    @staticmethod
    async def forgot_password(req: ForgotPasswordRequest) -> None:
        email_clean = req.email.lower().strip()
        user_id = _USERS_BY_EMAIL.get(email_clean)
        if user_id:
            user = _USERS_DB[user_id]
            reset_token = str(uuid.uuid4())
            _RESET_TOKENS[reset_token] = email_clean
            await notification_service.send_password_reset_email(email_clean, reset_token)

    @staticmethod
    def reset_password(req: ResetPasswordRequest) -> None:
        email = _RESET_TOKENS.get(req.token)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token",
            )

        user_id = _USERS_BY_EMAIL.get(email)
        if not user_id or user_id not in _USERS_DB:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        user = _USERS_DB[user_id]
        user["password_hash"] = hash_password(req.new_password)
        user["updated_at"] = datetime.now(timezone.utc)
        del _RESET_TOKENS[req.token]

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[dict]:
        return _USERS_DB.get(user_id)

    @staticmethod
    def update_user(user_id: str, update_in: UserUpdate) -> dict:
        user = _USERS_DB.get(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if update_in.email and update_in.email.lower().strip() != user["email"]:
            new_email = update_in.email.lower().strip()
            if new_email in _USERS_BY_EMAIL:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use",
                )
            del _USERS_BY_EMAIL[user["email"]]
            user["email"] = new_email
            _USERS_BY_EMAIL[new_email] = user_id

        if update_in.full_name is not None:
            user["full_name"] = update_in.full_name

        if update_in.password:
            user["password_hash"] = hash_password(update_in.password)

        user["updated_at"] = datetime.now(timezone.utc)
        return user


auth_service = AuthService()
