import os
from google import genai
from langchain_core.prompts import PromptTemplate

# --- Gemini client ---
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL = "gemini-2.5-flash"

quiz_prompt = PromptTemplate(
    input_variables=["content"],
    template="""
You are an expert quiz generator.

Create 5 MCQ questions from the content below.
Return STRICT JSON ONLY in this format:

[
  {{
    "question": "",
    "options": ["A", "B", "C", "D"],
    "answer": "A",
    "explanation": ""
  }}
]

CONTENT:
{content}
"""
)

related_prompt = PromptTemplate(
    input_variables=["content"],
    template="""
Extract 5 related learning topics from the content below.
Return STRICT JSON array only.

CONTENT:
{content}
"""
)

def _call_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )
    return response.text.strip()

def generate_quiz(content: str):
    prompt = quiz_prompt.format(content=content)
    return _call_gemini(prompt)

def generate_related(content: str):
    prompt = related_prompt.format(content=content)
    return _call_gemini(prompt)
