# Add Enum to the import statement
from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import BaseModel
from enum import Enum

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class AnalyticsTask(BaseModel):
    __tablename__ = "analytics_tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    status = Column(SQLEnum(TaskStatus), nullable=False)
    query_string = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Add the foreign key columns
    owner_id = Column(Integer, ForeignKey("users.id"))
    dataset_id = Column(Integer, ForeignKey("datasets.id"))

    # Relationships
    owner = relationship("User", back_populates="analytics_tasks")
    dataset = relationship("Dataset", back_populates="analytics_tasks")
