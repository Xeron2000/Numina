from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.models.base import BaseModel

class Station(BaseModel):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    province = Column(String, nullable=False)
    city = Column(String, nullable=False)
    district = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, nullable=True)
    address = Column(String, nullable=True)
    status = Column(String, nullable=False, default='active')
    station_metadata = Column(JSON, nullable=True)  # Changed from 'metadata' to 'station_metadata'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())