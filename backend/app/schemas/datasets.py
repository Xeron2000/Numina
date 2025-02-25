from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class DatabaseConnection(BaseModel):
    """数据库连接配置"""
    db_type: str = Field(..., enum=["mysql", "postgresql"])
    host: str
    port: int
    database: str
    username: str
    password: str
    ssl: bool = False

class Dataset(BaseModel):
    """数据集模型"""
    id: str
    name: str
    file_type: str
    file_path: str
    created_at: datetime
    columns: List[str]
    preview_url: str
    status: str = Field(default="active", enum=["active", "deleted"])

class DatasetCreate(BaseModel):
    """数据集创建响应模型"""
    id: str
    name: str
    file_type: str
    created_at: datetime
    columns: List[str]
    preview_url: str

class DatasetPreviewResponse(BaseModel):
    """数据预览响应模型"""
    columns: List[str]
    sample_rows: List[Dict[str, Any]]
    total_count: int
    dataset_id: Optional[str] = Field(
        None,
        description="数据集ID，用于后续操作"
    )
    file_type: Optional[str] = Field(
        None,
        description="文件类型，如text/csv, application/json"
    )

class DatasetUpdate(BaseModel):
    """数据集更新模型"""
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = Field(None, enum=["active", "deleted"])
    updated_by: str

class DatasetInDB(BaseModel):
    """数据库中的数据集模型"""
    id: str
    name: str
    description: Optional[str] = None
    file_type: str
    file_path: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    columns: List[str]
    preview_url: str
    status: str = Field(default="active", enum=["active", "deleted"])
    created_by: str
    updated_by: Optional[str] = None