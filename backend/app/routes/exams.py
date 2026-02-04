from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.user import User
from app.models.exam import Exam
from app.models.exam_attempt import ExamAttempt
from app.schemas.exam import (
    ExamCreate,
    ExamUpdate,
    ExamResponse,
    ExamDetailResponse,
    ExamListResponse
)

router = APIRouter()

@router.post("/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
async def create_exam(
    exam_data: ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    if exam_data.passing_marks > exam_data.total_marks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passing marks cannot exceed total marks"
        )
    
    new_exam = Exam(**exam_data.model_dump())
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    
    response = ExamResponse.model_validate(new_exam)
    response.question_count = 0
    return response

@router.get("/", response_model=List[ExamListResponse])
async def get_exams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        exams = db.query(Exam).all()
    else:
        exams = db.query(Exam).filter(Exam.is_published == True).all()
    
    result = []
    for exam in exams:
        question_count = len(exam.questions)
        
        attempt = db.query(ExamAttempt).filter(
            ExamAttempt.exam_id == exam.id,
            ExamAttempt.user_id == current_user.id
        ).first()
        
        attempt_count = db.query(ExamAttempt).filter(
            ExamAttempt.exam_id == exam.id,
            ExamAttempt.user_id == current_user.id
        ).count()
        
        exam_data = ExamListResponse(
            id=exam.id,
            title=exam.title,
            description=exam.description,
            duration_minutes=exam.duration_minutes,
            total_marks=exam.total_marks,
            passing_marks=exam.passing_marks,
            is_published=exam.is_published,
            question_count=question_count,
            has_attempted=attempt is not None,
            attempt_count=attempt_count,
            attempt_id=attempt.id if attempt else None
        )
        result.append(exam_data)
    
    return result

@router.get("/{exam_id}", response_model=ExamDetailResponse)
async def get_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    response = ExamDetailResponse.model_validate(exam)
    response.question_count = len(exam.questions)
    return response

@router.patch("/{exam_id}", response_model=ExamResponse)
async def update_exam(
    exam_id: int,
    exam_update: ExamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    update_data = exam_update.model_dump(exclude_unset=True)
    
    if "passing_marks" in update_data or "total_marks" in update_data:
        passing = update_data.get("passing_marks", exam.passing_marks)
        total = update_data.get("total_marks", exam.total_marks)
        if passing > total:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passing marks cannot exceed total marks"
            )
    
    for field, value in update_data.items():
        setattr(exam, field, value)
    
    db.commit()
    db.refresh(exam)
    
    response = ExamResponse.model_validate(exam)
    response.question_count = len(exam.questions)
    return response

@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    db.delete(exam)
    db.commit()
    
    return None

@router.post("/{exam_id}/publish", response_model=ExamResponse)
async def publish_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    if len(exam.questions) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot publish exam without questions"
        )
    
    exam.is_published = True
    db.commit()
    db.refresh(exam)
    
    response = ExamResponse.model_validate(exam)
    response.question_count = len(exam.questions)
    return response

@router.post("/{exam_id}/unpublish", response_model=ExamResponse)
async def unpublish_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    exam.is_published = False
    db.commit()
    db.refresh(exam)
    
    response = ExamResponse.model_validate(exam)
    response.question_count = len(exam.questions)
    return response