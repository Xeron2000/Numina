from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class UserSettings(BaseModel):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    user = relationship("User", back_populates="settings")
    theme = Column(String, nullable=False, default='light')
    font = Column(String, nullable=False, default='default')
    language = Column(String, nullable=False, default='zh-CN')
    name = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    notifications_enabled = Column(Boolean, nullable=False, default=True)
    display_settings = Column(JSON)
    map_settings = Column(JSON)