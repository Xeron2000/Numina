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


class LLMConfig(BaseModel):
    base_url: str = "https://api.openai.com/v1"
    api_key: Optional[str] = None
    model: str = "gpt-3.5-turbo"
    provider: str = "openai"


class ChatRequest(BaseModel):
    message: str
    dataset_id: Optional[int] = None


class ChatResponse(BaseModel):
    content: str


class ModelListRequest(BaseModel):
    base_url: str = "https://api.openai.com/v1"
    api_key: str


class LLMReportCreate(BaseModel):
    dataset_id: Optional[int] = None
    prompt: str
    response: str
    model: str


class LLMReportResponse(BaseModel):
    id: int
    user_id: int
    dataset_id: Optional[int] = None
    prompt: str
    response: str
    model: str
    created_at: str

    class Config:
        from_attributes = True
