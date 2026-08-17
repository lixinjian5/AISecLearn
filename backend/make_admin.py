"""
设置管理员脚本
用法：python make_admin.py <用户名>
"""
import sys

from database import SessionLocal
from models import User


def make_admin(username: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            print(f"❌ 用户 '{username}' 不存在")
            return
        user.role = "admin"
        db.commit()
        print(f"✅ 已将 '{username}' 设置为管理员")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法：python make_admin.py <用户名>")
    else:
        make_admin(sys.argv[1])
