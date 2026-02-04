# from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON
# from sqlalchemy.orm import relationship

# from app.core.database import Base

# class Question(Base):
#     __tablename__ = "questions"

#     id = Column(Integer, primary_key=True, index=True)
#     exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
#     question_text = Column(Text, nullable=False)
#     option_a = Column(String, nullable=False)
#     option_b = Column(String, nullable=False)
#     option_c = Column(String, nullable=False)
#     option_d = Column(String, nullable=False)
#     correct_answer = Column(String, nullable=False)
#     marks = Column(Integer, default=1)
#     explanation = Column(Text)

#     exam = relationship("Exam", back_populates="questions")
#     answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)

    question_text = Column(Text, nullable=False)

    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)

    correct_answer = Column(String(1), nullable=False)  # A / B / C / D

    marks = Column(Integer, default=1)
    explanation = Column(Text)

    exam = relationship("Exam", back_populates="questions")
    answers = relationship(
        "Answer", back_populates="question", cascade="all, delete-orphan"
    )
