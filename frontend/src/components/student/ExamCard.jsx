import { Clock, BookOpen, Award, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../common/Card'
import Button from '../common/Button'

const ExamCard = ({ exam }) => {
  const navigate = useNavigate()

  const handleStartExam = () => {
    navigate(`/student/exam/${exam.id}/instructions`)
  }

  const handleViewResult = () => {
    if (exam.attempt_id) {
      navigate(`/student/exam/${exam.id}/result?attemptId=${exam.attempt_id}`)
    }
  }

  const isAttempted = exam.is_attempted

  return (
    <Card hover className="border-l-4 border-l-primary-600">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{exam.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-medium text-gray-900">{exam.duration} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Marks</p>
              <p className="font-medium text-gray-900">{exam.total_marks}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Passing Marks</p>
              <p className="font-medium text-gray-900">{exam.passing_marks}</p>
            </div>
          </div>
        </div>

        {isAttempted ? (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Exam Completed</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewResult}
              icon={ChevronRight}
            >
              View Result
            </Button>
          </div>
        ) : (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleStartExam}
            icon={ChevronRight}
          >
            Start Exam
          </Button>
        )}
      </div>
    </Card>
  )
}

export default ExamCard