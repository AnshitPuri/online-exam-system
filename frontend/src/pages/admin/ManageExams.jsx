import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, BookOpen, Eye, EyeOff } from 'lucide-react'
import { adminAPI } from '../../services/api'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import { ConfirmModal } from '../../components/common/Modal'
import { handleError, getStatusColor } from '../../utils/helpers'
import { MESSAGES } from '../../utils/constants'

const ManageExams = () => {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ show: false, examId: null })

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminAPI.getAllExams()
      setExams(response.data)
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (examId) => {
    try {
      await adminAPI.toggleExamStatus(examId)
      setExams(exams.map(exam => 
        exam.id === examId 
          ? { ...exam, is_published: !exam.is_published }
          : exam
      ))
    } catch (err) {
      alert(handleError(err))
    }
  }

  const handleDelete = async () => {
    try {
      await adminAPI.deleteExam(deleteModal.examId)
      setExams(exams.filter(exam => exam.id !== deleteModal.examId))
      setDeleteModal({ show: false, examId: null })
      alert(MESSAGES.EXAM_DELETE_SUCCESS)
    } catch (err) {
      alert(handleError(err))
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Exams</h1>
          <p className="text-gray-600">Create, edit, and manage your exams</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/admin/create-exam')}
        >
          Create Exam
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {exams.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Yet</h3>
            <p className="text-gray-600 mb-6">Create your first exam to get started</p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/admin/create-exam')}
            >
              Create First Exam
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(exam.is_published ? 'published' : 'unpublished')
                    }`}>
                      {exam.is_published ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Duration: {exam.duration} mins</span>
                    <span>•</span>
                    <span>Total Marks: {exam.total_marks}</span>
                    <span>•</span>
                    <span>Passing Marks: {exam.passing_marks}</span>
                    <span>•</span>
                    <span>Questions: {exam.questions_count || 0}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant={exam.is_published ? 'secondary' : 'success'}
                    icon={exam.is_published ? EyeOff : Eye}
                    onClick={() => handleToggleStatus(exam.id)}
                  >
                    {exam.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    icon={BookOpen}
                    onClick={() => navigate(`/admin/manage-questions/${exam.id}`)}
                  >
                    Questions
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                    onClick={() => setDeleteModal({ show: true, examId: exam.id })}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, examId: null })}
        onConfirm={handleDelete}
        title="Delete Exam"
        message={MESSAGES.CONFIRM_DELETE_EXAM}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default ManageExams