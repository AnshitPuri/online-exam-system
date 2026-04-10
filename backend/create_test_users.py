"""
Script to create test users for the online exam system
"""
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import all models first to avoid circular import issues
from app.models import user, exam_attempt, exam, question, answer

from app.core.database import get_db, engine, Base
from app.models.user import User, UserRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_users():
    db = next(get_db())

    try:
        # Check if users already exist
        existing_admin = db.query(User).filter(User.email == "admin@example.com").first()
        existing_student = db.query(User).filter(User.email == "student@example.com").first()

        if existing_admin:
            print("Admin user already exists")
        else:
            # Create admin user
            admin_user = User(
                email="admin@example.com",
                full_name="Admin User",
                hashed_password=pwd_context.hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin_user)
            print("Created admin user: admin@example.com / admin123")

        if existing_student:
            print("Student user already exists")
        else:
            # Create student user
            student_user = User(
                email="student@example.com",
                full_name="Student User",
                hashed_password=pwd_context.hash("student123"),
                role=UserRole.STUDENT,
                is_active=True
            )
            db.add(student_user)
            print("Created student user: student@example.com / student123")

        db.commit()
        print("Test users created successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error creating users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()