from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_email: str
    user_name: Optional[str] = None

class TokenData(BaseModel):
    sub: Optional[str] = None
