const API = "http://localhost:8000";

const tab1 = document.getElementById("tab1");
const tab2 = document.getElementById("tab2");
const quizDiv = document.getElementById("quiz");
const historyTable = document.getElementById("history");

/* ---------- Tabs ---------- */
function tab(n) {
  tab1.style.display = n === 1 ? "block" : "none";
  tab2.style.display = n === 2 ? "block" : "none";
  if (n === 2) loadHistory();
}

/* ---------- Generate Quiz ---------- */
async function generate() {
  const url = document.getElementById("url").value.trim();
  if (!url) {
    alert("Please enter a Wikipedia URL");
    return;
  }

  try {
    const res = await fetch(
      `${API}/generate?url=${encodeURIComponent(url)}`,
      { method: "POST" }
    );

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();
    const quiz = parseQuiz(data.quiz);

    tab(1);
    renderQuiz(quiz);

  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend");
  }
}

/* ---------- Load History ---------- */
async function loadHistory() {
  try {
    const res = await fetch(`${API}/history`);
    if (!res.ok) throw new Error("History failed");

    const data = await res.json();

    historyTable.innerHTML = `
      <tr>
        <th>Title</th>
        <th>Action</th>
      </tr>
      ${data.map(q => `
        <tr>
          <td>${q.title}</td>
          <td>
            <button onclick="loadQuiz(${q.id})">
              Open
            </button>
          </td>
        </tr>
      `).join("")}
    `;

  } catch (err) {
    console.error(err);
    historyTable.innerHTML = "<tr><td>Failed to load history</td></tr>";
  }
}

/* ---------- Load Quiz by ID ---------- */
async function loadQuiz(id) {
  try {
    const res = await fetch(`${API}/quiz/${id}`);
    if (!res.ok) throw new Error("Quiz load failed");

    const data = await res.json();
    const quiz = parseQuiz(data.quiz);

    tab(1);
    renderQuiz(quiz);

  } catch (err) {
    console.error(err);
    alert("Failed to load quiz");
  }
}

/* ---------- Quiz Parser ---------- */
function parseQuiz(rawQuiz) {
  if (typeof rawQuiz === "string") {
    return JSON.parse(rawQuiz.replace(/```json|```/g, ""));
  }
  return rawQuiz;
}

/* ---------- Render Quiz ---------- */
function renderQuiz(quiz) {
  quizDiv.innerHTML = quiz.map((q, idx) => `
    <div class="card">
      <h3>Q${idx + 1}. ${q.question}</h3>

      ${q.options.map(opt => `
        <label>
          <input type="radio" name="q${idx}">
          ${opt}
        </label>
      `).join("")}

      <details>
        <summary>Show Answer</summary>
        <p><b>${q.answer}</b></p>
        <small>${q.explanation}</small>
      </details>
    </div>
  `).join("");
}
