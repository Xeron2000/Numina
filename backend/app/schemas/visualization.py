from pydantic import BaseModel, Field
from typing import Dict, Any, List, Literal
from datetime import datetime

class VisualizationBase(BaseModel):
    name: str
    description: str
    type: Literal['line', 'bar', 'pie', 'scatter', 'map']
    config: Dict[str, Any]
    dataset_id: int

class VisualizationCreate(VisualizationBase):
    pass

class VisualizationUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    type: Literal['line', 'bar', 'pie', 'scatter', 'map'] | None = None
    config: Dict[str, Any] | None = None
    dataset_id: int | None = None

class VisualizationResponse(VisualizationBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

class VisualizationList(BaseModel):
    items: List[VisualizationResponse]
    total: int