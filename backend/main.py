"""
AISecLearn 后端 API
FastAPI + SQLAlchemy ORM（SQLite 本地 / MySQL 生产）
"""
import os
import urllib.request
import urllib.error
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json
from datetime import datetime, timedelta
from typing import Optional

from database import Base, engine, get_db
from models import User, Question, Course, LearningRecord
from auth import hash_password, verify_password, create_access_token, get_current_user
from seed_data import run_seed

# 启动时自动建表 + 导入种子数据
run_seed()

app = FastAPI(title="AISecLearn API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def q_to_dict(q: Question) -> dict:
    """题目对象转字典（不含答案，防作弊）"""
    return {
        "id": q.id,
        "category": q.category,
        "difficulty": q.difficulty,
        "question": q.question,
        "code": q.code,
        "options": json.loads(q.options) if q.options else [],
    }


# ==================== 题库 API ====================

@app.get("/api/questions")
def get_questions(category: Optional[str] = None, difficulty: Optional[str] = None,
                  page: int = 1, page_size: int = 20, include_answer: bool = False,
                  db: Session = Depends(get_db)):
    """获取题目列表，支持按分类/难度筛选和分页"""
    query = db.query(Question)
    if category:
        query = query.filter(Question.category == category)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)

    total = query.count()
    questions = query.offset((page - 1) * page_size).limit(page_size).all()

    data = []
    for q in questions:
        d = q_to_dict(q)
        if include_answer:
            d["answer"] = q.answer  # 题库浏览模式才返回答案
        data.append(d)

    return {
        "total": total, "page": page, "page_size": page_size,
        "data": data,
    }


@app.get("/api/questions/categories")
def get_categories(db: Session = Depends(get_db)):
    """获取分类及题目数量"""
    questions = db.query(Question).all()
    cats = {}
    for q in questions:
        cats[q.category] = cats.get(q.category, 0) + 1
    return [{"name": c, "count": n} for c, n in sorted(cats.items())]


@app.post("/api/questions/{question_id}/check")
def check_answer(question_id: int, body: dict,
                 current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """提交答案，记录到学习记录"""
    user_answer = body.get("answer")
    if user_answer is None:
        raise HTTPException(status_code=400, detail="缺少 answer 参数")

    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="题目不存在")

    is_correct = q.answer == user_answer

    # 写入学习记录（数据库）
    db.add(LearningRecord(
        user_id=current_user.id,
        question_id=question_id,
        user_answer=str(user_answer),
        is_correct=is_correct,
    ))
    db.commit()

    return {"correct": is_correct, "correct_answer": q.answer, "explanation": ""}


# ==================== 课程 API ====================

@app.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    """获取课程列表"""
    courses = db.query(Course).all()
    return [{
        "id": c.id, "title": c.title, "category": c.category,
        "difficulty": c.difficulty, "desc": c.desc, "icon": c.icon,
        "progress": c.progress, "lessons": c.lessons,
    } for c in courses]


