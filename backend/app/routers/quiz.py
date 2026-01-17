from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import SessionLocal
from app.services.scraper import scrape_wikipedia
from app.services.llm import generate_quiz, generate_related
from app.services.cache import get_cached_quiz
from app.models import Quiz

router = APIRouter()


# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Generate Quiz ----------
@router.post("/generate")
def generate(url: str, db: Session = Depends(get_db)):
    # 1️⃣ Strong cache check (prevents duplicate insert)
    cached = get_cached_quiz(db, url)
    if cached:
        return cached

    try:
        # 2️⃣ Scrape Wikipedia
        scraped = scrape_wikipedia(url)

        # 3️⃣ Generate quiz + related topics
        quiz = generate_quiz(scraped["content"])
        related = generate_related(scraped["content"])

        # 4️⃣ Create DB record (LEAN & SAFE)
        record = Quiz(
            url=url,
            title=scraped["title"],
            summary=scraped["content"][:400],
            sections=[],              # keep empty for now
            quiz=quiz,
            related_topics=related,
            raw_html=None              # ❌ do NOT store raw HTML
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    except IntegrityError:
        # 5️⃣ Handle race condition safely
        db.rollback()
        cached = get_cached_quiz(db, url)
        if cached:
            return cached
        raise HTTPException(status_code=500, detail="Duplicate quiz error")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Quiz History (FIXED) ----------
@router.get("/history")
def history(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).order_by(Quiz.created_at.desc()).all()

    return [
        {
            "id": q.id,
            "title": q.title,
            "url": q.url,
            "created_at": q.created_at.isoformat()
        }
        for q in quizzes
    ]


# ---------- Single Quiz Details ----------
@router.get("/quiz/{quiz_id}")
def quiz_details(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return quiz
