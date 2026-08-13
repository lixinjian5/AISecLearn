"""
数据库配置 — SQLAlchemy ORM
本地开发默认用 SQLite（无需安装 MySQL），生产环境切换到 MySQL。
切换方法：修改环境变量 DATABASE_URL
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 数据库连接 URL
# 本地默认 SQLite；部署时设为 MySQL 连接串
# 例：mysql+pymysql://user:password@localhost:3306/aiseclearn
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./aiseclearn.db"
)

# SQLite 需要特殊参数；MySQL 不需要
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI 依赖：获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
