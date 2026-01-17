from fastapi import FastAPI
from app.database import Base, engine
from app.routers import quiz
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wiki Quiz App")
app.include_router(quiz.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
