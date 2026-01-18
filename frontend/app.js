const API = "https://wikiquiz-ncdk.onrender.com";

const quizDiv = document.getElementById("quiz");
const historyBody = document.getElementById("history");
const tab1 = document.getElementById("tab1");
const tab2 = document.getElementById("tab2");

/* ---------- Tabs ---------- */
function tab(n) {
  tab1.style.display = n === 1 ? "block" : "none";
  tab2.style.display = n === 2 ? "block" : "none";

  document.querySelectorAll(".tabs button").forEach((b, i) => {
    b.classList.toggle("active", i === n - 1);
  });

  if (n === 2) loadHistory();
}

/* ---------- Generate Quiz ---------- */
async function generate() {
  const url = document.getElementById("url").value.trim();
  if (!url) return alert("Enter Wikipedia URL");

  try {
    const res = await fetch(
      `${API}/generate?url=${encodeURIComponent(url)}`,
      { method: "POST" }
    );

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();
    let quiz = data.quiz;

    if (typeof quiz === "string") {
      quiz = JSON.parse(quiz.replace(/```json|```/g, ""));
    }

    renderQuiz(quiz);
    tab(1);

  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend");
  }
}

/* ---------- Render Quiz ---------- */
function renderQuiz(quiz) {
  quizDiv.innerHTML = quiz.map((q, i) => `
    <div class="card">
      <h3>Q${i + 1}. ${q.question}</h3>

      ${q.options.map(opt => `
        <label class="option">
          <input type="radio" name="q${i}">
          ${opt}
        </label>
      `).join("")}

      <p class="answer"><b>Answer:</b> ${q.answer}</p>
      <small>${q.explanation}</small>
    </div>
  `).join("");
}

/* ---------- Load History ---------- */
async function loadHistory() {
  try {
    const res = await fetch(`${API}/history`);
    if (!res.ok) throw new Error();

    const data = await res.json();

    historyBody.innerHTML = data.map(q => `
      <tr>
        <td class="history-card">
          <span>${q.title}</span>
          <button onclick="openQuiz(${q.id})">Open</button>
        </td>
      </tr>
    `).join("");

  } catch {
    historyBody.innerHTML =
      `<tr><td>Failed to load history</td></tr>`;
  }
}

/* ---------- Open Quiz from History ---------- */
async function openQuiz(id) {
  try {
    const res = await fetch(`${API}/quiz/${id}`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    let quiz = data.quiz;

    if (typeof quiz === "string") {
      quiz = JSON.parse(quiz.replace(/```json|```/g, ""));
    }

    renderQuiz(quiz);
    tab(1);

  } catch {
    alert("Failed to open quiz");
  }
}
