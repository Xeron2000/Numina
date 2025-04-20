from pydantic import BaseModel
from typing import Optional, Dict, Any, Literal

class AppearanceSettings(BaseModel):
    theme: Literal['light', 'dark', 'system']

class DisplaySettings(BaseModel):
    __root__: Dict[str, Any]

class MapSettings(BaseModel):
    default_center: Optional[Dict[str, float]] = None
    default_zoom: Optional[int] = 12
    map_style: Optional[str] = "streets"
    show_labels: Optional[bool] = True

class UserSettings(BaseModel):
    id: int
    user_id: int
    theme: Literal['light', 'dark', 'system'] = 'light'
    language: str = "zh-CN"
    notifications_enabled: bool = True
    display_settings: Optional[Dict[str, Any]] = None
    map_settings: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True