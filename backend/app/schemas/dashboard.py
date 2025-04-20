from pydantic import BaseModel
from typing import List, Generic, TypeVar, Optional
from datetime import datetime

T = TypeVar('T')

class Response(BaseModel, Generic[T]):
    code: int
    message: str
    data: T

class DashboardTrends(BaseModel):
    date: str
    value: float

class StationDistribution(BaseModel):
    province: str
    count: int
    coordinates: tuple[float, float]

class RecentActivity(BaseModel):
    id: int
    type: str
    action: str
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    datasets_count: int
    analytics_count: int
    visualizations_count: int
    stations_count: int
    recent_activities: List[RecentActivity]
    air_quality_trends: List[DashboardTrends]
    station_distribution: List[StationDistribution]