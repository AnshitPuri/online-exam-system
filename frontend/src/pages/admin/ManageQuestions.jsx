import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2, AlertCircle, CheckCircle, Upload, Download, FileText, Plus } from 'lucide-react'
import { adminAPI, bulkAPI } from '../../services/api'
import QuestionFormSimple from '../../components/admin/QuestionFormSimple'
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
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchQuestions()
  }, [examId])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminAPI.getExamQuestions(examId)
      setQuestions(response.data)
      // Set a basic exam object with just the ID for navigation
      setExam({ id: parseInt(examId), title: 'Exam' })
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async (questionData) => {
    try {
      setAddingQuestion(true)
      // Add exam_id to each question
      const questionWithExamId = { ...questionData, exam_id: parseInt(examId) }
      const response = await adminAPI.addQuestion(questionWithExamId)
      setQuestions([...questions, response.data])
      alert(MESSAGES.QUESTION_ADD_SUCCESS)
    } catch (err) {
      alert(handleError(err))
    } finally {
      setAddingQuestion(false)
    }
  }

  const handleAddMultipleQuestions = async (questionsList) => {
    try {
      setAddingQuestion(true)
      const bulkData = {
        exam_id: parseInt(examId),
        questions: questionsList.map(q => ({
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
          marks: q.marks,
          explanation: q.explanation
        }))
      }
      const response = await adminAPI.addMultipleQuestions(parseInt(examId), bulkData.questions)
      alert(`Successfully added ${response.data.created} questions`)
      fetchQuestions()
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

  const handleImportCSV = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }

    try {
      setImporting(true)
      setImportResult(null)
      const response = await bulkAPI.importQuestions(file, examId)
      setImportResult(response.data)
      fetchQuestions()
      alert(`Successfully imported ${response.data.imported} questions`)
    } catch (err) {
      alert(handleError(err))
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await bulkAPI.exportQuestions(examId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `questions_${examId}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert(handleError(err))
    }
  }

  const downloadTemplate = () => {
    const template = `question_text,option_a,option_b,option_c,option_d,correct_answer,marks,explanation
"What is the capital of France?","London","Paris","Berlin","Madrid","B",1,"France's capital is Paris"
"What is 2 + 2?","3","4","5","6","B",1,"Basic math addition"
"Who wrote Romeo and Juliet?","Shakespeare","Hemingway","Austen","Dickens","A",2,"Famous playwright"`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'questions_template.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const totalMarks = questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0)

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Questions</h1>
            <p className="text-gray-600">{exam.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              Total Questions: {questions.length} • Total Marks: {totalMarks}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center space-x-2"
            >
              <FileText size={18} />
              <span>Template</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={questions.length === 0}
              className="flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center space-x-2"
            >
              <Upload size={18} />
              <span>{importing ? 'Importing...' : 'Import CSV'}</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportCSV}
              accept=".csv"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {importResult && importResult.errors && importResult.errors.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700 font-medium mb-2">
            Import completed with {importResult.errors.length} errors:
          </p>
          <ul className="text-sm text-yellow-600 list-disc list-inside max-h-32 overflow-y-auto">
            {importResult.errors.slice(0, 5).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {importResult.errors.length > 5 && (
              <li>...and {importResult.errors.length - 5} more errors</li>
            )}
          </ul>
        </div>
      )}

      <Card className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={24} />
          Add Questions
        </h2>
        <QuestionFormSimple
          onSave={handleAddMultipleQuestions}
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
