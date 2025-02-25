import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from celery import Celery
from app.db.session import async_session, engine
from app.db.base import Base
from app.models.user import User
from app.models.analysis import Analysis
from app.models.dataset import Dataset
from app.models.task import Task
# 异常处理已由新APIException类实现
from app.core.config import settings

celery = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.services.tasks"]
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 初始化数据库
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # 初始化Celery worker
    celery.conf.update(task_track_started=True)
    yield
    # 清理Celery资源

app = FastAPI(
    lifespan=lifespan,
    title="数据分析平台API",
    description="提供数据分析平台后端接口服务",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    servers=[{"url": "/", "description": "标准API路径"}],
)

# 认证路由
from app.api.v1.endpoints import auth, datasets, analysis, tasks
app.include_router(auth.router, tags=["auth"])
app.include_router(datasets.router, tags=["datasets"])
app.include_router(analysis.router, tags=["analysis"])
app.include_router(tasks.router, tags=["tasks"])

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 异常处理
from fastapi.exceptions import RequestValidationError
from app.core.exceptions import APIException

@app.exception_handler(APIException)
async def api_exception_handler(request, exc: APIException):
    return exc.response()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    return APIException(
        code=400,
        message="请求参数验证失败",
        errors=exc.errors()
    ).response()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)