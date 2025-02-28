from datetime import datetime, timedelta
import logging
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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


class TokenData(BaseModel):
    username: str | None = None


# 密码验证工具
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# 从数据库查询用户(通过邮箱)
async def get_user_by_email(db_provider, email: str):
    async with db_provider() as db:
        result = await db.execute(
            select(User).where(User.email == email)
        )
        return result.scalars().first()

# 从数据库查询用户(通过用户名)
async def get_user(db_provider, username: str):
    async with db_provider() as db:
        result = await db.execute(
            select(User).where(User.username == username)
        )
        return result.scalars().first()

# 用户认证
async def authenticate_user(db_provider, email: str, password: str):
    user = await get_user_by_email(db_provider, email)
    if not user or not verify_password(password, user.hashed_password):
        return '邮箱或密码错误'
    
    return user

# 创建令牌
def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

class Status(BaseModel):
    status:int
    message:str | dict


# 登录接口
@router.post("/login",
    response_model=Status,
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
        401: {"description": "账户错误"},
        500: {"description": "系统错误"}
    }
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):  
    try:
        """JWT登录接口
        
        - 使用邮箱密码获取访问令牌和刷新令牌
        - 访问令牌有效期：30分钟
        - 刷新令牌有效期：7天
        """
        """
        form_data传过来的数据为email,password
        但是OAuth2PasswordRequestForm只有username,password
        所以form_data.username 实际上是 email
        """
        user = await authenticate_user(get_db, form_data.username, form_data.password) 
        if isinstance(user,str):
            return {
                        'status':401,
                        'message':user
                    } 
        if not user.is_active:
            return {
                        'status':401,
                        'message':'该用户被禁用'
                    } 
        
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
                    'status':200,
                    'message':{
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "token_type": "bearer"  
                    }
                } 
    except Exception as e:
        logging.info(e)
        return {
                    'status':500,
                    'message':'系统错误'
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
        select(
            User.username,
            User.email,
            User.full_name,
            User.is_active
        ).where(User.username == username)
    )
    user = result.first()
    
    if not user or user.disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not found or inactive"
        )
        
    return UserInDB(
        username=user[0],
        email=user[1],
        full_name=user[2],
        is_active=user[3]
    )

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

class RegisterResponse(BaseModel):
    status: int
    message: str | None
    data: dict | str

@router.post("/register", response_model=RegisterResponse)
async def register_user(
    user: UserCreate,
    db_provider = Depends(get_db)
):
    """用户注册接口
    - 创建新用户
    - 密码会自动进行哈希处理
    - 返回创建的用户信息
    """
    async with db_provider as db:
        if user.username == '':
            return RegisterResponse(
                status=400,
                message='Fail',
                data= '用户名不能为空'
            )

        if user.email == '':
            return RegisterResponse(
                status=400,
                message='Fail',
                data= '邮箱不能为空'
            )
        
        if user.password == '':
            return RegisterResponse(
                status=400,
                message='Fail',
                data= '密码不能为空'
            )

        # 检查用户名是否已存在
        result = await db.execute(
            select(
                User.username
            ).where(User.username == user.username)
        )

        existing_user = result.scalars().first()
        if existing_user:
            return RegisterResponse(
                status=400,
                message='Fail',
                data= '用户名已被使用'
            )
        
        # 检查邮箱是否已存在
        result = await db.execute(
            select(
                User.email
            ).where(User.email == user.email)
        )
        existing_email = result.scalars().first()
        if existing_email:
            return RegisterResponse(
                status=400,
                message='Fail',
                data= '邮箱已被使用'
            )
        
        # 创建用户
        hashed_password = pwd_context.hash(user.password)
        db_user = {
            "username": user.username,
            "email": user.email,
            "hashed_password": hashed_password,
            "is_active": True
        }
        
        # 创建SQLAlchemy User对象
        new_user = User(
            username=db_user["username"],
            email=db_user["email"],
            hashed_password=db_user["hashed_password"],
            is_active=db_user["is_active"]
        )
        try:
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"用户注册失败: {str(e)}"
            )
        finally:
            # 返回成功响应
            return RegisterResponse(
                status = 200,
                message = "Success",
                data = {
                    'username' : new_user.username,
                    'email' : new_user.email,
                    'full_name' : None,
                    'is_active' : new_user.is_active
                }
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