from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from pydantic import ValidationError, parse_raw_as
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import uuid  # Add this import
import os    # Move this import to the top

from app.core.deps import get_current_active_user  # 更新导入路径
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
    query = db.query(Dataset).filter(Dataset.owner_id == current_user.id)
    total = query.count()
    datasets = [dataset.__dict__ for dataset in query.all()]
    # Remove SQLAlchemy instance state
    for dataset in datasets:
        dataset.pop('_sa_instance_state', None)
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
#  response_model=DatasetResponse
@router.post("/upload")
async def upload_dataset(
    name: str = Form(...),
    data_json: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        # 解析JSON数据
        dataset_in = json.loads(data_json)
        
        # 构建文件路径 - Fix the unique filename generation
        unique_filename = f"{name}_{uuid.uuid4()}"  # Remove the extra dot
        file_path = os.path.join('datasets', f'{unique_filename}.json')
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        print(file_path)
        # 写入JSON文件
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(dataset_in, f, ensure_ascii=False, indent=4)
        
        # 获取文件大小
        file_size = os.path.getsize(file_path)

        # 创建数据集记录
        db_dataset = Dataset(
            name=name,
            description=f"Air quality data for {name}",
            owner_id=current_user.id,
            file_path=file_path,
            file_type='json',
            file_size=file_size,
            row_count=len(dataset_in) if isinstance(dataset_in, list) else len(dataset_in.keys()),
            columns_info={"data": "Air quality measurements"},
            status='ready'
        )
        
        db.add(db_dataset)
        db.commit()
        db.refresh(db_dataset)
        
        return db_dataset
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("", response_model=DatasetResponse)
# async def create_dataset(
#     # 1. 先以字符串形式接收 dataset_in 字段
#     dataset_in_str: str = Form(..., alias="dataset_in"),  # 使用 alias 匹配前端字段名
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_active_user)
# ):  
#     print(dataset_in_str)
#     # 2. 将字符串解析为 DatasetCreate 对象
#     dataset_in = parse_raw_as(DatasetCreate, dataset_in_str)  # 使用 Pydantic 解析 JSON
    
#     print(dataset_in)

#     # 验证文件类型
#     if not validate_file_extension(file.filename):
#         raise HTTPException(status_code=400, detail="Invalid file type")
    
#     # 保存文件
#     file_path = await save_upload_file(file)
#     file_type = file.filename.split('.')[-1].lower()
    
# #     # 获取文件信息
#     row_count, columns_info = get_file_info(file_path,file_type)
    
#     # 创建数据集记录（现在包含文件信息）
#     db_dataset = Dataset(
#         name=dataset_in.name,
#         description=dataset_in.description,
#         owner_id=current_user.id,
#         file_path=file_path,
#         file_type=file_type,
#         row_count=row_count,
#         columns_info=columns_info
#     )
    
#     db.add(db_dataset)
#     db.commit()
#     db.refresh(db_dataset)
    
#     return db_dataset


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

