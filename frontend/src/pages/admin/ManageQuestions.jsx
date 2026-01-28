import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { adminAPI } from '../../services/api'
import QuestionForm from '../../components/admin/QuestionForm'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import { ConfirmModal } from '../../components/common/Modal'
import { handleError } from '../../utils/helpers'
import { MESSAGES, QUESTION_OPTIONS } from '../../utils/constants'

const ManageQuestions = () => {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ show: false, questionId: null })

  useEffect(() => {
    fetchQuestions()
  }, [examId])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminAPI.getExamQuestions(examId)
      setExam(response.data.exam)
      setQuestions(response.data.questions)
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async (formData) => {
    try {
      setAddingQuestion(true)
      const response = await adminAPI.addQuestion(examId, formData)
      setQuestions([...questions, response.data])
      alert(MESSAGES.QUESTION_ADD_SUCCESS)
    } catch (err) {
      alert(handleError(err))
    } finally {
      setAddingQuestion(false)
    }
  }

  const handleDeleteQuestion = async () => {
    try {
      await adminAPI.deleteQuestion(deleteModal.questionId)
      setQuestions(questions.filter(q => q.id !== deleteModal.questionId))
      setDeleteModal({ show: false, questionId: null })
      alert(MESSAGES.QUESTION_DELETE_SUCCESS)
    } catch (err) {
      alert(handleError(err))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading questions..." />
      </div>
    )
  }

  if (error || !exam) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-12">
            <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Questions</h3>
            <p className="text-gray-600 mb-6">{error || 'Unable to load questions'}</p>
            <Button onClick={() => navigate('/admin/manage-exams')}>Back to Exams</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/manage-exams')}
          className="mb-4"
        >
          ← Back to Exams
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Questions</h1>
        <p className="text-gray-600">{exam.title}</p>
        <p className="text-sm text-gray-500 mt-1">
          Total Questions: {questions.length} • Total Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
        </p>
      </div>

      <Card className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Question</h2>
        <QuestionForm
          onSubmit={handleAddQuestion}
          loading={addingQuestion}
        />
      </Card>

      {questions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Yet</h3>
            <p className="text-gray-600">Add questions to this exam using the form above</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        Question {index + 1}
                      </span>
                      <span className="text-sm text-gray-600">{question.marks} marks</span>
                    </div>
                    <p className="text-lg text-gray-900 mb-4">{question.question_text}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                    onClick={() => setDeleteModal({ show: true, questionId: question.id })}
                  >
                    Delete
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {QUESTION_OPTIONS.map((option) => {
                    const optionText = question[`option_${option.toLowerCase()}`]
                    const isCorrect = question.correct_answer === option
                    
                    return (
                      <div
                        key={option}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">{option}.</span>
                          <span className="flex-1">{optionText}</span>
                          {isCorrect && (
                            <CheckCircle size={18} className="text-green-600" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {question.explanation && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-800">{question.explanation}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, questionId: null })}
        onConfirm={handleDeleteQuestion}
        title="Delete Question"
        message={MESSAGES.CONFIRM_DELETE_QUESTION}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default ManageQuestions