from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AnalysisRequest(BaseModel):
    dataset_id: str
    date_column: str
    value_column: str
    interval: str  # 支持D（日）、W（周）、M（月）、Q（季）、Y（年）
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class CleanRequest(BaseModel):
    dataset_id: str
    cleaning_rules: Dict[str, Any]
    output_format: Optional[str] = "parquet"
    numeric_columns: Optional[List[str]] = None
    categorical_columns: Optional[List[str]] = None
    outlier_method: Optional[str] = None
    outlier_threshold: Optional[float] = 3.0
    outlier_action: Optional[str] = "clip"
    categorical_fill_value: Optional[str] = "unknown"
    standardization_method: Optional[str] = None

class TransformRequest(BaseModel):
    dataset_id: str
    transformation_pipeline: List[Dict[str, Any]]
    output_format: Optional[str] = "parquet"

class TrainRequest(BaseModel):
    dataset_id: str
    training_config: Dict[str, Any] = Field(..., description="模型训练配置参数")
    training_params: Dict[str, Any]
    test_size: Optional[float] = 0.2
    random_state: Optional[int] = 42

class ChartRequest(BaseModel):
    dataset_id: str
    chart_type: str
    x_axis: Optional[str] = None
    y_axis: Optional[str] = None
    time_field: Optional[str] = None
    group_by: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None

class AnalysisCreate(BaseModel):
    name: str
    description: Optional[str] = None
    dataset_id: str
    parameters: Dict[str, Any]
    created_by: str

class AnalysisUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    updated_by: str

class AnalysisInDB(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    dataset_id: str
    parameters: Dict[str, Any]
    created_by: str
    created_at: datetime
    updated_at: Optional[datetime] = None