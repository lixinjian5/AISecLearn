"""
AISecLearn 后端 API
FastAPI + JSON 文件数据库（MVP 阶段，后续切换 MySQL）
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path
from typing import Optional
from datetime import datetime

app = FastAPI(title="AISecLearn API", version="0.1.0")

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
def get_questions(category: Optional[str] = None, difficulty: Optional[str] = None, page: int = 1, page_size: int = 20):
    """获取题目列表，支持按分类/难度筛选和分页"""
    with open(DATA_DIR / "questions.json", encoding="utf-8") as f:
        questions = json.load(f)
    if category:
        questions = [q for q in questions if q["category"] == category]
    if difficulty:
        questions = [q for q in questions if q["difficulty"] == difficulty]
    total = len(questions)
    start = (page - 1) * page_size
    page_questions = questions[start:start + page_size]
    return {
        "total": total, "page": page, "page_size": page_size,
        "data": [{"id": q["id"], "category": q["category"], "difficulty": q["difficulty"],
                   "question": q["question"], "code": q.get("code"), "options": q["options"]}
                  for q in page_questions],
    }


@app.get("/api/questions/categories")
def get_categories():
    with open(DATA_DIR / "questions.json", encoding="utf-8") as f:
        questions = json.load(f)
    cats = sorted(set(q["category"] for q in questions))
    return [{"name": c, "count": sum(1 for q in questions if q["category"] == c)} for c in cats]


@app.post("/api/questions/{question_id}/check")
def check_answer(question_id: int, body: dict):
    user_answer = body.get("answer")
    if user_answer is None:
        raise HTTPException(status_code=400, detail="缺少 answer 参数")
    with open(DATA_DIR / "questions.json", encoding="utf-8") as f:
        questions = json.load(f)
    q = next((q for q in questions if q["id"] == question_id), None)
    if not q:
        raise HTTPException(status_code=404, detail="题目不存在")
    is_correct = q["answer"] == user_answer
    record_progress(1, question_id, str(user_answer), is_correct)
    return {"correct": is_correct, "correct_answer": q["answer"], "explanation": q.get("explanation", "")}


# ==================== 课程 API ====================

@app.get("/api/courses")
def get_courses():
    with open(DATA_DIR / "courses.json", encoding="utf-8") as f:
        return json.load(f)


@app.get("/api/courses/{course_id}")
def get_course(course_id: int):
    with open(DATA_DIR / "courses.json", encoding="utf-8") as f:
        courses = json.load(f)
    course = next((c for c in courses if c["id"] == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="课程不存在")
    return course


# ==================== 学习进度 API ====================

def record_progress(user_id: int, question_id: int, user_answer: str, is_correct: bool):
    pf = DATA_DIR / "learning_records.json"
    records = []
    if pf.exists():
        with open(pf, encoding="utf-8") as f:
            records = json.load(f)
    records.append({"id": len(records) + 1, "user_id": user_id, "question_id": question_id,
                    "user_answer": user_answer, "is_correct": is_correct, "created_at": datetime.now().isoformat()})
    with open(pf, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)


@app.get("/api/progress")
def get_progress(user_id: int = 1):
    pf = DATA_DIR / "learning_records.json"
    if not pf.exists():
        return {"total_answered": 0, "correct": 0, "wrong": 0, "accuracy": 0, "by_category": {}}
    with open(pf, encoding="utf-8") as f:
        records = json.load(f)
    user_records = [r for r in records if r["user_id"] == user_id]
    total = len(user_records)
    correct = sum(1 for r in user_records if r["is_correct"])
    with open(DATA_DIR / "questions.json", encoding="utf-8") as f:
        q_map = {q["id"]: q for q in json.load(f)}
    by_cat = {}
    for r in user_records:
        q = q_map.get(r["question_id"])
        if q:
            cat = q["category"]
            if cat not in by_cat: by_cat[cat] = {"total": 0, "correct": 0}
            by_cat[cat]["total"] += 1
            if r["is_correct"]: by_cat[cat]["correct"] += 1
    return {"total_answered": total, "correct": correct, "wrong": total - correct,
            "accuracy": round(correct / total * 100, 1) if total > 0 else 0, "by_category": by_cat}


@app.get("/api/progress/history")
def get_progress_history(user_id: int = 1, limit: int = 50):
    pf = DATA_DIR / "learning_records.json"
    if not pf.exists(): return []
    with open(pf, encoding="utf-8") as f:
        records = json.load(f)
    user_records = [r for r in records if r["user_id"] == user_id]
    with open(DATA_DIR / "questions.json", encoding="utf-8") as f:
        q_map = {q["id"]: q for q in json.load(f)}
    result = []
    for r in user_records[-limit:]:
        q = q_map.get(r["question_id"], {})
        result.append({**r, "question_text": q.get("question", ""), "category": q.get("category", ""),
                       "correct_answer": q.get("answer", "")})
    return list(reversed(result))


# ==================== 通用 ====================

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
