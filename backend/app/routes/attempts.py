from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import random
import logging

logger = logging.getLogger(__name__)

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.exam import Exam
from app.models.exam_attempt import ExamAttempt
from app.models.question import Question
from app.models.answer import Answer
from app.schemas.attempt import (
    AttemptStart,
    AttemptResponse,
    SaveAnswerRequest,
    TabSwitchRequest,
    SubmitExamRequest,
    ResultResponse,
    ResultSummary
)
from app.schemas.question import QuestionForStudent, QuestionWithAnswer

router = APIRouter()

@router.post("/start", response_model=AttemptResponse)
async def start_exam(
    attempt_data: AttemptStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can attempt exams"
        )
    
    exam = db.query(Exam).filter(Exam.id == attempt_data.exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    if not exam.is_published:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exam is not published"
        )
    
    existing_attempt = db.query(ExamAttempt).filter(
        ExamAttempt.exam_id == exam.id,
        ExamAttempt.user_id == current_user.id,
        ExamAttempt.is_submitted == True
    ).first()
    
    if existing_attempt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already attempted this exam"
        )
    
    ongoing_attempt = db.query(ExamAttempt).filter(
        ExamAttempt.exam_id == exam.id,
        ExamAttempt.user_id == current_user.id,
        ExamAttempt.is_submitted == False
    ).first()
    
    if ongoing_attempt:
        questions = db.query(Question).filter(Question.exam_id == exam.id).all()
        question_order = ongoing_attempt.question_order
        ordered_questions = sorted(questions, key=lambda q: question_order.index(q.id))
        
        return AttemptResponse(
            id=ongoing_attempt.id,
            exam_id=exam.id,
            exam_title=exam.title,
            start_time=ongoing_attempt.start_time,
            end_time=ongoing_attempt.end_time,
            duration_minutes=exam.duration_minutes,
            is_submitted=ongoing_attempt.is_submitted,
            questions=[QuestionForStudent.model_validate(q) for q in ordered_questions],
            question_order=question_order,
            tab_switches=ongoing_attempt.tab_switches
        )
    
    questions = db.query(Question).filter(Question.exam_id == exam.id).all()
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exam has no questions"
        )
    
    question_ids = [q.id for q in questions]
    random.shuffle(question_ids)
    
    new_attempt = ExamAttempt(
        user_id=current_user.id,
        exam_id=exam.id,
        start_time=datetime.utcnow(),
        question_order=question_ids,
        tab_switches=0
    )
    
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)
    
    for question_id in question_ids:
        answer = Answer(
            exam_attempt_id=new_attempt.id,
            question_id=question_id,
            selected_answer=None
        )
        db.add(answer)
    
    db.commit()
    
    ordered_questions = sorted(questions, key=lambda q: question_ids.index(q.id))
    
    return AttemptResponse(
        id=new_attempt.id,
        exam_id=exam.id,
        exam_title=exam.title,
        start_time=new_attempt.start_time,
        end_time=new_attempt.end_time,
        duration_minutes=exam.duration_minutes,
        is_submitted=new_attempt.is_submitted,
        questions=[QuestionForStudent.model_validate(q) for q in ordered_questions],
        question_order=question_ids,
        tab_switches=new_attempt.tab_switches
    )

@router.post("/{attempt_id}/answer")
async def save_answer(
    attempt_id: int,
    answer_data: SaveAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info(f"Saving answer for attempt {attempt_id}, question {answer_data.question_id}")
    
    attempt = db.query(ExamAttempt).filter(
        ExamAttempt.id == attempt_id,
        ExamAttempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        logger.warning(f"Attempt {attempt_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attempt not found"
        )
    
    if attempt.is_submitted:
        logger.warning(f"Attempt {attempt_id} already submitted")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exam already submitted"
        )
    
    elapsed = datetime.utcnow() - attempt.start_time
    exam = db.query(Exam).filter(Exam.id == attempt.exam_id).first()
    if elapsed > timedelta(minutes=exam.duration_minutes):
        logger.info(f"Time expired for attempt {attempt_id}, auto-submitting")
        return await submit_exam_internal(attempt_id, db, current_user)
    
    answer = db.query(Answer).filter(
        Answer.exam_attempt_id == attempt_id,
        Answer.question_id == answer_data.question_id
    ).first()
    
    if not answer:
        logger.warning(f"Answer not found for attempt {attempt_id}, question {answer_data.question_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Answer not found"
        )
    
    logger.info(f"Selected answer: {answer_data.selected_answer}")
    if answer_data.selected_answer not in ["A", "B", "C", "D"]:
        logger.warning(f"Invalid answer option: {answer_data.selected_answer}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid answer option"
        )
    
    answer.selected_answer = answer_data.selected_answer
    answer.answered_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Answer saved successfully"}

@router.post("/{attempt_id}/tab-switch")
async def record_tab_switch(
    attempt_id: int,
    tab_data: TabSwitchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempt = db.query(ExamAttempt).filter(
        ExamAttempt.id == attempt_id,
        ExamAttempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attempt not found"
        )
    
    if attempt.is_submitted:
        return {"tab_switches": attempt.tab_switches, "warning": False}
    
    attempt.tab_switches += 1
    db.commit()
    
    if attempt.tab_switches >= settings.MAX_TAB_SWITCHES:
        await submit_exam_internal(attempt_id, db, current_user)
        return {
            "tab_switches": attempt.tab_switches,
            "warning": True,
            "auto_submitted": True,
            "message": "Exam auto-submitted due to excessive tab switches"
        }
    
    return {
        "tab_switches": attempt.tab_switches,
        "warning": attempt.tab_switches >= settings.MAX_TAB_SWITCHES - 1
    }

@router.post("/{attempt_id}/submit", response_model=ResultResponse)
async def submit_exam(
    attempt_id: int,
    submit_data: SubmitExamRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info(f"Submitting exam for attempt {attempt_id}, user {current_user.id}")
    return await submit_exam_internal(attempt_id, db, current_user)

async def submit_exam_internal(attempt_id: int, db: Session, current_user: User):
    try:
        attempt = db.query(ExamAttempt).filter(
            ExamAttempt.id == attempt_id,
            ExamAttempt.user_id == current_user.id
        ).first()
        
        if not attempt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attempt not found"
            )
        
        if attempt.is_submitted:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Exam already submitted"
            )
        
        exam = db.query(Exam).filter(Exam.id == attempt.exam_id).first()
        
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        if not exam.total_marks or exam.total_marks <= 0:
            logger.error(f"Exam {exam.id} has invalid total_marks: {exam.total_marks}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Exam has not been configured properly (total_marks is 0)"
            )
        
        answers = db.query(Answer).filter(Answer.exam_attempt_id == attempt_id).all()
        
        if not answers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No answers found for this attempt"
            )
        
        total_score = 0
        for answer in answers:
            question = db.query(Question).filter(Question.id == answer.question_id).first()
            if not question:
                logger.warning(f"Question {answer.question_id} not found for answer {answer.id}")
                continue
            if answer.selected_answer == question.correct_answer:
                answer.is_correct = True
                answer.marks_obtained = question.marks
                total_score += question.marks
            else:
                answer.is_correct = False
                answer.marks_obtained = 0
        
        logger.info(f"Calculated score: {total_score}, total_marks: {exam.total_marks}")
        
        attempt.end_time = datetime.utcnow()
        attempt.is_submitted = True
        attempt.score = total_score
        attempt.total_marks = exam.total_marks
        attempt.percentage = round((total_score / exam.total_marks) * 100, 2) if exam.total_marks > 0 else 0
        attempt.passed = total_score >= exam.passing_marks
        
        logger.info(f"Attempt {attempt_id} submitted successfully. Score: {total_score}, Total: {exam.total_marks}")
        
        db.commit()
        db.refresh(attempt)
        
    except Exception as e:
        logger.error(f"Error submitting exam: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting exam: {str(e)}"
        )
    
    questions_with_answers = []
    for answer in answers:
        question = db.query(Question).filter(Question.id == answer.question_id).first()
        q_data = QuestionWithAnswer(
            id=question.id,
            exam_id=question.exam_id,
            question_text=question.question_text,
            option_a=question.option_a,
            option_b=question.option_b,
            option_c=question.option_c,
            option_d=question.option_d,
            correct_answer=question.correct_answer,
            marks=question.marks,
            explanation=question.explanation,
            selected_answer=answer.selected_answer,
            is_correct=answer.is_correct,
            marks_obtained=answer.marks_obtained
        )
        questions_with_answers.append(q_data)
    
    return ResultResponse(
        id=attempt.id,
        exam_id=exam.id,
        exam_title=exam.title,
        user_name=current_user.full_name,
        start_time=attempt.start_time,
        end_time=attempt.end_time,
        score=attempt.score,
        total_marks=attempt.total_marks,
        percentage=attempt.percentage,
        passed=attempt.passed,
        tab_switches=attempt.tab_switches,
        questions=questions_with_answers
    )

@router.get("/results", response_model=List[ResultSummary])
async def get_my_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempts = db.query(ExamAttempt).filter(
        ExamAttempt.user_id == current_user.id,
        ExamAttempt.is_submitted == True
    ).all()
    
    results = []
    for attempt in attempts:
        exam = db.query(Exam).filter(Exam.id == attempt.exam_id).first()
        result = ResultSummary(
            id=attempt.id,
            exam_id=exam.id,
            exam_title=exam.title,
            score=attempt.score,
            total_marks=attempt.total_marks,
            percentage=attempt.percentage,
            passed=attempt.passed,
            tab_switches=attempt.tab_switches,
            start_time=attempt.start_time,
            end_time=attempt.end_time
        )
        results.append(result)
    
    return results

@router.get("/results/{attempt_id}", response_model=ResultResponse)
async def get_result(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempt = db.query(ExamAttempt).filter(
        ExamAttempt.id == attempt_id,
        ExamAttempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    if not attempt.is_submitted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exam not yet submitted"
        )
    
    exam = db.query(Exam).filter(Exam.id == attempt.exam_id).first()
    answers = db.query(Answer).filter(Answer.exam_attempt_id == attempt_id).all()
    
    questions_with_answers = []
    for answer in answers:
        question = db.query(Question).filter(Question.id == answer.question_id).first()
        q_data = QuestionWithAnswer(
            id=question.id,
            exam_id=question.exam_id,
            question_text=question.question_text,
            option_a=question.option_a,
            option_b=question.option_b,
            option_c=question.option_c,
            option_d=question.option_d,
            correct_answer=question.correct_answer,
            marks=question.marks,
            explanation=question.explanation,
            selected_answer=answer.selected_answer,
            is_correct=answer.is_correct,
            marks_obtained=answer.marks_obtained
        )
        questions_with_answers.append(q_data)
    
    return ResultResponse(
        id=attempt.id,
        exam_id=exam.id,
        exam_title=exam.title,
        user_name=current_user.full_name,
        start_time=attempt.start_time,
        end_time=attempt.end_time,
        score=attempt.score,
        total_marks=attempt.total_marks,
        percentage=attempt.percentage,
        passed=attempt.passed,
        tab_switches=attempt.tab_switches,
        questions=questions_with_answers
    )