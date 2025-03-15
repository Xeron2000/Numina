from fastapi import APIRouter

from app.api.auth.routes import router as auth_router
from app.api.datasets.routes import router as datasets_router
from app.api.visualizations.routes import router as visualizations_router
from app.api.analytics.routes import router as analytics_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(datasets_router, prefix="/datasets", tags=["datasets"])
api_router.include_router(visualizations_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])