from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class ExamBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    instructions: Optional[str] = None
    duration_minutes: int = Field(..., gt=0)
    total_marks: int = Field(..., gt=0)
    passing_marks: int = Field(..., gt=0)

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    duration_minutes: Optional[int] = None
    total_marks: Optional[int] = None
    passing_marks: Optional[int] = None
    is_published: Optional[bool] = None

class ExamResponse(BaseModel):
    id: int
    is_published: bool
    created_at: datetime
    question_count: Optional[int] = 0
    model_config = ConfigDict(from_attributes=True)

class ExamDetailResponse(ExamResponse):
    questions: List["QuestionResponse"] = []

class ExamListResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    duration_minutes: int
    total_marks: int
    passing_marks: int
    is_published: bool
    question_count: int
    has_attempted: bool = False
    attempt_count: int = 0
    attempt_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

from app.schemas.question import QuestionResponse
ExamDetailResponse.model_rebuild()
