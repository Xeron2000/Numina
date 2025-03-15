from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from typing import Optional

from app.core.config import settings
from app.core.exceptions import CredentialsException, UserNotFoundException
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: Optional[int] = int(payload.get("sub"))
        if user_id is None:
            raise CredentialsException()
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise CredentialsException()
    
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if not user:
        raise UserNotFoundException()
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user