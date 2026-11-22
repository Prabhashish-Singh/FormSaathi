from pydantic import BaseModel, Field
from typing import List, Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=5000)


class QuestionRequest(BaseModel):
    document_text: str = Field(default="", max_length=200000)
    question: str = Field(min_length=1, max_length=5000)
    output_language: str = "English"
    conversation_history: List[ChatMessage] = Field(
        default_factory=list,
        max_length=20
    )


class AnalysisRequest(BaseModel):
    document_text: str = Field(min_length=1, max_length=200000)
    output_language: str = "English"
    explanation_level: str = "Simple"
    category: str = "Auto Detect"