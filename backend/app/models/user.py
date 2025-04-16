from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # 关系
    datasets = relationship("Dataset", back_populates="owner", cascade="all, delete-orphan")
    visualizations = relationship("Visualization", back_populates="owner", cascade="all, delete-orphan")
    saved_queries = relationship("SavedQuery", back_populates="owner", cascade="all, delete-orphan")
    
    # 添加新的关系
    geofences = relationship("GeoFence", back_populates="owner", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
