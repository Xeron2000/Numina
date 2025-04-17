from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from app.models.user import User
from app.models.dataset import Dataset
from app.models.query import SavedQuery
from app.models.visualization import Visualization
from app.models.settings import UserSettings
from app.models.geospatial import GeoFence

# 设置关系
User.datasets = relationship("Dataset", back_populates="owner", cascade="all, delete-orphan")
User.visualizations = relationship("Visualization", back_populates="owner", cascade="all, delete-orphan")
User.saved_queries = relationship("SavedQuery", back_populates="owner", cascade="all, delete-orphan")
User.geofences = relationship("GeoFence", back_populates="owner", cascade="all, delete-orphan")
User.settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")