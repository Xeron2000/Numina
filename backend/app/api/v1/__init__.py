from fastapi import APIRouter

from app.api.v1.endpoints.analytics.routes import router as analytics_router
from app.api.v1.endpoints.datasets.routes import router as datasets_router
from app.api.v1.endpoints.visualizations.routes import router as visualizations_router
from app.api.v1.endpoints.geospatial.routes import router as geospatial_router
from app.api.v1.endpoints.settings.routes import router as settings_router
from app.api.v1.endpoints.auth.routes import router as auth_router
from app.api.v1.endpoints.dashboard.routes import router as dashboard_router
from app.api.v1.endpoints.llm.routes import router as llm_router

api_router = APIRouter()

# 添加 auth 路由（放在最前面）
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])

# 其他路由保持不变
api_router.include_router(datasets_router, prefix="/datasets", tags=["datasets"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
api_router.include_router(
    visualizations_router, prefix="/visualizations", tags=["visualizations"]
)
api_router.include_router(geospatial_router, prefix="/geospatial", tags=["geospatial"])
api_router.include_router(settings_router, prefix="/settings", tags=["settings"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(llm_router, prefix="/llm", tags=["llm"])
