from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserResponse(BaseModel):
    """用户响应模型"""
    id: str
    username: str
    email: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool = True
    is_superuser: bool = False