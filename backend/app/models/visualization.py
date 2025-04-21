from sqlalchemy import Column, Integer, String, ForeignKey, JSON # Add necessary imports
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Visualization(BaseModel):
    __tablename__ = "visualizations" # Make sure you have a tablename

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    type = Column(String, nullable=False)  # 改为 type
    config = Column(JSON, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="visualizations")

    # Relationship to Dataset (if not already present)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    dataset = relationship("Dataset") # Assuming a simple relationship here