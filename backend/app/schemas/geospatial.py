from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any, Union

class GeoFenceBase(BaseModel):
    name: str
    description: Optional[str] = None
    coordinates: Dict[str, Any]  # GeoJSON格式
    center: Dict[str, float]  # {lat: number, lng: number}
    radius: Optional[float] = None  # 如果是圆形围栏则需要半径
    fence_type: str  # polygon, circle

class GeoFenceCreate(GeoFenceBase):
    pass

class GeoFenceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    coordinates: Optional[Dict[str, Any]] = None
    center: Optional[Dict[str, float]] = None
    radius: Optional[float] = None
    fence_type: Optional[str] = None

class GeoFenceInDB(GeoFenceBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class GeoFenceResponse(GeoFenceInDB):
    pass

class GeoFenceList(BaseModel):
    items: List[GeoFenceResponse]
    total: int

class MapDataPoint(BaseModel):
    lat: float
    lng: float
    value: float
    label: Optional[str] = None

class MapBounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class MapDataResponse(BaseModel):
    points: List[MapDataPoint]
    bounds: MapBounds

class HeatmapDataResponse(MapDataResponse):
    intensity_max: float
    intensity_min: float