from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Visualization(Base):
    __tablename__ = "visualizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    visualization_type = Column(String, nullable=False)  # bar, line, pie, etc.
    config = Column(Text, nullable=False)  # JSON config for visualization
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    dataset = relationship("Dataset", back_populates="visualizations")
    owner = relationship("User")