@app.get("/api/courses/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    """获取单个课程"""
    c = db.query(Course).filter(Course.id == course_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="课程不存在")
    return {
        "id": c.id, "title": c.title, "category": c.category,
        "difficulty": c.difficulty, "desc": c.desc, "icon": c.icon,
        "progress": c.progress, "lessons": c.lessons,
    }


# ==================== 学习进度 API ====================

@app.get("/api/progress")
def get_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """用户学习进度统计（含分类正确率）"""
    records = db.query(LearningRecord).filter(LearningRecord.user_id == current_user.id).all()
    total = len(records)
    correct = sum(1 for r in records if r.is_correct)

    # 分类统计
    q_map = {q.id: q for q in db.query(Question).all()}
    by_cat = {}
    for r in records:
        q = q_map.get(r.question_id)
        if q:
            cat = q.category
            if cat not in by_cat:
                by_cat[cat] = {"total": 0, "correct": 0}
            by_cat[cat]["total"] += 1
            if r.is_correct:
                by_cat[cat]["correct"] += 1

    # 计算各分类正确率
    for cat in by_cat:
        by_cat[cat]["accuracy"] = round(by_cat[cat]["correct"] / by_cat[cat]["total"] * 100, 1)

    return {
        "total_answered": total, "correct": correct, "wrong": total - correct,
        "accuracy": round(correct / total * 100, 1) if total > 0 else 0,
        "by_category": by_cat,
    }


@app.get("/api/progress/weekly")
def get_progress_weekly(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """最近 7 天每日答题数与正确数"""
    today = datetime.utcnow().date()
    start = today - timedelta(days=6)

    records = db.query(LearningRecord).filter(
        LearningRecord.user_id == current_user.id,
        LearningRecord.created_at >= datetime.combine(start, datetime.min.time()),
    ).all()

    # 按日期分组
    days = {}
    for i in range(7):
        d = (start + timedelta(days=i)).isoformat()
        days[d] = {"date": d, "answered": 0, "correct": 0}

    for r in records:
        d = r.created_at.date().isoformat()
        if d in days:
            days[d]["answered"] += 1
            if r.is_correct:
                days[d]["correct"] += 1

    return list(days.values())


@app.get("/api/progress/history")
def get_progress_history(current_user: User = Depends(get_current_user), limit: int = 50,
                         db: Session = Depends(get_db)):
    """答题历史（含题目信息）"""
    records = db.query(LearningRecord).filter(
        LearningRecord.user_id == current_user.id
    ).order_by(LearningRecord.created_at.desc()).limit(limit).all()

    q_map = {q.id: q for q in db.query(Question).all()}
    result = []
    for r in reversed(records):
        q = q_map.get(r.question_id)
        result.append({
            "id": r.id, "question_id": r.question_id,
            "user_answer": r.user_answer, "is_correct": r.is_correct,
            "created_at": r.created_at.isoformat(),
            "question_text": q.question if q else "",
            "category": q.category if q else "",
            "correct_answer": q.answer if q else "",
            "options": json.loads(q.options) if q and q.options else [],
        })
    return result


# ==================== 用户认证 API ====================

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/api/auth/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """用户注册"""
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="用户名已存在")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="邮箱已注册")

    user = User(
        username=req.username,
        email=req.email,
        password_hash=hash_password(req.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "role": user.role},
    }


@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """用户登录"""
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    token = create_access_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "role": user.role},
    }


@app.get("/api/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    """获取当前登录用户信息（受 JWT 保护）"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "level": current_user.level,
    }


# ==================== 后台管理 API ====================

@app.get("/api/admin/users")
def admin_get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """获取用户列表（仅管理员）"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="需要管理员权限")

    users = db.query(User).all()
    return [{
        "id": u.id, "username": u.username, "role": u.role,
        "level": u.level, "created_at": u.created_at.isoformat() if u.created_at else None,
    } for u in users]


@app.get("/api/admin/stats")
def admin_get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """平台统计（仅管理员）"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="需要管理员权限")

    users = db.query(User).count()
    questions = db.query(Question).count()
    courses = db.query(Course).count()
    records = db.query(LearningRecord).count()

    return {
        "users": users, "questions": questions,
        "courses": courses, "learning_records": records,
    }


# ==================== AI 代理 API ====================
# 前端不直接调 DeepSeek，统一走后端代理，保护 API Key

class AIChatRequest(BaseModel):
    messages: list
    temperature: float = 0.7
    max_tokens: int = 2000


@app.post("/api/ai/chat")
def ai_chat(req: AIChatRequest, current_user: User = Depends(get_current_user)):
    """AI 对话代理：后端持 Key 调 DeepSeek，前端只带 JWT"""
    api_key = os.getenv("DEEPSEEK_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=500, detail="服务器未配置 DEEPSEEK_API_KEY")

    body = {
        "model": "deepseek-chat",
        "messages": req.messages,
        "temperature": req.temperature,
        "max_tokens": req.max_tokens,
        "stream": False,
    }

    request = urllib.request.Request(
        "https://api.deepseek.com/v1/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return {"content": data["choices"][0]["message"]["content"]}
    except urllib.error.HTTPError as e:
        detail = json.loads(e.read().decode("utf-8")).get("error", {}).get("message", "AI 服务错误")
        raise HTTPException(status_code=502, detail=f"DeepSeek: {detail}")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI 服务不可用: {str(e)}")


# ==================== 通用 ====================

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "0.3.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
