import os
import google.generativeai as genai
from langchain_core.language_models.llms import LLM
from typing import Optional, List

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class Gemini25FlashLLM(LLM):
    """LangChain-compatible wrapper for gemini-2.5-flash"""

    @property
    def _llm_type(self) -> str:
        return "gemini-2.5-flash"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
    ) -> str:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)

        text = response.text

        if stop:
            for s in stop:
                text = text.split(s)[0]

        return text
