import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { studentAPI } from '../../services/api'
import ExamCard from '../../components/student/ExamCard'
import Loader from '../../components/common/Loader'
import { handleError } from '../../utils/helpers'

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Only fetch when auth is ready and user exists
    if (!authLoading && user) {
      fetchExams()
    }
  }, [authLoading, user])

  const fetchExams = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await studentAPI.getAvailableExams()
      setExams(response.data)
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  // Wait for auth to load
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading exams..." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600">Here are your available exams</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {exams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Available</h3>
          <p className="text-gray-600">There are currently no published exams. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentDashboard