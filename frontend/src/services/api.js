
import axios from 'axios'
import { API_BASE_URL, TOKEN_KEY } from '../utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
}

// Student APIs
export const studentAPI = {
  getAvailableExams: () => api.get('/student/exams'),
  getExamDetails: (examId) => api.get(`/student/exams/${examId}`),
  startExam: (examId) => api.post(`/student/exams/${examId}/start`),
  saveAnswer: (attemptId, data) => api.post(`/student/attempts/${attemptId}/answer`, data),
  submitExam: (attemptId, data) => api.post(`/student/attempts/${attemptId}/submit`, data),
  getResult: (attemptId) => api.get(`/student/attempts/${attemptId}/result`),
  getMyResults: () => api.get('/student/results'),
  recordTabSwitch: (attemptId) => api.post(`/student/attempts/${attemptId}/tab-switch`)
}

// Admin APIs
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Exams
  getAllExams: () => api.get('/admin/exams'),
  createExam: (data) => api.post('/admin/exams', data),
  updateExam: (examId, data) => api.put(`/admin/exams/${examId}`, data),
  deleteExam: (examId) => api.delete(`/admin/exams/${examId}`),
  toggleExamStatus: (examId) => api.patch(`/admin/exams/${examId}/toggle-status`),
  
  // Questions
  getExamQuestions: (examId) => api.get(`/admin/exams/${examId}/questions`),
  addQuestion: (examId, data) => api.post(`/admin/exams/${examId}/questions`, data),
  updateQuestion: (questionId, data) => api.put(`/admin/questions/${questionId}`, data),
  deleteQuestion: (questionId) => api.delete(`/admin/questions/${questionId}`),
  
  // Students
  getAllStudents: () => api.get('/admin/students'),
  toggleStudentStatus: (studentId) => api.patch(`/admin/students/${studentId}/toggle-status`),
  deleteStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
  
  // Results
  getAllResults: (params) => api.get('/admin/results', { params }),
  getResultDetails: (attemptId) => api.get(`/admin/results/${attemptId}`)
}

export default api