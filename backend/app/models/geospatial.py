# 修改导入语句，加入 Float
from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Float # Add Float here
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class GeoFence(BaseModel):
    __tablename__ = "geofences" # Make sure you have a tablename

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    geometry = Column(JSON, nullable=False)  # 存储 GeoJSON 格式的地理信息
    radius = Column(Float, nullable=True)  # 如果是圆形围栏则需要半径 (Now Float is recognized)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="geofences")