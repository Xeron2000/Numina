from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey
from app.db.base_class import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    theme = Column(String, nullable=False, default='light')
    language = Column(String, nullable=False, default='zh-CN')
    notifications_enabled = Column(Boolean, nullable=False, default=True)
    display_settings = Column(JSON)
    map_settings = Column(JSON)