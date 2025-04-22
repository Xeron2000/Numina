from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, Literal

class UserSettings(BaseModel):
    id: Optional[int] = None
    theme: Literal['light', 'dark', 'system'] = 'light'
    language: str = 'zh-CN'
    notifications_enabled: bool = True
    display_settings: Optional[Dict[str, Any]] = None
    map_settings: Optional[Dict[str, Any]] = None
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

class AppearanceSettings(BaseModel):
    theme: Literal['light', 'dark', 'system']

class DisplaySettings(BaseModel):
    name: Optional[str] = None
    language: Optional[str] = None
    dob: Optional[str] = None

class MapSettings(BaseModel):
    default_center: Optional[Dict[str, float]] = None
    default_zoom: Optional[int] = 12
    map_style: Optional[str] = "streets"
    show_labels: Optional[bool] = True
