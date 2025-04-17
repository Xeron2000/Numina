from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func

# 直接从 base_class 导入 Base，而不是从 base 导入
from app.db.base_class import Base

class BaseModel(Base):
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())