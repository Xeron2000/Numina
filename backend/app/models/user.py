from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
from app.models.base import BaseModel # Assuming BaseModel is your base

class User(BaseModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    datasets = relationship("Dataset", back_populates="owner", cascade="all, delete-orphan")
    visualizations = relationship("Visualization", back_populates="owner", cascade="all, delete-orphan")
    saved_queries = relationship("SavedQuery", back_populates="owner", cascade="all, delete-orphan")
    geofences = relationship("GeoFence", back_populates="owner", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan") # Assuming one-to-one

    # Add this relationship for AnalyticsTask
    analytics_tasks = relationship("AnalyticsTask", back_populates="owner", cascade="all, delete-orphan")

    # Relationship to Activity (assuming Activity has a user_id FK)
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")
