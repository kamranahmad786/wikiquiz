from sqlalchemy.orm import Session
from app.models import Quiz

def get_cached_quiz(db: Session, url: str):
    return db.query(Quiz).filter(Quiz.url == url).first()
