export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Online Examination System'

export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'user_data'

export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student'
}

export const EXAM_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished'
}

export const RESULT_STATUS = {
  PASS: 'pass',
  FAIL: 'fail'
}

export const QUESTION_OPTIONS = ['A', 'B', 'C', 'D']

export const MAX_TAB_SWITCHES = 3

export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGIN_ERROR: 'Invalid credentials',
  REGISTER_SUCCESS: 'Registration successful! Please login.',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  EXAM_SUBMIT_SUCCESS: 'Exam submitted successfully!',
  EXAM_SUBMIT_ERROR: 'Failed to submit exam. Please try again.',
  EXAM_START_ERROR: 'Failed to start exam. Please try again.',
  ANSWER_SAVE_SUCCESS: 'Answer saved',
  ANSWER_SAVE_ERROR: 'Failed to save answer',
  EXAM_CREATE_SUCCESS: 'Exam created successfully!',
  EXAM_CREATE_ERROR: 'Failed to create exam',
  EXAM_UPDATE_SUCCESS: 'Exam updated successfully!',
  EXAM_DELETE_SUCCESS: 'Exam deleted successfully!',
  QUESTION_ADD_SUCCESS: 'Question added successfully!',
  QUESTION_DELETE_SUCCESS: 'Question deleted successfully!',
  STUDENT_DELETE_SUCCESS: 'Student deleted successfully!',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  TAB_SWITCH_WARNING: 'Warning: Tab switching detected!',
  TAB_SWITCH_LIMIT: 'You have exceeded the tab switch limit. Exam will be auto-submitted.',
  TIME_UP: 'Time is up! Exam submitted automatically.',
  CONFIRM_SUBMIT: 'Are you sure you want to submit the exam? You cannot change answers after submission.',
  CONFIRM_DELETE_EXAM: 'Are you sure you want to delete this exam? This action cannot be undone.',
  CONFIRM_DELETE_QUESTION: 'Are you sure you want to delete this question?',
  CONFIRM_DELETE_STUDENT: 'Are you sure you want to delete this student?'
}

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 3,
  EXAM_TITLE_MIN_LENGTH: 5,
  QUESTION_TEXT_MIN_LENGTH: 10
}