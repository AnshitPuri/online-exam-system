import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './utils/ProtectedRoute'
import Loader from './components/common/Loader'
import './index.css'
// Auth Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// Student Pages
import StudentLayout from './layouts/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import ExamInstructions from './pages/student/ExamInstructions'
import ExamInterface from './pages/student/ExamInterface'
import ExamResult from './pages/student/ExamResult'
import MyResults from './pages/student/MyResults'

// Admin Pages
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateExam from './pages/admin/CreateExam'
import ManageExams from './pages/admin/ManageExams'
import ManageQuestions from './pages/admin/ManageQuestions'
import ViewResults from './pages/admin/ViewResults'
import ManageStudents from './pages/admin/ManageStudents'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <Register />} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="exam/:examId/instructions" element={<ExamInstructions />} />
        <Route path="exam/:examId/start" element={<ExamInterface />} />
        <Route path="exam/:examId/result" element={<ExamResult />} />
        <Route path="results" element={<MyResults />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="manage-exams" element={<ManageExams />} />
        <Route path="manage-questions/:examId" element={<ManageQuestions />} />
        <Route path="view-results" element={<ViewResults />} />
        <Route path="manage-students" element={<ManageStudents />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App