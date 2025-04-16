from sqlalchemy import Column, String, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Visualization(BaseModel):
    __tablename__ = "visualizations"

    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    visualization_type = Column(String, nullable=False)  # line, bar, pie, scatter, map
    config = Column(JSON, nullable=False)  # 可视化配置
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 关系
    dataset = relationship("Dataset", back_populates="visualizations")
    owner = relationship("User", back_populates="visualizations")