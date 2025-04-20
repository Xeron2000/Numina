from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class QueryRequest(BaseModel):
    dataset_id: int
    query_string: str

class QueryResult(BaseModel):
    columns: List[str]
    data: List[Dict[str, Any]]
    row_count: int

class SavedQueryBase(BaseModel):
    name: str
    description: Optional[str] = None
    query_string: str
    dataset_id: int

class SavedQueryCreate(SavedQueryBase):
    pass

class SavedQueryUpdate(SavedQueryBase):
    name: Optional[str] = None
    description: Optional[str] = None
    query_string: Optional[str] = None
    dataset_id: Optional[int] = None

class SavedQueryResponse(SavedQueryBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SavedQueryList(BaseModel):
    items: List[SavedQueryResponse]
    total: int

class AnalyticsTaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str
    result: Optional[Dict[str, Any]] = None
    dataset_id: int

class AnalyticsTaskCreate(AnalyticsTaskBase):
    pass

class AnalyticsTaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    result: Optional[Dict[str, Any]] = None

class AnalyticsTaskResponse(AnalyticsTaskBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AnalyticsTaskList(BaseModel):
    items: List[AnalyticsTaskResponse]
    total: int