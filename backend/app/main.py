from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import quiz

app = FastAPI(
    title="WikiQuiz API",
    version="1.0.0"
)

# 🔥 CORS FIX (MOST IMPORTANT PART)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow Netlify + local (safe for college project)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# Routes
app.include_router(quiz.router)
