import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Award
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { adminAPI } from '../../services/api'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { handleError, formatDateTime, formatRelativeTime } from '../../utils/helpers'

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6']

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentResults, setRecentResults] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [dashResponse, analyticsResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAnalytics()
      ])
      setStats(dashResponse.data.stats)
      setRecentResults(dashResponse.data.recent_results || [])
      setAnalytics(analyticsResponse.data)
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
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
      trend: '+12%',
      trendUp: true,
      color: 'blue',
      bgLight: 'bg-blue-50',
      bgGradient: 'from-blue-500 to-blue-600',
      link: '/admin/manage-students'
    },
    {
      icon: BookOpen,
      label: 'Total Exams',
      value: stats?.total_exams || 0,
      trend: '+5%',
      trendUp: true,
      color: 'green',
      bgLight: 'bg-green-50',
      bgGradient: 'from-green-500 to-green-600',
      link: '/admin/manage-exams'
    },
    {
      icon: FileText,
      label: 'Total Attempts',
      value: stats?.total_attempts || 0,
      trend: '+23%',
      trendUp: true,
      color: 'purple',
      bgLight: 'bg-purple-50',
      bgGradient: 'from-purple-500 to-purple-600',
      link: '/admin/view-results'
    },
    {
      icon: TrendingUp,
      label: 'Pass Rate',
      value: `${stats?.average_pass_rate || 0}%`,
      trend: '+8%',
      trendUp: true,
      color: 'sky',
      bgLight: 'bg-sky-50',
      bgGradient: 'from-sky-500 to-sky-600',
      link: '/admin/view-results'
    }
  ]

  const quickActions = [
    {
      icon: Plus,
      label: 'Create New Exam',
      description: 'Set up a new examination',
      color: 'primary',
      link: '/admin/create-exam'
    },
    {
      icon: BookOpen,
      label: 'Manage Exams',
      description: 'Edit or delete existing exams',
      color: 'secondary',
      link: '/admin/manage-exams'
    },
    {
      icon: BarChart3,
      label: 'View Results',
      description: 'Analyze exam performance',
      color: 'secondary',
      link: '/admin/view-results'
    },
    {
      icon: Users,
      label: 'Manage Students',
      description: 'View and manage students',
      color: 'secondary',
      link: '/admin/manage-students'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your examination system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              onClick={() => navigate(stat.link)}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-300 animate-fade-in-up card-animate"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className={`text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp size={14} className={!stat.trendUp ? 'rotate-180' : ''} />
                  {stat.trend}
                </div>
              </div>
              <div className="mb-1">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <span className="text-sm text-gray-500">Common tasks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    onClick={() => navigate(action.link)}
                    className={`group flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-sky-200 hover:shadow-md transition-all duration-300 text-left`}
                  >
                    <div className={`p-3 rounded-xl ${
                      action.color === 'primary' 
                        ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 group-hover:border-sky-200'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
                        {action.label}
                      </p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight size={18} className="text-gray-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* System Overview */}
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card className="h-full bg-gradient-to-br from-sky-500 to-sky-600 text-white border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 size={24} />
              </div>
              <h2 className="text-xl font-bold">System Overview</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-300" />
                  <span className="text-white/90">Published Exams</span>
                </div>
                <span className="text-2xl font-bold">{stats?.published_exams || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-yellow-300" />
                  <span className="text-white/90">Unpublished</span>
                </div>
                <span className="text-2xl font-bold">{stats?.unpublished_exams || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-blue-300" />
                  <span className="text-white/90">Active Students</span>
                </div>
                <span className="text-2xl font-bold">{stats?.active_students || 0}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Last updated</span>
                <span className="text-white/90">Just now</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Analytics Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attempts Over Time */}
          <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp size={22} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Attempts (Last 7 Days)</h2>
                  <p className="text-sm text-gray-500">Daily exam submissions</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.last_7_days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="attempts" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Attempts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Score Distribution */}
          <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 size={22} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Score Distribution</h2>
                  <p className="text-sm text-gray-500">Student performance range</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.score_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="range"
                    >
                      {analytics.score_distribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Top Students */}
          <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award size={22} className="text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
                  <p className="text-sm text-gray-500">Highest average scores</p>
                </div>
              </div>
              {analytics.top_students.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No data available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.top_students.map((student, index) => (
                    <div 
                      key={student.student_id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{student.student_name}</p>
                          <p className="text-xs text-gray-500">{student.total_attempts} attempts</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">{student.average_score}%</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Exam Performance */}
          <div className="animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen size={22} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Exam Performance</h2>
                  <p className="text-sm text-gray-500">Pass rate by exam</p>
                </div>
              </div>
              {analytics.exam_performance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No exam data available yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.exam_performance.slice(0, 5).map((exam) => (
                    <div key={exam.exam_id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 truncate flex-1 mr-2">{exam.exam_title}</p>
                        <span className="text-sm font-semibold text-gray-700">{exam.pass_rate}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${exam.pass_rate}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{exam.total_attempts} attempts</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <FileText size={22} className="text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Submissions</h2>
                <p className="text-sm text-gray-500">Latest exam attempts</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/view-results')}
            >
              View All
            </Button>
          </div>

          {recentResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full inline-flex mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No recent submissions yet</p>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/admin/create-exam')}
              >
                Create Your First Exam
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exam</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentResults.map((result, index) => {
                    const percentage = result.percentage || 0
                    const isPassed = result.passed
                    
                    return (
                      <tr 
                        key={result.id} 
                        className="hover:bg-sky-50/50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${700 + index * 50}ms` }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-sm font-medium">
                              {result.student_name?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{result.student_name}</p>
                              <p className="text-xs text-gray-500">{result.student_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">{result.exam_title}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} />
                            <span>{formatDateTime(result.submitted_at)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <div className={`w-16 h-2 rounded-full bg-gray-200 overflow-hidden`}>
                              <div 
                                className={`h-full rounded-full ${percentage >= 60 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {result.score}/{result.total_marks}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                            isPassed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {isPassed ? (
                              <>
                                <CheckCircle size={12} />
                                Pass
                              </>
                            ) : (
                              <>
                                <Clock size={12} />
                                Fail
                              </>
                            )}
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
    </div>
  )
}

export default AdminDashboard
