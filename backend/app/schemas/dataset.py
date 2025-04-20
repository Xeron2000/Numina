from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None

class DatasetCreate(DatasetBase):
    pass

class DatasetUpdate(DatasetBase):
    pass

class DatasetResponse(DatasetBase):
    id: int
    file_type: str
    file_size: int
    row_count: int
    created_at: datetime
    updated_at: Optional[datetime]
    status: str

    class Config:
        from_attributes = True

class DatasetList(BaseModel):
    items: List[DatasetResponse]
    total: int