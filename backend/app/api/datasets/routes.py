from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import ValidationError, parse_raw_as
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.auth.dependencies import get_current_active_user
from app.core.exceptions import ResourceNotFoundException, PermissionDeniedException
from app.db.session import get_db
from app.models.dataset import Dataset
from app.models.user import User
from app.schemas.dataset import (
    DatasetCreate, DatasetUpdate, DatasetResponse, DatasetList
)
from app.utils.file_handler import validate_file_extension, save_upload_file, get_file_info

router = APIRouter()

@router.get("", response_model=DatasetList)
async def get_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    datasets = db.query(Dataset).filter(Dataset.owner_id == current_user.id).all()
    total = db.query(Dataset).filter(Dataset.owner_id == current_user.id).count()
    return {"items": datasets, "total": total}

@router.get("/{id}", response_model=DatasetResponse)
async def get_dataset(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    dataset = db.query(Dataset).filter(Dataset.id == id).first()
    
    if not dataset:
        raise ResourceNotFoundException("Dataset")
    
    # 检查权限
    if dataset.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    return dataset

@router.post("", response_model=DatasetResponse)
async def create_dataset(
    # 1. 先以字符串形式接收 dataset_in 字段
    dataset_in_str: str = Form(..., alias="dataset_in"),  # 使用 alias 匹配前端字段名
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):  
    print(dataset_in_str)
    # 2. 将字符串解析为 DatasetCreate 对象
    dataset_in = parse_raw_as(DatasetCreate, dataset_in_str)  # 使用 Pydantic 解析 JSON
    
    print(dataset_in)

    # 验证文件类型
    if not validate_file_extension(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # 保存文件
    file_path = await save_upload_file(file)
    file_type = file.filename.split('.')[-1].lower()
    
#     # 获取文件信息
    row_count, columns_info = get_file_info(file_path,file_type)
    
    # 创建数据集记录（现在包含文件信息）
    db_dataset = Dataset(
        name=dataset_in.name,
        description=dataset_in.description,
        owner_id=current_user.id,
        file_path=file_path,
        file_type=file_type,
        row_count=row_count,
        columns_info=columns_info
    )
    
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    
    return db_dataset

# @router.post("", response_model=DatasetResponse)
# async def create_dataset(
#     dataset_in: DatasetCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_active_user)
# ):
#     # 创建数据集记录（不含文件，文件将通过upload接口上传）
#     db_dataset = Dataset(
#         name=dataset_in.name,
#         description=dataset_in.description,
#         owner_id=current_user.id,
#         file_path="",  # 稍后上传
#         file_type=""   # 稍后上传
#     )
#     db.add(db_dataset)
#     db.commit()
#     db.refresh(db_dataset)
#     return db_dataset

# @router.post("/upload", response_model=DatasetResponse)
# async def upload_dataset_file(
#     file: UploadFile = File(...),
#     dataset_id: int = Form(...),
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_active_user)
# ):
#     # 检查数据集是否存在
#     dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
#     if not dataset:
#         raise ResourceNotFoundException("Dataset")
    
#     # 检查权限
#     if dataset.owner_id != current_user.id:
#         raise PermissionDeniedException()
    
#     # 验证文件类型
#     if not validate_file_extension(file.filename):
#         raise HTTPException(status_code=400, detail="Invalid file type")
    
#     # 保存文件
#     file_path = await save_upload_file(file)
#     file_type = file.filename.split('.')[-1].lower()
    
#     # 获取文件信息
#     row_count, columns_info = get_file_info(file_path,file_type)
    
#     # 更新数据集信息
#     dataset.file_path = file_path
#     dataset.file_type = file_type
#     dataset.row_count = row_count
#     dataset.columns_info = columns_info
    
#     db.commit()
#     db.refresh(dataset)
    
#     return dataset

@router.put("/{id}", response_model=DatasetResponse)
async def update_dataset(
    id: int,
    dataset_in: DatasetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    dataset = db.query(Dataset).filter(Dataset.id == id).first()
    
    if not dataset:
        raise ResourceNotFoundException("Dataset")
    
    # 检查权限
    if dataset.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    # 更新数据集
    if dataset_in.name is not None:
        dataset.name = dataset_in.name
    if dataset_in.description is not None:
        dataset.description = dataset_in.description
    
    db.commit()
    db.refresh(dataset)
    return dataset

@router.delete("/{id}")
async def delete_dataset(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    dataset = db.query(Dataset).filter(Dataset.id == id).first()
    
    if not dataset:
        raise ResourceNotFoundException("Dataset")
    
    # 检查权限
    if dataset.owner_id != current_user.id:
        raise PermissionDeniedException()
    
    # 删除数据集
    db.delete(dataset)
    db.commit()
    
    return {"detail": "Dataset deleted successfully"}

