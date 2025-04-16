from sqlalchemy import Column, String, Integer, ForeignKey, Text, JSON, Enum
import enum
from app.models.base import BaseModel

class VisualizationType(str, enum.Enum):
    BAR = "bar"
    LINE = "line"
    PIE = "pie"
    SCATTER = "scatter"
    MAP = "map"
    HEATMAP = "heatmap"

class Visualization(BaseModel):
    __tablename__ = "visualizations"

    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    visualization_type = Column(Enum(VisualizationType), nullable=False)
    config = Column(JSON, nullable=False)  # 改用JSON类型
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 关系
    dataset = relationship("Dataset", back_populates="visualizations")
    owner = relationship("User", back_populates="visualizations")