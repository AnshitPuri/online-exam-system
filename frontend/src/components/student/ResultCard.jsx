import { Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../common/Card'
import Button from '../common/Button'
import { formatDateTime } from '../../utils/helpers'

const ResultCard = ({ result }) => {
  const navigate = useNavigate()
  
  const percentage = result.percentage || 0
  const isPassed = result.passed
  const tabSwitches = result.tab_switches || 0

  const handleViewDetails = () => {
    navigate(`/student/results/${result.id}`)
  }

  return (
    <Card hover>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{result.exam_title}</h3>
            <p className="text-sm text-gray-500">{formatDateTime(result.end_time)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPassed 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isPassed ? 'Passed' : 'Failed'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Award size={20} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{result.score}</p>
            <p className="text-xs text-gray-600">Marks Obtained</p>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <AlertCircle size={20} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{result.total_marks}</p>
            <p className="text-xs text-gray-600">Total Marks</p>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              {isPassed ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <XCircle size={20} className="text-red-600" />
              )}
            </div>
            <p className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {percentage}%
            </p>
            <p className="text-xs text-gray-600">Percentage</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${tabSwitches > 2 ? 'text-red-600' : 'text-gray-600'}`}>
              Tab Switches: {tabSwitches}
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleViewDetails}
          >
            View Detailed Result
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ResultCard