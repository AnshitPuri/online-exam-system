import { Eye, Award, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { formatDateTime, calculatePercentage, getStatusColor } from '../../utils/helpers'

const ResultsTable = ({ results }) => {
  const navigate = useNavigate()

  const handleViewDetails = (result) => {
    navigate(`/student/exam/${result.exam_id}/result?attemptId=${result.id}`)
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No results found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exam
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted At
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Percentage
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tab Switches
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result) => {
            const percentage = calculatePercentage(result.marks_obtained, result.exam.total_marks)
            const passingPercentage = (result.exam.passing_marks / result.exam.total_marks) * 100
            const status = percentage >= passingPercentage ? 'pass' : 'fail'
            
            return (
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {result.student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{result.student.name}</div>
                      <div className="text-sm text-gray-500">{result.student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{result.exam.title}</div>
                  <div className="text-sm text-gray-500">Duration: {result.exam.duration} mins</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(result.submitted_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Award size={16} className="text-primary-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {result.marks_obtained}/{result.exam.total_marks}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`text-sm font-medium ${
                    result.tab_switches > 2 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {result.tab_switches}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
                    {status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(result)}
                    icon={Eye}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ResultsTable