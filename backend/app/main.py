from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.api.v1 import api_router

app = FastAPI(
    title="AirSight API",
    description="空气污染数据分析平台API",
    version="1.0.0",
    docs_url="/docs",   # Swagger UI endpoint
    redoc_url="/redoc"  # ReDoc endpoint
)

# CORS设置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4173",
        "http://172.18.0.3:4173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint redirect to docs
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

# 注册v1版本API路由
app.include_router(api_router, prefix=settings.API_V1_STR)