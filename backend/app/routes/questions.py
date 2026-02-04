from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

from app.services.csv_service import csv_service

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.user import User
from app.models.question import Question
from app.models.exam import Exam
from app.schemas.question import (
    QuestionCreate,
    QuestionUpdate,
    QuestionResponse
)

router = APIRouter()

@router.post("/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_question(
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    exam = db.query(Exam).filter(Exam.id == question_data.exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    if question_data.correct_answer not in ["A", "B", "C", "D"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Correct answer must be A, B, C, or D"
        )
    
    new_question = Question(**question_data.model_dump())
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    
    return QuestionResponse.model_validate(new_question)

@router.get("/exam/{exam_id}", response_model=List[QuestionResponse])
async def get_questions_by_exam(
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
    
    questions = db.query(Question).filter(Question.exam_id == exam_id).all()
    return [QuestionResponse.model_validate(q) for q in questions]

@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    return QuestionResponse.model_validate(question)

@router.patch("/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: int,
    question_update: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    update_data = question_update.model_dump(exclude_unset=True)
    
    if "correct_answer" in update_data:
        if update_data["correct_answer"] not in ["A", "B", "C", "D"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Correct answer must be A, B, C, or D"
            )
    
    for field, value in update_data.items():
        setattr(question, field, value)
    
    db.commit()
    db.refresh(question)
    
    return QuestionResponse.model_validate(question)

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    db.delete(question)
    db.commit()
    
    return None

@router.post("/import-csv/{exam_id}")
async def import_questions_csv(
    exam_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Import questions from CSV file for a specific exam
    Expected CSV format: question_text, option_a, option_b, option_c, option_d, correct_answer, marks, explanation
    """
    logger.info(f"Starting CSV import for exam_id: {exam_id}")
    
    # Verify exam exists
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        logger.warning(f"Exam not found: {exam_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exam with ID {exam_id} not found"
        )
    
    try:
        content = await file.read()
        content_str = content.decode('utf-8')
        logger.info(f"Read CSV content: {len(content_str)} characters")
        
        # Debug: Log first 200 characters
        logger.debug(f"CSV preview: {content_str[:200]}...")
        
    except Exception as e:
        logger.error(f"Error reading file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error reading CSV file: {str(e)}"
        )
    
    try:
        questions_data = csv_service.parse_questions_csv(content_str)
        logger.info(f"Parsed {len(questions_data)} questions from CSV")
    except Exception as e:
        logger.error(f"Error parsing CSV: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid CSV format: {str(e)}"
        )
    
    if len(questions_data) == 0:
        logger.warning("No questions found in CSV")
        return {
            "message": "No questions found in CSV",
            "imported": 0,
            "errors": ["CSV file is empty or has no valid rows"]
        }
    
    imported_count = 0
    errors = []
    
    for idx, q_data in enumerate(questions_data):
        # Validate required fields
        if not q_data.get('question_text') or not q_data.get('option_a') or \
           not q_data.get('option_b') or not q_data.get('option_c') or not q_data.get('option_d'):
            errors.append(f"Row {idx + 1}: Missing required fields (question_text, options)")
            continue
        
        # Validate correct answer
        correct_answer = q_data.get('correct_answer', 'A')
        if correct_answer not in ['A', 'B', 'C', 'D']:
            errors.append(f"Row {idx + 1}: Invalid correct answer '{correct_answer}'. Must be A, B, C, or D")
            continue
        
        try:
            # Create question
            new_question = Question(
                exam_id=exam_id,
                question_text=q_data['question_text'],
                option_a=q_data['option_a'],
                option_b=q_data['option_b'],
                option_c=q_data['option_c'],
                option_d=q_data['option_d'],
                correct_answer=q_data['correct_answer'],
                marks=q_data.get('marks', 1),
                explanation=q_data.get('explanation')
            )
            
            db.add(new_question)
            imported_count += 1
        except Exception as e:
            errors.append(f"Row {idx + 1}: Error creating question: {str(e)}")
    
    try:
        db.commit()
        logger.info(f"Successfully imported {imported_count} questions")
    except Exception as e:
        db.rollback()
        logger.error(f"Error committing to database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving questions to database: {str(e)}"
        )
    
    return {
        "message": "Questions import completed",
        "imported": imported_count,
        "errors": errors if errors else None
    }

@router.get("/export-csv/{exam_id}")
async def export_questions_csv(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Export questions to CSV file for a specific exam
    """
    # Verify exam exists
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    questions = db.query(Question).filter(Question.exam_id == exam_id).all()
    
    questions_data = []
    for q in questions:
        questions_data.append({
            'question_text': q.question_text,
            'option_a': q.option_a,
            'option_b': q.option_b,
            'option_c': q.option_c,
            'option_d': q.option_d,
            'correct_answer': q.correct_answer,
            'marks': q.marks,
            'explanation': q.explanation or ''
        })
    
    csv_content = csv_service.generate_questions_csv(questions_data)
    
    from fastapi.responses import StreamingResponse
    
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=questions_{exam.title.replace(' ', '_')}.csv"}
    )

# Schema for bulk question creation
class BulkQuestionCreate(BaseModel):
    exam_id: int
    questions: List[QuestionCreate]

@router.post("/bulk")
async def create_multiple_questions(
    bulk_data: BulkQuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Create multiple questions at once
    """
    # Verify exam exists
    exam = db.query(Exam).filter(Exam.id == bulk_data.exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    created_questions = []
    errors = []
    
    for idx, q_data in enumerate(bulk_data.questions):
        try:
            if q_data.correct_answer not in ["A", "B", "C", "D"]:
                errors.append(f"Question {idx + 1}: Invalid correct answer")
                continue
            
            new_question = Question(**q_data.model_dump())
            db.add(new_question)
            created_questions.append(new_question)
        except Exception as e:
            errors.append(f"Question {idx + 1}: {str(e)}")
    
    db.commit()
    
    # Refresh all created questions
    for q in created_questions:
        db.refresh(q)
    
    return {
        "message": "Bulk question creation completed",
        "created": len(created_questions),
        "errors": errors if errors else None
    }