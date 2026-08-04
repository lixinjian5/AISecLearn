"""
AISecLearn 后端 API
FastAPI + JSON 文件数据库（MVP 阶段，后续切换 MySQL）
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from pathlib import Path
from typing import Optional

app = FastAPI(title="AISecLearn API", version="0.1.0")

# 允许前端跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"


# ==================== 题库 API ====================

@app.get("/api/questions")
def get_questions(category: Optional[str] = None):
    """获取题目列表，可选按分类筛选"""
    with open(DATA_DIR / "questions.json", encoding="utf-8") as f:
        questions = json.load(f)

    if category:
        questions = [q for q in questions if q["category"] == category]

    # 返回时去掉正确答案（防止前端被看到）
    return [{
        "id": q["id"],
        "category": q["category"],
        "difficulty": q["difficulty"],
        "question": q["question"],
        "code": q.get("code"),
        "options": q["options"],
    } for q in questions]


@app.post("/api/questions/{question_id}/check")
def check_answer(question_id: int, body: dict):
    """检查答案是否正确"""
    user_answer = body.get("answer")
    if user_answer is None:
        raise HTTPException(status_code=400, detail="缺少 answer 参数")

    with open(DATA_DIR / "questions.json", encoding="utf-8") as f:
        questions = json.load(f)

    q = next((q for q in questions if q["id"] == question_id), None)
    if not q:
        raise HTTPException(status_code=404, detail="题目不存在")

    is_correct = q["answer"] == user_answer
    return {
        "correct": is_correct,
        "correct_answer": q["answer"],
        "explanation": q.get("explanation", "")
    }


# ==================== 课程 API ====================

@app.get("/api/courses")
def get_courses():
    """获取课程列表"""
    with open(DATA_DIR / "courses.json", encoding="utf-8") as f:
        return json.load(f)


@app.get("/api/courses/{course_id}")
def get_course(course_id: int):
    """获取单个课程"""
    with open(DATA_DIR / "courses.json", encoding="utf-8") as f:
        courses = json.load(f)

    course = next((c for c in courses if c["id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="课程不存在")
    return course


# ==================== 通用 ====================

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
