import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BookOpen, FileText, TrendingUp, Plus } from 'lucide-react'
import { adminAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { handleError, formatDateTime } from '../../utils/helpers'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getDashboardStats()
      setStats(response.data.stats)
      setRecentResults(response.data.recent_results || [])
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Students',
      value: stats?.total_students || 0,
      color: 'blue',
      link: '/admin/manage-students'
    },
    {
      icon: BookOpen,
      label: 'Total Exams',
      value: stats?.total_exams || 0,
      color: 'green',
      link: '/admin/manage-exams'
    },
    {
      icon: FileText,
      label: 'Total Attempts',
      value: stats?.total_attempts || 0,
      color: 'purple',
      link: '/admin/view-results'
    },
    {
      icon: TrendingUp,
      label: 'Avg. Pass Rate',
      value: `${stats?.average_pass_rate || 0}%`,
      color: 'yellow',
      link: '/admin/view-results'
    }
  ]

  const colorClasses = {
    blue: 'from-blue-500 to-blue-700',
    green: 'from-green-500 to-green-700',
    purple: 'from-purple-500 to-purple-700',
    yellow: 'from-yellow-500 to-yellow-700'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your examination system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              onClick={() => navigate(stat.link)}
              className={`bg-gradient-to-br ${colorClasses[stat.color]} text-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={32} className="opacity-80" />
                <div className="text-right">
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              icon={Plus}
              onClick={() => navigate('/admin/create-exam')}
            >
              Create New Exam
            </Button>
            <Button
              variant="outline"
              fullWidth
              icon={BookOpen}
              onClick={() => navigate('/admin/manage-exams')}
            >
              Manage Exams
            </Button>
            <Button
              variant="outline"
              fullWidth
              icon={FileText}
              onClick={() => navigate('/admin/view-results')}
            >
              View All Results
            </Button>
            <Button
              variant="outline"
              fullWidth
              icon={Users}
              onClick={() => navigate('/admin/manage-students')}
            >
              Manage Students
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Published Exams</span>
              <span className="text-2xl font-bold text-primary-600">{stats?.published_exams || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Unpublished Exams</span>
              <span className="text-2xl font-bold text-gray-600">{stats?.unpublished_exams || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Active Students</span>
              <span className="text-2xl font-bold text-green-600">{stats?.active_students || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Exam Submissions</h2>
        {recentResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-2 text-gray-400" />
            <p>No recent submissions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentResults.map((result) => {
                  const percentage = result.percentage || 0
                  const isPassed = result.passed
                  
                  return (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{result.student_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{result.exam_title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(result.submitted_at)}</td>
                      <td className="px-4 py-3 text-sm center font-medium">
                        {result.score}/{result.total_marks} ({percentage}%)
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isPassed ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default AdminDashboard