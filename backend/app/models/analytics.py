from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import BaseModel
import enum

# Define Enum for status if not already defined
class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class AnalyticsTask(BaseModel):
    __tablename__ = "analytics_tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True) # Or False if always required
    # Now Enum is recognized
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.PENDING)
    query_string = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Add the foreign key columns
    owner_id = Column(Integer, ForeignKey("users.id"))
    dataset_id = Column(Integer, ForeignKey("datasets.id"))

    # Relationships
    dataset = relationship("Dataset", back_populates="analytics_tasks")
    owner = relationship("User", back_populates="analytics_tasks")