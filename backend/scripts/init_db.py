import os
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.db.base import Base
from app.db.session import engine
from app.models import (
    User, 
    Dataset, 
    SavedQuery, 
    Visualization, 
    UserSettings, 
    GeoFence,
    Activity,  # 添加活动日志模型
    Station,   # 添加气象站点模型
    AnalyticsTask  # 添加分析任务模型
)

def init_db():
    try:
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        print("数据库表创建成功")
    except Exception as e:
        print(f"创建数据库表失败: {e}")

if __name__ == "__main__":
    init_db()