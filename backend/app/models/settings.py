from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, JSON # Add necessary imports
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class UserSettings(BaseModel):
    __tablename__ = "user_settings" # Make sure you have a tablename

    id = Column(Integer, primary_key=True, index=True) # Example primary key
    user_id = Column(Integer, ForeignKey("users.id"), unique=True) # unique=True for one-to-one
    user = relationship("User", back_populates="settings")
    theme = Column(String, nullable=False, default='light')
    language = Column(String, nullable=False, default='zh-CN')
    notifications_enabled = Column(Boolean, nullable=False, default=True)
    display_settings = Column(JSON)
    map_settings = Column(JSON)