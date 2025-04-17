import os
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.db.session import SessionLocal
from app.models import User  # 修改导入路径
from app.core.security import get_password_hash

def create_test_user():
    db = SessionLocal()
    try:
        user = User(
            email="test@example.com",
            username="test",
            hashed_password=get_password_hash("password123"),
            is_active=True
        )
        db.add(user)
        db.commit()
        print("测试用户创建成功")
    except Exception as e:
        print(f"创建用户失败: {e}")
    finally:
        db.close()

def create_admin_user():
    db = SessionLocal()
    try:
        # 检查用户是否已存在
        user = db.query(User).filter(User.email == "admin@example.com").first()
        if user:
            print("管理员用户已存在")
            return
            
        # 创建新用户
        admin = User(
            email="admin@example.com",
            username="admin",
            hashed_password=get_password_hash("password123"),
            is_active=True,
            is_superuser=True  # 确保管理员用户有超级用户权限
        )
        db.add(admin)
        db.commit()
        print("管理员用户创建成功")
    except Exception as e:
        print(f"创建用户失败: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
    create_admin_user()