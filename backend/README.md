## Backend Setup

1. Create database:
CREATE DATABASE wikiquiz;

2. Install deps:
pip install -r requirements.txt

3. Set env:
export GEMINI_API_KEY=your_key
export DATABASE_URL=postgresql://user:pass@localhost/wikiquiz

4. Run:
uvicorn app.main:app --reload
