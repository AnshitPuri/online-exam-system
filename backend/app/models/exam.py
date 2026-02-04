# from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
# from sqlalchemy.orm import relationship
# from datetime import datetime

# from app.core.database import Base

# class Exam(Base):
#     __tablename__ = "exams"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, nullable=False, index=True)
#     description = Column(Text)
#     instructions = Column(Text)
#     duration_minutes = Column(Integer, nullable=False)
#     total_marks = Column(Integer, nullable=False)
#     passing_marks = Column(Integer, nullable=False)
#     is_published = Column(Boolean, default=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
#     exam_attempts = relationship("ExamAttempt", back_populates="exam", cascade="all, delete-orphan")


from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)  # ✅ FIXED
    description = Column(Text)
    instructions = Column(Text)
    duration_minutes = Column(Integer, nullable=False)
    total_marks = Column(Integer, nullable=False)
    passing_marks = Column(Integer, nullable=False)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    questions = relationship(
        "Question", back_populates="exam", cascade="all, delete-orphan"
    )
    exam_attempts = relationship(
        "ExamAttempt", back_populates="exam", cascade="all, delete-orphan"
    )
