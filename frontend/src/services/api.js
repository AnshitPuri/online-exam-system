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
    console.log('=== API REQUEST ===')
    console.log('URL:', config.url)
    console.log('TOKEN_KEY:', TOKEN_KEY)
    console.log('Token from storage:', token ? 'EXISTS' : 'NULL')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Authorization header set')
    } else {
      console.error('NO TOKEN FOUND!')
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
    console.log('=== API ERROR ===')
    console.log('Status:', error.response?.status)
    console.log('URL:', error.config?.url)
    console.log('Error data:', error.response?.data)
    
    if (error.response?.status === 401) {
      console.log('401 ERROR - Clearing storage and redirecting')
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('user_data')
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me')
}

// Student APIs
export const studentAPI = {
  getAvailableExams: () => api.get('/exams'),
  getExamDetails: (examId) => api.get(`/exams/${examId}`),
  startExam: (examId) => api.post('/attempts/start', { exam_id: examId }),
  saveAnswer: (attemptId, data) => api.post(`/attempts/${attemptId}/answer`, data),
  submitExam: (attemptId) => api.post(`/attempts/${attemptId}/submit`, {}),
  getResult: (attemptId) => api.get(`/attempts/results/${attemptId}`),
  getMyResults: () => api.get('/attempts/results'),
  recordTabSwitch: (attemptId) => api.post(`/attempts/${attemptId}/tab-switch`, {})
}

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllExams: () => api.get('/exams'),
  createExam: (data) => api.post('/exams', data),
  updateExam: (examId, data) => api.patch(`/exams/${examId}`, data),
  deleteExam: (examId) => api.delete(`/exams/${examId}`),
  publishExam: (examId) => api.post(`/exams/${examId}/publish`),
  unpublishExam: (examId) => api.post(`/exams/${examId}/unpublish`),
  getExamQuestions: (examId) => api.get(`/questions/exam/${examId}`),
  addQuestion: (data) => api.post('/questions', data),
  updateQuestion: (questionId, data) => api.patch(`/questions/${questionId}`, data),
  deleteQuestion: (questionId) => api.delete(`/questions/${questionId}`),
  getAllStudents: () => api.get('/users'),
  deleteStudent: (studentId) => api.delete(`/users/${studentId}`),
  updateStudent: (studentId, data) => api.patch(`/users/${studentId}`, data),
  getAllResults: () => api.get('/admin/results/all'),
  getExamResults: (examId) => api.get(`/admin/results/exam/${examId}`),
  getStudentResults: (studentId) => api.get(`/admin/results/student/${studentId}`),
  getResultDetails: (attemptId) => api.get(`/admin/results/detail/${attemptId}`)
}

export default api