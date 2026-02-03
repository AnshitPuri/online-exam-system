import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import ExamForm from '../../components/admin/ExamForm'
import Card from '../../components/common/Card'
import { handleError } from '../../utils/helpers'
import { MESSAGES } from '../../utils/constants'

const CreateExam = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      // Transform form data to match backend schema
      const examData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        duration_minutes: parseInt(formData.duration),
        total_marks: parseInt(formData.total_marks),
        passing_marks: parseInt(formData.passing_marks)
      }
      
      const response = await adminAPI.createExam(examData)
      
      setSuccess(true)
      alert(MESSAGES.EXAM_CREATE_SUCCESS)
      navigate('/admin/manage-exams')
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Exam</h1>
        <p className="text-gray-600">Fill in the details to create a new exam</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{MESSAGES.EXAM_CREATE_SUCCESS}</p>
        </div>
      )}

      <Card>
        <ExamForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/manage-exams')}
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default CreateExam