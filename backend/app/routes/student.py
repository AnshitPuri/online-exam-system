from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.exam import Exam
from app.models.exam_attempt import ExamAttempt

router = APIRouter(prefix="/api/student", tags=["student"])

@router.get("/exams")
async def get_student_exams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all published exams available for students"""
    
    # Only students can access this endpoint
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access this endpoint"
        )
    
    # Get only published exams
    exams = db.query(Exam).filter(Exam.is_published == True).all()
    
    result = []
    for exam in exams:
        question_count = len(exam.questions)
        
        # Check if student has attempted this exam - get the most recent attempt
        attempt = db.query(ExamAttempt).filter(
            ExamAttempt.exam_id == exam.id,
            ExamAttempt.user_id == current_user.id
        ).order_by(ExamAttempt.id.desc()).first()
        
        # Count total attempts
        attempt_count = db.query(ExamAttempt).filter(
            ExamAttempt.exam_id == exam.id,
            ExamAttempt.user_id == current_user.id
        ).count()
        
        # Get attempt_id safely
        attempt_id = None
        if attempt and attempt.id:
            attempt_id = attempt.id
        elif attempt:
            # If attempt exists but id is null, try to get the max id
            max_id = db.query(ExamAttempt.id).filter(
                ExamAttempt.exam_id == exam.id,
                ExamAttempt.user_id == current_user.id
            ).scalar()
            attempt_id = max_id
        
        # Return as dictionary to ensure all fields are included
        exam_data = {
            "id": exam.id,
            "title": exam.title,
            "description": exam.description,
            "duration_minutes": exam.duration_minutes,
            "total_marks": exam.total_marks,
            "passing_marks": exam.passing_marks,
            "is_published": exam.is_published,
            "question_count": question_count,
            "has_attempted": attempt is not None,
            "attempt_count": attempt_count,
            "attempt_id": attempt_id
        }
        result.append(exam_data)
    
    return result
