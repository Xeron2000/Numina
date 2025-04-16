from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class GeoFence(BaseModel):
    __tablename__ = "geofences"

    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    coordinates = Column(JSON, nullable=False)  # GeoJSON格式的围栏坐标
    center = Column(JSON, nullable=False)  # 中心点坐标 {lat: number, lng: number}
    radius = Column(Float, nullable=True)  # 如果是圆形围栏则需要半径
    fence_type = Column(String, nullable=False)  # polygon, circle
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 关系
    owner = relationship("User", back_populates="geofences")