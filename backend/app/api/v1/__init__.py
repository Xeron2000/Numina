from fastapi import APIRouter

from app.api.v1.endpoints.analytics.routes import router as analytics_router
from app.api.v1.endpoints.datasets.routes import router as datasets_router
from app.api.v1.endpoints.visualizations.routes import router as visualizations_router
from app.api.v1.endpoints.geospatial.routes import router as geospatial_router
from app.api.v1.endpoints.settings.routes import router as settings_router

api_router = APIRouter()

api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
api_router.include_router(datasets_router, prefix="/datasets", tags=["datasets"])
api_router.include_router(visualizations_router, prefix="/visualizations", tags=["visualizations"])
api_router.include_router(geospatial_router, prefix="/geospatial", tags=["geospatial"])
api_router.include_router(settings_router, prefix="/settings", tags=["settings"])