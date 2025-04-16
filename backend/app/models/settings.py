from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class UserSettings(BaseModel):
    __tablename__ = "user_settings"

    theme = Column(String, default="light")  # light, dark, system
    language = Column(String, default="zh-CN")
    notifications_enabled = Column(Boolean, default=True)
    display_settings = Column(JSON, nullable=True)  # 显示相关设置
    map_settings = Column(JSON, nullable=True)  # 地图相关设置
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # 关系
    user = relationship("User", back_populates="settings")