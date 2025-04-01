import secrets
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseSettings, PostgresDsn, validator

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 默认为60分钟
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS设置
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    # SQLite数据库URL
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./app.db"
    
    # 初始管理员用户
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin"
    
    # 文件上传设置
    UPLOAD_FOLDER: str = "./uploads"
    ALLOWED_EXTENSIONS: set = {"csv", "xlsx", "xls", "json"}
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16MB

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()