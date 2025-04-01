from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.auth.dependencies import get_current_active_user
from app.core.exceptions import ResourceNotFoundException, PermissionDeniedException

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.auth.dependencies import get_current_active_user
from app.core.exceptions import ResourceNotFoundException, PermissionDeniedException
from app.db.session import get_db
from app.models.visualization import Visualization
from app.models.dataset import Dataset
from app.models.user import User
from app.schemas.visualization import (
    VisualizationCreate, VisualizationUpdate, VisualizationResponse, VisualizationList
)

router = APIRouter()

@router.get("", response_model=VisualizationList)
async def get_visualizations(
    skip: int = 0,
    limit: int = 100,
    dataset_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Visualization).filter(Visualization.owner_id == current_user.id)
    
    # 如果提供了dataset_id，则筛选该数据集的可视化
    if dataset_id:
        query = query.filter(Visualization.dataset_id == dataset_id)
    
    visualizations = query.offset(skip).limit(limit).all()
    total = query.count()
    
    return {"items": visualizations, "total": total}

@router.get("/{id}", response_model=VisualizationResponse)
async def get_visualization(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    visualization = db.query(Visualization).filter(Visualization.id == id).first()
    
    if not visualization:
        raise ResourceNotFoundException("Visualization")
    
    # 检查权限
    if visualization.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    return visualization

@router.post("", response_model=VisualizationResponse)
async def create_visualization(
    visualization_in: VisualizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 检查数据集是否存在
    dataset = db.query(Dataset).filter(Dataset.id == visualization_in.dataset_id).first()
    if not dataset:
        raise ResourceNotFoundException("Dataset")
    
    # 检查数据集权限
    if dataset.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    # 创建可视化
    db_visualization = Visualization(
        name=visualization_in.name,
        description=visualization_in.description,
        visualization_type=visualization_in.visualization_type,
        config=visualization_in.config,
        dataset_id=visualization_in.dataset_id,
        owner_id=current_user.id
    )
    
    db.add(db_visualization)
    db.commit()
    db.refresh(db_visualization)
    
    return db_visualization

@router.put("/{id}", response_model=VisualizationResponse)
async def update_visualization(
    id: int,
    visualization_in: VisualizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    visualization = db.query(Visualization).filter(Visualization.id == id).first()
    
    if not visualization:
        raise ResourceNotFoundException("Visualization")
    
    # 检查权限
    if visualization.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    # 检查数据集权限（如果更新数据集）
    if visualization_in.dataset_id is not None:
        dataset = db.query(Dataset).filter(Dataset.id == visualization_in.dataset_id).first()
        if not dataset:
            raise ResourceNotFoundException("Dataset")
        if dataset.owner_id != current_user.id:
            raise PermissionDeniedException()
    
    # 更新可视化
    update_data = visualization_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(visualization, key, value)
    
    db.commit()
    db.refresh(visualization)
    
    return visualization

@router.delete("/{id}")
async def delete_visualization(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    visualization = db.query(Visualization).filter(Visualization.id == id).first()
    
    if not visualization:
        raise ResourceNotFoundException("Visualization")
    
    # 检查权限
    if visualization.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    # 删除可视化
    db.delete(visualization)
    db.commit()
    
    return {"detail": "Visualization deleted successfully"}