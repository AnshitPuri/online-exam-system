from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.core.security import get_password_hash
from app.services.csv_service import csv_service

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    users = db.query(User).all()
    return [UserResponse.model_validate(user) for user in users]

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse.model_validate(user)

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user_update.email:
        existing = db.query(User).filter(
            User.email == user_update.email,
            User.id != user_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
    
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return UserResponse.model_validate(user)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    
    return None

@router.post("/import-csv")
async def import_students_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Import students from CSV file
    Expected CSV format: full_name, email, password
    """
    content = await file.read()
    content_str = content.decode('utf-8')
    
    try:
        students_data = csv_service.parse_student_csv(content_str)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid CSV format: {str(e)}"
        )
    
    imported_count = 0
    errors = []
    
    for idx, student in enumerate(students_data):
        # Validate required fields
        if not student['full_name'] or not student['email'] or not student['password']:
            errors.append(f"Row {idx + 1}: Missing required fields (full_name, email, password)")
            continue
        
        # Check if email already exists
        existing = db.query(User).filter(User.email == student['email']).first()
        if existing:
            errors.append(f"Row {idx + 1}: Email '{student['email']}' already exists")
            continue
        
        # Create new user
        new_user = User(
            email=student['email'],
            full_name=student['full_name'],
            hashed_password=get_password_hash(student['password']),
            role='student'
        )
        
        db.add(new_user)
        imported_count += 1
    
    db.commit()
    
    return {
        "message": "CSV import completed",
        "imported": imported_count,
        "errors": errors if errors else None
    }

@router.get("/export-csv")
async def export_students_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Export all students to CSV file
    """
    users = db.query(User).filter(User.role == 'student').all()
    
    students_data = []
    for user in users:
        students_data.append({
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active,
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S') if user.created_at else ''
        })
    
    csv_content = csv_service.generate_students_csv(students_data)
    
    from fastapi.responses import StreamingResponse
    
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"}
    )