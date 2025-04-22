from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, Literal

class UserSettings(BaseModel):
    id: int
    theme: str
    language: str
    map_settings: Optional[Dict[str, Any]] = None
    user_id: int

    class Config:
        from_attributes = True

class AppearanceSettings(BaseModel):
    theme: str
    font: str

class DisplaySettings(BaseModel):
    __root__: Dict[str, Any]

class ProfileUpdateDto(BaseModel):
    username: str
    email: str

class AccountSettings(BaseModel):
    name: str
    language: str
    dob: str
