from enum import Enum
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class TaskParams(BaseModel):
    """
    任务参数
    """
    name: str = Field(..., description="任务名称")
    description: Optional[str] = Field(None, description="任务描述")
    input_data: dict = Field(..., description="输入数据")
    config: Optional[dict] = Field(None, description="任务配置")

class TaskStatus(str, Enum):
    """
    任务状态枚举
    """
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class TaskResult(BaseModel):
    """
    任务结果
    """
    task_id: str = Field(..., description="任务ID")
    status: TaskStatus = Field(..., description="任务状态")
    result_data: Optional[dict] = Field(None, description="结果数据")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    error_message: Optional[str] = Field(None, description="错误信息")

class TaskCreate(BaseModel):
    """任务创建模型"""
    name: str
    description: Optional[str] = None
    parameters: Dict[str, Any]
    created_by: str

class TaskUpdate(BaseModel):
    """任务更新模型"""
    name: Optional[str] = None
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    updated_by: str

class TaskInDB(BaseModel):
    """数据库中的任务模型"""
    id: str
    name: str
    description: Optional[str] = None
    parameters: Dict[str, Any]
    status: TaskStatus
    created_by: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None