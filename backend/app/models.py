from sqlalchemy import Column, Integer, String, JSON, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, nullable=False)
    title = Column(String)
    summary = Column(Text)
    sections = Column(JSON)
    quiz = Column(JSON)
    related_topics = Column(JSON)
    raw_html = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
