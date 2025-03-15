from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any, Union

class QueryBase(BaseModel):
    query_string: str
    dataset_id: int

class QueryRequest(QueryBase):
    pass

class SavedQueryBase(BaseModel):
    name: str
    description: Optional[str] = None
    query_string: str
    dataset_id: int

class SavedQueryCreate(SavedQueryBase):
    pass

class SavedQueryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    query_string: Optional[str] = None
    dataset_id: Optional[int] = None

class SavedQueryInDB(SavedQueryBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class SavedQueryResponse(SavedQueryInDB):
    pass

class SavedQueryList(BaseModel):
    items: List[SavedQueryResponse]
    total: int

class QueryResult(BaseModel):
    columns: List[str]
    data: List[Dict[str, Any]]
    row_count: int