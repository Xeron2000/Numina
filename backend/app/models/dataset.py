from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, JSON, BigInteger # Add BigInteger here
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from sqlalchemy.sql import func
from app.db.base_class import Base

class Dataset(BaseModel):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(BigInteger, nullable=False) # Now BigInteger is recognized
    row_count = Column(Integer, nullable=False)
    columns_info = Column(JSON)
    status = Column(String, nullable=False, default='processing')
    owner_id = Column(Integer, ForeignKey("users.id")) # Assuming your users table is named 'users'
    # This is the crucial part:
    owner = relationship("User", back_populates="datasets")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    # Add this relationship to the Dataset model
    analytics_tasks = relationship("AnalyticsTask", back_populates="dataset", cascade="all, delete-orphan")