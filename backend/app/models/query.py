from sqlalchemy import Column, String, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import BaseModel

class SavedQuery(BaseModel):
    __tablename__ = "saved_queries"

    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    query_string = Column(Text, nullable=False)
    parameters = Column(JSON, nullable=True)  # 新增：存储查询参数
    result_cache = Column(JSON, nullable=True)  # 新增：缓存查询结果
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 关系
    dataset = relationship("Dataset", back_populates="saved_queries")
    owner = relationship("User", back_populates="saved_queries")