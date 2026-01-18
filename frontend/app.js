/* ===============================
   CONFIG
================================ */
const API = "https://wikiquiz-ncdk.onrender.com".replace(/\/$/, "");; 

const quizDiv = document.getElementById("quiz");
const historyTable = document.getElementById("history");
const tab1 = document.getElementById("tab1");
const tab2 = document.getElementById("tab2");

/* ===============================
   TABS
================================ */
function tab(n) {
  tab1.style.display = n === 1 ? "block" : "none";
  tab2.style.display = n === 2 ? "block" : "none";

  document.querySelectorAll(".tabs button").forEach((btn, i) => {
    btn.classList.toggle("active", i === n - 1);
  });

  if (n === 2) loadHistory();
}

/* ===============================
   GENERATE QUIZ
================================ */
async function generate() {
  const url = document.getElementById("url").value.trim();

  if (!url) {
    alert("Please enter a Wikipedia URL");
    return;
  }

  quizDiv.innerHTML = "<p>Generating quiz...</p>";

  try {
    const res = await fetch(
      `${API}/generate?url=${encodeURIComponent(url)}`,
      { method: "POST" }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      throw new Error("Backend error");
    }

    const data = await res.json();

    let quiz = data.quiz;

    // 🔥 Safety: quiz might come as string
    if (typeof quiz === "string") {
      quiz = JSON.parse(quiz.replace(/```json|```/g, ""));
    }

    renderQuiz(quiz);

  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend");
    quizDiv.innerHTML = "";
  }
}

/* ===============================
   RENDER QUIZ
================================ */
function renderQuiz(quiz) {
  if (!Array.isArray(quiz)) {
    quizDiv.innerHTML = "<p>Invalid quiz data</p>";
    return;
  }

  quizDiv.innerHTML = quiz.map((q, idx) => `
    <div class="card">
      <h3>Q${idx + 1}. ${q.question}</h3>

      <div class="options">
        ${q.options.map(opt => `
          <label>
            <input type="radio" name="q${idx}">
            ${opt}
          </label>
        `).join("")}
      </div>

      <p class="answer">
        <b>Answer:</b> ${q.answer}
      </p>

      <small>${q.explanation || ""}</small>
    </div>
  `).join("");
}

/* ===============================
   LOAD HISTORY
================================ */
async function loadHistory() {
  historyTable.innerHTML = "<tr><td>Loading...</td></tr>";

  try {
    const res = await fetch(`${API}/history`);

    if (!res.ok) {
      throw new Error("History fetch failed");
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      historyTable.innerHTML = "<tr><td>No quizzes yet</td></tr>";
      return;
    }

    historyTable.innerHTML = data.map(q => `
      <tr class="history-row" onclick="openQuiz(${q.id})">
        <td>${q.title}</td>
      </tr>
    `).join("");

  } catch (err) {
    console.error(err);
    historyTable.innerHTML = "<tr><td>Failed to load history</td></tr>";
  }
}

/* ===============================
   OPEN QUIZ FROM HISTORY
================================ */
async function openQuiz(id) {
  tab(1);
  quizDiv.innerHTML = "<p>Loading quiz...</p>";

  try {
    const res = await fetch(`${API}/quiz/${id}`);

    if (!res.ok) {
      throw new Error("Quiz load failed");
    }

    const data = await res.json();

    let quiz = data.quiz;
    if (typeof quiz === "string") {
      quiz = JSON.parse(quiz.replace(/```json|```/g, ""));
    }

    renderQuiz(quiz);

  } catch (err) {
    console.error(err);
    alert("Failed to load quiz");
  }
}
