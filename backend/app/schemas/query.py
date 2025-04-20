from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AnalyticsTaskBase(BaseModel):
    name: str
    status: str
    dataset_id: int
    query_string: str

class AnalyticsTaskResponse(AnalyticsTaskBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class AnalyticsTaskList(BaseModel):
    items: List[AnalyticsTaskResponse]
    total: int