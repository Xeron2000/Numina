from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr  # 添加这行导入
from typing import Optional

from app.core.security import create_access_token, verify_password
from app.core.deps import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login", response_model=Token)
async def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise CredentialsException()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
    }

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 检查邮箱是否已存在
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise DuplicateResourceException(detail="Email already registered")
    
    # 检查用户名是否已存在
    existing_username = db.query(User).filter(User.username == user_in.username).first()
    if existing_username:
        raise DuplicateResourceException(detail="Username already taken")
    
    # 创建新用户
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 创建访问令牌
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=db_user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "username": db_user.username
        }
    }

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    # FastAPI JWT实现中，服务器不保存令牌状态
    # 客户端应删除令牌实现登出
    return {"detail": "Successfully logged out"}

@router.get("/profile", response_model=Token)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    return {
        "access_token": "",  # 保持现有token
        "token_type": "bearer",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "username": current_user.username
        }
    }