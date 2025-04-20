from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.deps import get_current_active_user  # 更新导入路径
from app.core.exceptions import ResourceNotFoundException, PermissionDeniedException
from app.db.session import get_db
from app.models.query import SavedQuery
from app.models.dataset import Dataset
from app.models.user import User
from app.schemas.query import (
    QueryRequest, QueryResult, SavedQueryCreate, SavedQueryUpdate, 
    SavedQueryResponse, SavedQueryList
)
from app.utils.data_processor import execute_query
from app.models.analytics import AnalyticsTask, AnalyticsTaskResponse, AnalyticsTaskList

router = APIRouter()

@router.post("/query", response_model=QueryResult)
async def run_query(
    query_req: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 检查数据集是否存在
    dataset = db.query(Dataset).filter(Dataset.id == query_req.dataset_id).first()
    
    if not dataset:
        raise ResourceNotFoundException("Dataset")
    # 检查权限
    if dataset.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    # 执行查询
    result = execute_query(dataset.file_path, dataset.file_type.lower())
    columns, data, row_count = result['columns'], result['data'], result['row_count']
    
    return {
        "columns": columns,
        "data": data,
        "row_count": row_count
    }

@router.get("/saved-queries", response_model=SavedQueryList)
async def get_saved_queries(
    skip: int = 0,
    limit: int = 100,
    dataset_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(SavedQuery).filter(SavedQuery.owner_id == current_user.id)
    
    # 如果提供了dataset_id，则筛选该数据集的查询
    if dataset_id:
        query = query.filter(SavedQuery.dataset_id == dataset_id)
    
    saved_queries = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {"items": saved_queries, "total": total}

@router.post("/saved-queries", response_model=SavedQueryResponse)
async def create_saved_query(
    query_in: SavedQueryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 检查数据集是否存在
    dataset = db.query(Dataset).filter(Dataset.id == query_in.dataset_id).first()
    if not dataset:
        raise ResourceNotFoundException("Dataset")
    
    # 检查权限
    if dataset.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    # 创建保存的查询
    db_query = SavedQuery(
        name=query_in.name,
        description=query_in.description,
        query_string=query_in.query_string,
        dataset_id=query_in.dataset_id,
        owner_id=current_user.id
    )
    
    db.add(db_query)
    db.commit()
    db.refresh(db_query)
    
    return db_query

@router.get("/tasks/{id}", response_model=AnalyticsTaskResponse)
async def get_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    task = db.query(AnalyticsTask).filter(AnalyticsTask.id == id).first()
    
    if not task:
        raise ResourceNotFoundException("Analytics Task")
    
    if task.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    return task

@router.get("/tasks", response_model=AnalyticsTaskList)
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(AnalyticsTask).filter(AnalyticsTask.owner_id == current_user.id)
    tasks = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {"items": tasks, "total": total}

@router.delete("/tasks/{id}")
async def delete_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    task = db.query(AnalyticsTask).filter(AnalyticsTask.id == id).first()
    
    if not task:
        raise ResourceNotFoundException("Analytics Task")
    
    if task.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    db.delete(task)
    db.commit()
    
    return {"detail": "Task deleted successfully"}