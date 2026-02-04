from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class ExamAttempt(Base):
    __tablename__ = "exam_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    is_submitted = Column(Boolean, default=False)
    score = Column(Integer, nullable=True)
    total_marks = Column(Integer, nullable=True)
    percentage = Column(Integer, nullable=True)
    passed = Column(Boolean, nullable=True)
    tab_switches = Column(Integer, default=0)
    question_order = Column(JSON, nullable=True)

    user = relationship("User", back_populates="exam_attempts")
    exam = relationship("Exam", back_populates="exam_attempts")
    answers = relationship("Answer", back_populates="exam_attempt", cascade="all, delete-orphan")