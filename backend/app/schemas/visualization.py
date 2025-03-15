from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any, Union

class VisualizationBase(BaseModel):
    name: str
    description: Optional[str] = None
    visualization_type: str
    config: str  # JSON string

class VisualizationCreate(VisualizationBase):
    dataset_id: int

class VisualizationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    visualization_type: Optional[str] = None
    config: Optional[str] = None
    dataset_id: Optional[int] = None

class VisualizationInDB(VisualizationBase):
    id: int
    dataset_id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class VisualizationResponse(VisualizationInDB):
    pass

class VisualizationList(BaseModel):
    items: List[VisualizationResponse]
    total: int