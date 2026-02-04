from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.user import User
from app.models.exam import Exam
from app.models.exam_attempt import ExamAttempt
from app.models.question import Question
from app.models.answer import Answer
from app.schemas.attempt import ResultResponse
from app.schemas.question import QuestionWithAnswer
from app.services.csv_service import csv_service

router = APIRouter()

@router.get("/dashboard")
async def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    total_students = db.query(User).filter(User.role == "student").count()
    total_exams = db.query(Exam).count()
    published_exams = db.query(Exam).filter(Exam.is_published == True).count()
    total_attempts = db.query(ExamAttempt).filter(ExamAttempt.is_submitted == True).count()
    
    recent_attempts = db.query(ExamAttempt).filter(
        ExamAttempt.is_submitted == True
    ).order_by(ExamAttempt.end_time.desc()).limit(10).all()
    
    recent_results = []
    for attempt in recent_attempts:
        exam = db.query(Exam).filter(Exam.id == attempt.exam_id).first()
        user = db.query(User).filter(User.id == attempt.user_id).first()
        recent_results.append({
            "id": attempt.id,
            "student_name": user.full_name,
            "exam_title": exam.title,
            "score": attempt.score,
            "total_marks": attempt.total_marks,
            "percentage": attempt.percentage,
            "passed": attempt.passed,
            "submitted_at": attempt.end_time
        })
    
    return {
        "stats": {
            "total_students": total_students,
            "total_exams": total_exams,
            "published_exams": published_exams,
            "total_attempts": total_attempts,
            "unpublished_exams": total_exams - published_exams,
            "active_students": total_students
        },
        "recent_results": recent_results
    }

@router.get("/results/all")
async def get_all_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    attempts = db.query(ExamAttempt).filter(
        ExamAttempt.is_submitted == True
    ).order_by(ExamAttempt.end_time.desc()).all()
    
    results = []
    for attempt in attempts:
        exam = db.query(Exam).filter(Exam.id == attempt.exam_id).first()
        user = db.query(User).filter(User.id == attempt.user_id).first()
        results.append({
            "id": attempt.id,
            "student_id": user.id,
            "student_name": user.full_name,
            "student_email": user.email,
            "exam_id": exam.id,
            "exam_title": exam.title,
            "score": attempt.score,
            "total_marks": attempt.total_marks,
            "percentage": attempt.percentage,
            "passed": attempt.passed,
            "tab_switches": attempt.tab_switches,
            "start_time": attempt.start_time,
            "end_time": attempt.end_time
        })
    
    return results

@router.get("/results/exam/{exam_id}")
async def get_exam_results(
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
    
    attempts = db.query(ExamAttempt).filter(
        ExamAttempt.exam_id == exam_id,
        ExamAttempt.is_submitted == True
    ).all()
    
    results = []
    for attempt in attempts:
        user = db.query(User).filter(User.id == attempt.user_id).first()
        results.append({
            "id": attempt.id,
            "student_id": user.id,
            "student_name": user.full_name,
            "student_email": user.email,
            "score": attempt.score,
            "total_marks": attempt.total_marks,
            "percentage": attempt.percentage,
            "passed": attempt.passed,
            "tab_switches": attempt.tab_switches,
            "start_time": attempt.start_time,
            "end_time": attempt.end_time
        })
    
    avg_score = db.query(func.avg(ExamAttempt.score)).filter(
        ExamAttempt.exam_id == exam_id,
        ExamAttempt.is_submitted == True
    ).scalar() or 0
    
    pass_count = db.query(ExamAttempt).filter(
        ExamAttempt.exam_id == exam_id,
        ExamAttempt.is_submitted == True,
        ExamAttempt.passed == True
    ).count()
    
    return {
        "exam_title": exam.title,
        "total_attempts": len(results),
        "average_score": round(avg_score, 2),
        "pass_count": pass_count,
        "fail_count": len(results) - pass_count,
        "results": results
    }

@router.get("/results/student/{student_id}")
async def get_student_results(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    attempts = db.query(ExamAttempt).filter(
        ExamAttempt.user_id == student_id,
        ExamAttempt.is_submitted == True
    ).all()
    
    results = []
    for attempt in attempts:
        exam = db.query(Exam).filter(Exam.id == attempt.exam_id).first()
        results.append({
            "id": attempt.id,
            "exam_id": exam.id,
            "exam_title": exam.title,
            "score": attempt.score,
            "total_marks": attempt.total_marks,
            "percentage": attempt.percentage,
            "passed": attempt.passed,
            "tab_switches": attempt.tab_switches,
            "start_time": attempt.start_time,
            "end_time": attempt.end_time
        })
    
    return {
        "student_name": student.full_name,
        "student_email": student.email,
        "total_attempts": len(results),
        "results": results
    }

@router.get("/results/detail/{attempt_id}", response_model=ResultResponse)
async def get_detailed_result(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    attempt = db.query(ExamAttempt).filter(ExamAttempt.id == attempt_id).first()
    
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
    user = db.query(User).filter(User.id == attempt.user_id).first()
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
        user_name=user.full_name,
        start_time=attempt.start_time,
        end_time=attempt.end_time,
        score=attempt.score,
        total_marks=attempt.total_marks,
        percentage=attempt.percentage,
        passed=attempt.passed,
        tab_switches=attempt.tab_switches,
        questions=questions_with_answers
    )

@router.get("/export/results")
async def export_results(
    exam_id: Optional[int] = Query(None, description="Export results for specific exam"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Export exam results to CSV file
    If exam_id is provided, export results for that exam only
    Otherwise, export all results
    """
    if exam_id:
        # Export results for specific exam
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found"
            )
        
        attempts = db.query(ExamAttempt).filter(
            ExamAttempt.exam_id == exam_id,
            ExamAttempt.is_submitted == True
        ).all()
        
        results_data = []
        for attempt in attempts:
            user = db.query(User).filter(User.id == attempt.user_id).first()
            results_data.append({
                'student_name': user.full_name,
                'student_email': user.email,
                'exam_title': exam.title,
                'score': attempt.score,
                'total_marks': attempt.total_marks,
                'percentage': round(attempt.percentage, 2) if attempt.percentage else 0,
                'passed': attempt.passed,
                'submitted_at': attempt.end_time.strftime('%Y-%m-%d %H:%M:%S') if attempt.end_time else ''
            })
        
        csv_content = csv_service.generate_results_csv(results_data, exam.title)
        filename = f"results_{exam.title.replace(' ', '_')}.csv"
    else:
        # Export all results grouped by exam
        exams = db.query(Exam).all()
        
        results_by_exam = {}
        for exam in exams:
            attempts = db.query(ExamAttempt).filter(
                ExamAttempt.exam_id == exam.id,
                ExamAttempt.is_submitted == True
            ).all()
            
            exam_results = []
            for attempt in attempts:
                user = db.query(User).filter(User.id == attempt.user_id).first()
                exam_results.append({
                    'student_name': user.full_name,
                    'student_email': user.email,
                    'exam_title': exam.title,
                    'score': attempt.score,
                    'total_marks': attempt.total_marks,
                    'percentage': round(attempt.percentage, 2) if attempt.percentage else 0,
                    'passed': attempt.passed,
                    'submitted_at': attempt.end_time.strftime('%Y-%m-%d %H:%M:%S') if attempt.end_time else ''
                })
            
            if exam_results:
                results_by_exam[exam.title] = exam_results
        
        csv_content = csv_service.generate_all_results_csv(results_by_exam)
        filename = "all_results.csv"
    
    from fastapi.responses import StreamingResponse
    
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )