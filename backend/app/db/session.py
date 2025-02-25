from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from typing import Optional
from app.core.config import settings

def get_dynamic_db_engine(database_url: Optional[str] = None):
    """获取动态数据库引擎"""
    url = database_url or settings.DATABASE_URL
    if "sqlite" in url:
        url = url.replace("sqlite://", "sqlite+aiosqlite://")
    return create_async_engine(
        url + "?async_fallback=True",
        future=True,
        echo=True,
        connect_args={"check_same_thread": False}
    )

engine = get_dynamic_db_engine()

async_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# 保持原有变量名兼容
AsyncSessionLocal = async_session

@asynccontextmanager
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise