"""
数据模型 — SQLAlchemy ORM
对应 MySQL 表结构（SQLite 也能用）
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="student")  # student / admin
    level = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    records = relationship("LearningRecord", back_populates="user")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), index=True)
    difficulty = Column(String(20))
    question = Column(Text)
    options = Column(Text)  # JSON 字符串
    answer = Column(Integer)
    code = Column(Text, nullable=True)


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    category = Column(String(50))
    difficulty = Column(String(20))
    desc = Column(Text)
    icon = Column(String(10))
    progress = Column(Integer, default=0)
    lessons = Column(Integer, default=0)


class LearningRecord(Base):
    __tablename__ = "learning_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    user_answer = Column(String(10))
    is_correct = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="records")
