"""
Script to fix null attempt IDs in the database
Run this after restarting the backend server
"""
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_db, engine
from app.models.exam_attempt import ExamAttempt
from sqlalchemy import text

def fix_attempt_ids():
    db = next(get_db())
    try:
        # Check for attempts with null ids
        result = db.execute(text("SELECT id, user_id, exam_id FROM exam_attempts WHERE id IS NULL"))
        null_attempts = result.fetchall()
        
        if null_attempts:
            print(f"Found {len(null_attempts)} attempts with NULL ids:")
            for row in null_attempts:
                print(f"  - user_id: {row.user_id}, exam_id: {row.exam_id}")
            
            # Update null ids to new sequential ids
            # First, get the max id
            max_id_result = db.execute(text("SELECT COALESCE(MAX(id), 0) FROM exam_attempts"))
            max_id = max_id_result.scalar()
            
            print(f"Current max id: {max_id}")
            
            # Update each null id to a new unique value
            for i, row in enumerate(null_attempts, start=1):
                new_id = max_id + i
                db.execute(
                    text("UPDATE exam_attempts SET id = :new_id WHERE user_id = :user_id AND exam_id = :exam_id AND id IS NULL"),
                    {"new_id": new_id, "user_id": row.user_id, "exam_id": row.exam_id}
                )
                print(f"  Updated attempt to id: {new_id}")
            
            db.commit()
            print("Successfully fixed null attempt ids!")
        else:
            print("No attempts with NULL ids found.")
        
        # Verify the fix
        result = db.execute(text("SELECT COUNT(*) FROM exam_attempts WHERE id IS NULL"))
        null_count = result.scalar()
        print(f"Remaining null ids: {null_count}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_attempt_ids()
