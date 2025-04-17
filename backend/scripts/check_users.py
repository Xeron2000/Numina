import os
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.db.session import SessionLocal
from app.models import User

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"\n总共有 {len(users)} 个用户:")
        for user in users:
            print(f"\n用户ID: {user.id}")
            print(f"邮箱: {user.email}")
            print(f"用户名: {user.username}")
            print(f"是否激活: {user.is_active}")
            print(f"是否是超级用户: {user.is_superuser}")
    except Exception as e:
        print(f"查询用户失败: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()