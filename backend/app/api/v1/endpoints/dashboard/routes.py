from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional

from app.core.deps import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.models.dataset import Dataset
from app.models.visualization import Visualization
from app.models.analytics import AnalyticsTask
from app.models.activity import Activity
from app.models.station import Station
from app.schemas.dashboard import (
    DashboardStats,
    DashboardTrends,
    StationDistribution,
    RecentActivity,
    Response
)

router = APIRouter()

@router.get("/stats", response_model=Response[DashboardStats])
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 获取各种统计数据
    datasets_count = db.query(func.count(Dataset.id)).filter(Dataset.owner_id == current_user.id).scalar()
    analytics_count = db.query(func.count(AnalyticsTask.id)).filter(AnalyticsTask.owner_id == current_user.id).scalar()
    visualizations_count = db.query(func.count(Visualization.id)).filter(Visualization.owner_id == current_user.id).scalar()
    stations_count = db.query(func.count(Station.id)).scalar()
    
    # 获取最近活动
    recent_activities = db.query(Activity)\
        .filter(Activity.user_id == current_user.id)\
        .order_by(Activity.created_at.desc())\
        .limit(10)\
        .all()
    
    # 获取空气质量趋势（最近7天）
    trends = get_air_quality_trends(db, days=7)
    
    # 获取站点分布
    distribution = get_station_distribution(db)
    
    return {
        "code": 200,
        "message": "success",
        "data": {
            "datasets_count": datasets_count,
            "analytics_count": analytics_count,
            "visualizations_count": visualizations_count,
            "stations_count": stations_count,
            "recent_activities": recent_activities,
            "air_quality_trends": trends,
            "station_distribution": distribution
        }
    }

@router.get("/trends", response_model=Response[List[DashboardTrends]])
async def get_trends(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    trends = get_air_quality_trends(db, days)
    return {
        "code": 200,
        "message": "success",
        "data": trends
    }

@router.get("/distribution", response_model=Response[List[StationDistribution]])
async def get_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    distribution = get_station_distribution(db)
    return {
        "code": 200,
        "message": "success",
        "data": distribution
    }

@router.get("/activities", response_model=Response[List[RecentActivity]])
async def get_activities(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    activities = db.query(Activity)\
        .filter(Activity.user_id == current_user.id)\
        .order_by(Activity.created_at.desc())\
        .limit(limit)\
        .all()
    
    return {
        "code": 200,
        "message": "success",
        "data": activities
    }

def get_air_quality_trends(db: Session, days: int = 7) -> List[dict]:
    # 这里实现获取空气质量趋势的具体逻辑
    # 示例数据
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # TODO: 从数据库获取实际数据
    return [
        {"date": (start_date + timedelta(days=i)).strftime("%Y-%m-%d"), "value": 50 + i}
        for i in range(days)
    ]

def get_station_distribution(db: Session) -> List[dict]:
    # 这里实现获取站点分布的具体逻辑
    return db.query(
        Station.province,
        func.count(Station.id).label('count'),
        func.avg(Station.latitude).label('lat'),
        func.avg(Station.longitude).label('lng')
    ).group_by(Station.province).all()