from sqlalchemy import Column, String, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Dataset(BaseModel):
    __tablename__ = "datasets"

    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # csv, excel, etc.
    row_count = Column(Integer, nullable=True)
    columns_info = Column(JSON, nullable=True)  # 改用JSON类型存储列信息
    extra_metadata = Column(JSON, nullable=True)  # 改名：从metadata改为extra_metadata
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 关系
    owner = relationship("User", back_populates="datasets")
    visualizations = relationship("Visualization", back_populates="dataset", cascade="all, delete-orphan")
    saved_queries = relationship("SavedQuery", back_populates="dataset", cascade="all, delete-orphan")