# 🧠 WikiQuiz App

WikiQuiz is a full-stack web application that generates intelligent, interactive quizzes from Wikipedia articles using AI.  
Users can paste any Wikipedia URL, generate a quiz instantly, and revisit previously generated quizzes from history.

---

## 🚀 Features

- 🔗 Generate quizzes from any Wikipedia article
- 🤖 AI-powered quiz & related topics generation (Gemini 2.5 Flash)
- 💾 Persistent quiz storage using PostgreSQL
- ⚡ Smart caching (prevents duplicate generation)
- 🕘 Quiz history with click-to-reopen functionality
- 🎨 Clean, modern, responsive UI
- 🧩 Modular, scalable backend architecture

---

## 🏗️ Tech Stack

### Backend
- **FastAPI**
- **SQLAlchemy**
- **PostgreSQL**
- **LangChain**
- **Google Gemini 2.5 Flash**
- **Uvicorn**

### Frontend
- **HTML**
- **CSS**
- **Vanilla JavaScript (Fetch API)**

---

## 📂 Project Structure

```
wikiquiz/
├── .gitignore
├── README.md
├── backend/
│   ├── README.md
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── prompts/
│   │   │   ├── quiz_prompt.txt
│   │   │   └── related_prompt.txt
│   │   ├── routers/
│   │   │   └── quiz.py
│   │   ├── schemas.py
│   │   └── services/
│   │       ├── cache.py
│   │       ├── gemini25_llm.py
│   │       ├── llm.py
│   │       └── scraper.py
│   └── requirements.txt
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── styles.css
└── sample_data/
    ├── alan_turing.json
    └── urls.txt
```
## ⚙️ Prerequisites

- Python **3.10+**
- PostgreSQL **14+**
- Google Gemini API key
- Git

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:


DATABASE_URL=postgresql://username:password@localhost:5432/wikiquiz
GEMINI_API_KEY=your_gemini_api_key_here


---

## 🧪 Backend Setup

### 1️⃣ Navigate to backend
```bash
cd backend

2️⃣ Create virtual environment

python -m venv venv
source venv/bin/activate   # macOS/Linux

3️⃣ Install dependencies

pip install -r requirements.txt

4️⃣ Start PostgreSQL

brew services start postgresql@14

5️⃣ Create database

createdb wikiquiz

6️⃣ Run backend server

python -m uvicorn app.main:app --reload

Backend will be available at:

http://127.0.0.1:8000


🌐 Frontend Setup

1️⃣ Navigate to frontend

cd frontend

2️⃣ Open in browser

open index.html

⚠️ Make sure backend is running before clicking Generate


API Endpoints

Generate Quiz

POST /generate?url=<wikipedia_url>

Quiz History

GET /history

Fetch Quiz by ID

GET /quiz/{quiz_id}


🧠 How It Works

1. User submits a Wikipedia URL

2. Wikipedia content is scraped

3. Content is sent to Gemini via LangChain

4. AI generates:

   -> Multiple-choice quiz

   -> Related topics

5. Quiz is stored in PostgreSQL

6. Cached quizzes are reused

7. User can revisit quizzes from history


🛡️ Error Handling

1. Duplicate quiz URLs are prevented

2. Cached results are returned automatically

3. Graceful API and UI error handling

4. Backend rollback on failure


🎯 Future Enhancements

1. User authentication

2. Quiz scoring & analytics

3. Timed quizzes

4. React frontend

5. RAG-based explanations

6. Bookmark & share quizzes
