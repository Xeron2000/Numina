from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.dataset import Dataset
from app.models.analytics import AnalyticsTask

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    # 获取数据集总数
    datasets_count = db.query(Dataset).count()
    
    # 获取分析任务总数
    analytics_count = db.query(AnalyticsTask).count()
    
    # 获取最近的活动（这里以最近的10条数据集和分析任务为例）
    recent_datasets = db.query(Dataset).order_by(Dataset.created_at.desc()).limit(5).all()
    recent_analytics = db.query(AnalyticsTask).order_by(AnalyticsTask.created_at.desc()).limit(5).all()
    
    # 组合最近活动
    recent_activities = []
    
    # 添加数据集活动（直接使用创建时间）
    for dataset in recent_datasets:
        recent_activities.append({
            "title": f"新增数据集：{dataset.name}",
            "action": "create",
            "created_at": dataset.created_at.isoformat()
        })
    
    # 添加分析任务活动
    for analytic in recent_analytics:
        recent_activities.append({
            "title": f"执行分析任务：{analytic.name}",
            "action": "analyze",
            "created_at": analytic.created_at.isoformat()
        })
    
    # 按时间排序
    recent_activities.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {
        "code": 200,
        "data": {
            "datasets_count": datasets_count,
            "analytics_count": analytics_count,
            "recent_activities": recent_activities[:10]  # 只返回最近10条
        }
    }