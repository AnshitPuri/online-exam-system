import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Award, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import { studentAPI } from '../../services/api'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import { handleError } from '../../utils/helpers'

const ExamInstructions = () => {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [starting, setStarting] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    fetchExamDetails()
  }, [examId])

  const fetchExamDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching exam details for examId:', examId)
      const response = await studentAPI.getExamDetails(examId)
      console.log('Exam response:', response.data)
      // Backend returns exam object directly, not wrapped in {exam: ...}
      setExam(response.data)
    } catch (err) {
      console.error('Error fetching exam:', err)
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleStartExam = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions')
      return
    }

    setStarting(true)
    console.log('Starting exam for examId:', examId)
    try {
      console.log('Calling startExam API...')
      const response = await studentAPI.startExam(examId)
      console.log('Start exam response:', response.data)
      if (response.data) {
        console.log('Navigating to exam interface...')
        navigate(`/student/exam/${examId}/start`)
      }
    } catch (err) {
      console.error('Start exam error:', err)
      alert(handleError(err))
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading exam details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-12">
            <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Exam</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/student')}>Back to Dashboard</Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!exam) return null

  const defaultInstructions = [
    'Read each question carefully before selecting an answer',
    'You can navigate between questions using the question numbers',
    'Your answers are automatically saved',
    'Tab switching is monitored and limited',
    'The exam will auto-submit when time runs out',
    'Once submitted, you cannot change your answers'
  ]

  const instructions = exam.instructions ? exam.instructions.split('\n').filter(i => i.trim()) : defaultInstructions

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <div className="space-y-6">
          <div className="text-center pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-bold text-gray-900">{exam.duration_minutes} mins</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-xl font-bold text-gray-900">{exam.total_marks}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Passing Marks</p>
                <p className="text-xl font-bold text-gray-900">{exam.passing_marks}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <ul className="space-y-3">
              {instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 mb-1">Important Notice</p>
                <p className="text-sm text-yellow-800">
                  Excessive tab switching will result in automatic submission of your exam. Please ensure you have a stable internet connection.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer">
              I have read and understood all the instructions and agree to follow the exam rules
            </label>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button variant="ghost" onClick={() => navigate('/student')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStartExam}
              loading={starting}
              disabled={!agreed}
            >
              Start Exam
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ExamInstructions