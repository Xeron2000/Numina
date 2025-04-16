from pydantic import BaseModel
from typing import Optional, Dict, Any

class AppearanceSettings(BaseModel):
    theme: str  # light, dark, system
    language: Optional[str] = "zh-CN"

class DisplaySettings(BaseModel):
    sidebar_collapsed: Optional[bool] = False
    table_density: Optional[str] = "medium"  # compact, medium, spacious
    animations_enabled: Optional[bool] = True
    custom_colors: Optional[Dict[str, str]] = None

class MapSettings(BaseModel):
    default_center: Optional[Dict[str, float]] = None  # {lat: number, lng: number}
    default_zoom: Optional[int] = 12
    map_style: Optional[str] = "streets"  # streets, satellite, dark
    show_labels: Optional[bool] = True

class UserSettingsBase(BaseModel):
    theme: Optional[str] = "light"
    language: Optional[str] = "zh-CN"
    notifications_enabled: Optional[bool] = True
    display_settings: Optional[Dict[str, Any]] = None
    map_settings: Optional[Dict[str, Any]] = None

class UserSettingsCreate(UserSettingsBase):
    pass

class UserSettingsUpdate(UserSettingsBase):
    pass

class UserSettingsInDB(UserSettingsBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class UserSettingsResponse(UserSettingsInDB):
    pass