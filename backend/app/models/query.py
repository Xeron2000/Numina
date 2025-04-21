from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON # Add JSON here
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class SavedQuery(BaseModel):
    __tablename__ = "saved_queries" # Make sure you have a tablename

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    query_string = Column(Text, nullable=False)
    parameters = Column(JSON, nullable=True)  # 新增：存储查询参数 (Now JSON is recognized)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="saved_queries")

    # Relationship to Dataset (if not already present)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    dataset = relationship("Dataset") # Assuming a simple relationship here