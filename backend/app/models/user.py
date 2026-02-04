# from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
# from sqlalchemy.orm import relationship
# from datetime import datetime
# import enum

# from app.core.database import Base

# class UserRole(str, enum.Enum):
#     ADMIN = "admin"
#     STUDENT = "student"

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     full_name = Column(String, nullable=False)
#     hashed_password = Column(String, nullable=False)
#     role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
#     is_active = Column(Boolean, default=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     exam_attempts = relationship("ExamAttempt", back_populates="user", cascade="all, delete-orphan")

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)

    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    exam_attempts = relationship(
        "ExamAttempt",
        back_populates="user",
        cascade="all, delete-orphan"
    )
