from pydantic import BaseModel
from typing import List, Dict

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str
    section: str

class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    sections: List[str]
    quiz: List[QuizQuestion]
    related_topics: List[str]
