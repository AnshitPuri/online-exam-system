import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Award, CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react'
import { studentAPI } from '../../services/api'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import { calculatePercentage, handleError } from '../../utils/helpers'

const ExamResult = () => {
  const { examId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const attemptId = searchParams.get('attemptId')

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (attemptId) {
      fetchResult()
    }
  }, [attemptId])

  const fetchResult = async () => {
    try {
      setLoading(true)
      const response = await studentAPI.getResult(attemptId)
      setResult(response.data)
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading result..." />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-12">
            <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Result</h3>
            <p className="text-gray-600 mb-6">{error || 'Unable to load result'}</p>
            <Button onClick={() => navigate('/student')}>Back to Dashboard</Button>
          </div>
        </Card>
      </div>
    )
  }

  const percentage = calculatePercentage(result.marks_obtained, result.exam.total_marks)
  const passingPercentage = (result.exam.passing_marks / result.exam.total_marks) * 100
  const isPassed = percentage >= passingPercentage

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className={`mb-6 ${isPassed ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
        <div className="text-center py-8">
          {isPassed ? (
            <Trophy size={80} className="mx-auto text-green-500 mb-4" />
          ) : (
            <XCircle size={80} className="mx-auto text-red-500 mb-4" />
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isPassed ? 'Congratulations!' : 'Better Luck Next Time'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">{result.exam.title}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-blue-50 rounded-xl">
              <Award size={32} className="mx-auto text-blue-600 mb-2" />
              <p className="text-3xl font-bold text-blue-600 mb-1">{result.marks_obtained}</p>
              <p className="text-sm text-gray-600">Marks Obtained</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl">
              <AlertTriangle size={32} className="mx-auto text-purple-600 mb-2" />
              <p className="text-3xl font-bold text-purple-600 mb-1">{result.exam.total_marks}</p>
              <p className="text-sm text-gray-600">Total Marks</p>
            </div>

            <div className={`p-6 rounded-xl ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
              {isPassed ? (
                <CheckCircle size={32} className="mx-auto text-green-600 mb-2" />
              ) : (
                <XCircle size={32} className="mx-auto text-red-600 mb-2" />
              )}
              <p className={`text-3xl font-bold mb-1 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {percentage}%
              </p>
              <p className="text-sm text-gray-600">Percentage</p>
            </div>

            <div className="p-6 bg-yellow-50 rounded-xl">
              <AlertTriangle size={32} className="mx-auto text-yellow-600 mb-2" />
              <p className="text-3xl font-bold text-yellow-600 mb-1">{result.tab_switches}</p>
              <p className="text-sm text-gray-600">Tab Switches</p>
            </div>
          </div>

          <div className={`inline-block mt-8 px-6 py-3 rounded-full text-lg font-semibold ${
            isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPassed ? '✓ PASSED' : '✗ FAILED'}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Question-wise Analysis</h2>
        <div className="space-y-4">
          {result.answers.map((answer, index) => {
            const isCorrect = answer.selected_option === answer.question.correct_answer
            
            return (
              <div
                key={answer.id}
                className={`p-6 rounded-lg border-2 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">
                      {answer.question.question_text}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      <XCircle size={24} className="text-red-600" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? `+${answer.question.marks}` : '0'}/{answer.question.marks}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 ml-11">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = answer.question[`option_${option.toLowerCase()}`]
                    const isSelected = answer.selected_option === option
                    const isCorrectOption = answer.question.correct_answer === option
                    
                    return (
                      <div
                        key={option}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrectOption
                            ? 'border-green-500 bg-green-100'
                            : isSelected
                            ? 'border-red-500 bg-red-100'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-700">{option}.</span>
                          <span className="flex-1">{optionText}</span>
                          {isCorrectOption && (
                            <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded">
                              CORRECT
                            </span>
                          )}
                          {isSelected && !isCorrectOption && (
                            <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-1 rounded">
                              YOUR ANSWER
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {answer.question.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-800">{answer.question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="mt-6 flex justify-center">
        <Button onClick={() => navigate('/student')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default ExamResult