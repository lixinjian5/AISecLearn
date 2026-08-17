"""
数据导入 — 启动时把 JSON 数据导入数据库（表为空时）
"""
import json
from pathlib import Path

from database import SessionLocal, engine
from models import Base, Question, Course

DATA_DIR = Path(__file__).parent / "data"


def seed_questions(db):
    """导入题库（表为空时）"""
    if db.query(Question).count() > 0:
        return 0

    pf = DATA_DIR / "questions.json"
    if not pf.exists():
        return 0

    with open(pf, encoding="utf-8") as f:
        questions = json.load(f)

    for q in questions:
        db.add(Question(
            id=q["id"],
            category=q["category"],
            difficulty=q["difficulty"],
            question=q["question"],
            options=json.dumps(q["options"], ensure_ascii=False),
            answer=q["answer"],
            code=q.get("code"),
        ))
    db.commit()
    return len(questions)


def seed_courses(db):
    """导入课程（表为空时）"""
    if db.query(Course).count() > 0:
        return 0

    pf = DATA_DIR / "courses.json"
    if not pf.exists():
        return 0

    with open(pf, encoding="utf-8") as f:
        courses = json.load(f)

    for c in courses:
        db.add(Course(
            id=c["id"],
            title=c["title"],
            category=c["category"],
            difficulty=c["difficulty"],
            desc=c["desc"],
            icon=c["icon"],
            progress=c.get("progress", 0),
            lessons=c.get("lessons", 0),
        ))
    db.commit()
    return len(courses)


def run_seed():
    """创建表 + 导入数据"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        nq = seed_questions(db)
        nc = seed_courses(db)
        print(f"[seed] 导入题目 {nq} 道，课程 {nc} 门")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
