import csv
import io
from typing import List, Dict, Any
from datetime import datetime


class CSVService:
    """Service for handling CSV import/export operations"""
    
    @staticmethod
    def parse_student_csv(content: str) -> List[Dict[str, str]]:
        """
        Parse CSV content for student import
        Expected columns: full_name, email, password
        """
        # Remove BOM if present
        if content.startswith('\ufeff'):
            content = content[1:]
        
        students = []
        
        try:
            reader = csv.DictReader(io.StringIO(content))
            for row in reader:
                students.append({
                    'full_name': row.get('full_name', '').strip(),
                    'email': row.get('email', '').strip().lower(),
                    'password': row.get('password', '').strip()
                })
        except Exception as e:
            raise ValueError(f"Failed to parse CSV: {str(e)}")
        
        return students
    
    @staticmethod
    def parse_questions_csv(content: str) -> List[Dict[str, Any]]:
        """
        Parse CSV content for questions import
        Expected columns: question_text, option_a, option_b, option_c, option_d, correct_answer, marks, explanation
        """
        # Remove BOM if present
        if content.startswith('\ufeff'):
            content = content[1:]
        
        questions = []
        
        # Debug: Log content info
        print(f"CSV Content length: {len(content)} characters")
        print(f"CSV Content preview: {content[:200]}...")
        
        try:
            reader = csv.DictReader(io.StringIO(content))
            
            # Debug: Print fieldnames
            print(f"CSV Fieldnames: {reader.fieldnames}")
            
            for row in reader:
                # Debug: Print each row
                print(f"Row: {row}")
                
                # Check if row has data
                if not row.get('question_text', '').strip():
                    print("Skipping row with empty question_text")
                    continue
                    
                questions.append({
                    'question_text': row.get('question_text', '').strip(),
                    'option_a': row.get('option_a', '').strip(),
                    'option_b': row.get('option_b', '').strip(),
                    'option_c': row.get('option_c', '').strip(),
                    'option_d': row.get('option_d', '').strip(),
                    'correct_answer': row.get('correct_answer', 'A').strip().upper() or 'A',
                    'marks': int(row.get('marks', 1)) if row.get('marks') and row.get('marks').strip() else 1,
                    'explanation': row.get('explanation', '').strip() or None
                })
        except Exception as e:
            print(f"CSV parsing error: {str(e)}")
            raise ValueError(f"Failed to parse CSV: {str(e)}")
        
        print(f"Parsed {len(questions)} questions")
        return questions
    
    @staticmethod
    def generate_questions_csv(questions: List[Dict[str, Any]]) -> str:
        """
        Generate CSV content for questions export
        """
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'marks', 'explanation'])
        
        # Write data
        for q in questions:
            writer.writerow([
                q.get('question_text', ''),
                q.get('option_a', ''),
                q.get('option_b', ''),
                q.get('option_c', ''),
                q.get('option_d', ''),
                q.get('correct_answer', 'A'),
                q.get('marks', 1),
                q.get('explanation', '') or ''
            ])
        
        return output.getvalue()
    
    @staticmethod
    def generate_students_csv(students: List[Dict[str, Any]]) -> str:
        """
        Generate CSV content for student export
        Columns: id, full_name, email, role, is_active, created_at
        """
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['id', 'full_name', 'email', 'role', 'is_active', 'created_at'])
        
        # Write data
        for student in students:
            writer.writerow([
                student.get('id', ''),
                student.get('full_name', ''),
                student.get('email', ''),
                student.get('role', 'student'),
                'True' if student.get('is_active', True) else 'False',
                student.get('created_at', '')
            ])
        
        return output.getvalue()
    
    @staticmethod
    def generate_results_csv(results: List[Dict[str, Any]], exam_title: str = None) -> str:
        """
        Generate CSV content for exam results export
        Columns: student_name, student_email, exam_title, score, total_marks, percentage, passed, submitted_at
        """
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['student_name', 'student_email', 'exam_title', 'score', 'total_marks', 'percentage', 'passed', 'submitted_at'])
        
        # Write data
        for result in results:
            writer.writerow([
                result.get('student_name', ''),
                result.get('student_email', ''),
                result.get('exam_title', exam_title or ''),
                result.get('score', ''),
                result.get('total_marks', ''),
                result.get('percentage', ''),
                'Yes' if result.get('passed', False) else 'No',
                result.get('submitted_at', '')
            ])
        
        return output.getvalue()
    
    @staticmethod
    def generate_all_results_csv(results_by_exam: Dict[str, List[Dict[str, Any]]]) -> str:
        """
        Generate CSV content for all exam results grouped by exam
        """
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['exam_title', 'student_name', 'student_email', 'score', 'total_marks', 'percentage', 'passed', 'submitted_at'])
        
        # Write data grouped by exam
        for exam_title, results in results_by_exam.items():
            for result in results:
                writer.writerow([
                    exam_title,
                    result.get('student_name', ''),
                    result.get('student_email', ''),
                    result.get('score', ''),
                    result.get('total_marks', ''),
                    result.get('percentage', ''),
                    'Yes' if result.get('passed', False) else 'No',
                    result.get('submitted_at', '')
                ])
        
        return output.getvalue()


csv_service = CSVService()
