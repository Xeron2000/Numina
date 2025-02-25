from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.token import Token
from app.schemas.user import UserResponse
from app.models.user import User
from app.core.security import (
    authenticate_user,
    create_access_token,
    get_user_by_username,
    get_current_active_user
)
from app.core.config import settings
from app.core import exceptions

router = APIRouter()
# 安全配置参数
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 访问令牌有效期30分钟
REFRESH_TOKEN_EXPIRE_DAYS = 7     # 刷新令牌有效期7天
TOKEN_TYPE = "Bearer"             # 令牌类型

# 权限范围配置
SCOPES = {
    "me:read": "读取个人信息",
    "datasets:manage": "管理数据集"
}

# JWT令牌创建函数
def create_access_token(*, data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


    try:
        payload = jwt.decode(
            refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if not username:
            raise exceptions.CredentialsException()
    except JWTError:
        raise exceptions.CredentialsException()
    
    user = get_user_by_username(db, username=username)
    if not user or not user.is_active:
        raise exceptions.CredentialsException()
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(get_current_active_user),
):
    return current_user
REFRESH_TOKEN_REUSE_GRACE_SECONDS = 86400  # 24小时刷新令牌重用宽限期

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    disabled: bool | None = None

# 密码验证工具
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# 模拟用户数据（实际应查询数据库）
def get_user(db, username: str):
    fake_user = {
        "username": "admin",
        "hashed_password": pwd_context.hash("admin"),
        "disabled": False
    }
    return fake_user if username == "admin" else None

# 用户认证
def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user or not verify_password(password, user["hashed_password"]):
        raise exceptions.CredentialsException()
    return user

# 创建令牌
def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

# 登录接口
@router.post("/login",
    response_model=Token,
    responses={
        200: {"description": "成功获取令牌", "content": {
            "application/json": {
                "example": {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
            }
        }},
        401: {"description": "无效凭证"}
    }
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """JWT登录接口
    
    - 使用用户名密码获取访问令牌和刷新令牌
    - 访问令牌有效期：30分钟
    - 刷新令牌有效期：7天
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user or not user.is_active:
        raise exceptions.CredentialsException()
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    refresh_token = create_access_token(
        data={"sub": user.username, "token_type": "refresh"},
        expires_delta=refresh_token_expires
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# 令牌刷新接口
@router.post("/refresh",
    response_model=Token,
    responses={
        200: {"description": "成功刷新访问令牌"},
        401: {"description": "无效或过期的刷新令牌"}
    }
)
async def refresh_token(
    refresh_token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """刷新访问令牌接口
    
    - 使用刷新令牌获取新的访问令牌
    - 刷新令牌有效期：7天
    - 遵循v1版本API规范
    """
    try:
        payload = jwt.decode(
            refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if not username:
            raise exceptions.CredentialsException()
    except JWTError:
        raise exceptions.CredentialsException()

    user = get_user_by_username(db, username=username)
    if not user or not user.is_active:
        raise exceptions.CredentialsException()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

# 用户模型
class UserInDB(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    is_active: bool = True  # 统一使用is_active字段

# 当前用户依赖项
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db = Depends(get_db)
) -> UserInDB:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise exceptions.CredentialsException()
    except JWTError:
        raise exceptions.CredentialsException()
    
    # 从数据库获取完整用户信息
    result = await db.execute(
        select(User).where(User.username == username)
    )
    user = result.scalars().first()
    
    if not user or user.disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not found or inactive"
        )
        
    return UserInDB(**user)

class UserCreate(BaseModel):
    """用户注册请求模型"""
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str | None
    full_name: str | None
    is_active: bool

@router.post("/register", response_model=UserResponse)
async def register_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """用户注册接口
    
    - 创建新用户
    - 密码会自动进行哈希处理
    - 返回创建的用户信息
    """
    # 检查用户名是否已存在
    async with db as session:
        result = await session.execute(select(User).where(User.username == user.username))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="用户名已被使用"
            )
    
    # 检查邮箱是否已存在
    async with db as session:
        result = await session.execute(select(User).where(User.email == user.email))
        existing_email = result.scalars().first()
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="邮箱已被使用"
            )
    
    # 创建用户
    try:
        hashed_password = pwd_context.hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            is_active=True
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        
        return UserResponse(
            username=db_user.username,
            email=db_user.email,
            full_name=None,
            is_active=db_user.is_active
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"用户注册失败: {str(e)}"
        )

# 获取当前用户接口
@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        200: {"description": "成功获取用户信息"},
        401: {"description": "无效或过期的认证令牌"},
        403: {"description": "用户未激活"}
    }
)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user),
) -> UserResponse:
    """获取当前认证用户详细信息
    
    - 返回用户基本信息及激活状态
    - 需要有效的JWT访问令牌
    - 遵循v1版本API规范
    """
    try:
        return UserResponse(
            username=current_user.username,
            email=current_user.email,
            full_name=current_user.full_name,
            disabled=not current_user.disabled
        )
    except AttributeError as e:
        raise HTTPException(
            status_code=500,
            detail="用户数据格式异常"
        )