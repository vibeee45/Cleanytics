from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import decode_token, oauth2_scheme
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_service import auth_service

router = APIRouter(prefix="/users", tags=["Users"])


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type for authorization",
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current logged in user profile",
)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update current logged in user profile",
)
async def update_me(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    updated_user = auth_service.update_user(current_user["id"], user_update)
    return updated_user
