# from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
# from sqlalchemy.orm import relationship
# from datetime import datetime

# from app.core.database import Base

# class Answer(Base):
#     __tablename__ = "answers"

#     id = Column(Integer, primary_key=True, index=True)
#     exam_attempt_id = Column(Integer, ForeignKey("exam_attempts.id", ondelete="CASCADE"), nullable=False)
#     question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
#     selected_answer = Column(String, nullable=True)
#     is_correct = Column(Boolean, nullable=True)
#     marks_obtained = Column(Integer, default=0)
#     answered_at = Column(DateTime, default=datetime.utcnow)

#     exam_attempt = relationship("ExamAttempt", back_populates="answers")
#     question = relationship("Question", back_populates="answers")

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    exam_attempt_id = Column(Integer, ForeignKey("exam_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_answer = Column(String(1), nullable=True)  # ✅ FIXED: Changed String to String(1)
    is_correct = Column(Boolean, nullable=True)
    marks_obtained = Column(Integer, default=0)
    answered_at = Column(DateTime, default=datetime.utcnow)

    exam_attempt = relationship("ExamAttempt", back_populates="answers")
    question = relationship("Question", back_populates="answers")