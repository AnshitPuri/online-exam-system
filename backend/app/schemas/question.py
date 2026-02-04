from pydantic import BaseModel, Field
from typing import Optional

class QuestionBase(BaseModel):
    question_text: str = Field(..., min_length=5)
    option_a: str = Field(..., min_length=1)
    option_b: str = Field(..., min_length=1)
    option_c: str = Field(..., min_length=1)
    option_d: str = Field(..., min_length=1)
    correct_answer: str = Field(..., pattern="^[A-D]$")
    marks: int = Field(default=1, gt=0)
    explanation: Optional[str] = None

class QuestionCreate(QuestionBase):
    exam_id: int

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    correct_answer: Optional[str] = None
    marks: Optional[int] = None
    explanation: Optional[str] = None

class QuestionResponse(QuestionBase):
    id: int
    exam_id: int

    class Config:
        from_attributes = True

class QuestionForStudent(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    marks: int

    class Config:
        from_attributes = True

class QuestionWithAnswer(QuestionResponse):
    selected_answer: Optional[str] = None
    is_correct: Optional[bool] = None
    marks_obtained: int = 0