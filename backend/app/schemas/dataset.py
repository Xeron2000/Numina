from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None

class DatasetCreate(DatasetBase):
    pass

class DatasetUpdate(DatasetBase):
    name: Optional[str] = None

class DatasetInDB(DatasetBase):
    id: int
    file_path: str
    file_type: str
    row_count: Optional[int] = None
    columns_info: Optional[str] = None
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class DatasetResponse(DatasetInDB):
    pass

class DatasetList(BaseModel):
    items: List[DatasetResponse]
    total: int