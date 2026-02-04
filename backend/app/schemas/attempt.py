from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.question import QuestionForStudent, QuestionWithAnswer

class AttemptStart(BaseModel):
    exam_id: int

class AttemptResponse(BaseModel):
    id: int
    exam_id: int
    exam_title: str
    start_time: datetime
    end_time: Optional[datetime]
    duration_minutes: int
    is_submitted: bool
    questions: List[QuestionForStudent]
    question_order: List[int]
    tab_switches: int

    class Config:
        from_attributes = True

class SaveAnswerRequest(BaseModel):
    question_id: int
    selected_answer: str

class TabSwitchRequest(BaseModel):
    pass

class SubmitExamRequest(BaseModel):
    pass

class ResultResponse(BaseModel):
    id: int
    exam_id: int
    exam_title: str
    user_name: str
    start_time: datetime
    end_time: Optional[datetime]
    score: int
    total_marks: int
    percentage: float
    passed: bool
    tab_switches: int
    questions: List[QuestionWithAnswer]

    class Config:
        from_attributes = True

class ResultSummary(BaseModel):
    id: int
    exam_id: int
    exam_title: str
    score: int
    total_marks: int
    percentage: float
    passed: bool
    tab_switches: int
    start_time: datetime
    end_time: Optional[datetime]

    class Config:
        from_attributes = True