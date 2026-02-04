import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { BookOpen, FileText, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { studentAPI } from '../../services/api'
import ExamCard from '../../components/student/ExamCard'
import Loader from '../../components/common/Loader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
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
      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name}! 👋
        </h1>
        <p className="text-gray-600">Here are your available exams and recent activity</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-50 rounded-xl">
              <BookOpen size={24} className="text-sky-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{exams.length}</p>
              <p className="text-sm text-gray-500">Available Exams</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Completed Exams</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Clock size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">0%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Exams Section */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <BookOpen size={22} className="text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Available Exams</h2>
              <p className="text-sm text-gray-500">Start your examinations</p>
            </div>
          </div>
        </div>

        {exams.length === 0 ? (
          <Card className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full inline-flex mb-4">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are currently no published exams. Check back later or contact your administrator.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam, index) => (
              <div key={exam.id} className="animate-fade-in-up" style={{ animationDelay: `${500 + index * 100}ms` }}>
                <ExamCard exam={exam} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <Card className="bg-gradient-to-r from-sky-500 to-sky-600 text-white border-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <BookOpen size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Ready to start an exam?</h3>
                <p className="text-white/80">Make sure you have a stable internet connection and enough time to complete.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-white/80" />
              <span className="text-white/90">Estimated time varies by exam</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StudentDashboard
