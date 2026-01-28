import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { VALIDATION } from '../../utils/constants'

const ExamForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    instructions: initialData?.instructions || '',
    duration: initialData?.duration || '',
    total_marks: initialData?.total_marks || '',
    passing_marks: initialData?.passing_marks || ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (formData.title.trim().length < VALIDATION.EXAM_TITLE_MIN_LENGTH) {
      newErrors.title = `Title must be at least ${VALIDATION.EXAM_TITLE_MIN_LENGTH} characters`
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be greater than 0'
    }

    if (!formData.total_marks || parseInt(formData.total_marks) <= 0) {
      newErrors.total_marks = 'Total marks must be greater than 0'
    }

    if (!formData.passing_marks || parseInt(formData.passing_marks) <= 0) {
      newErrors.passing_marks = 'Passing marks must be greater than 0'
    }

    if (parseInt(formData.passing_marks) > parseInt(formData.total_marks)) {
      newErrors.passing_marks = 'Passing marks cannot exceed total marks'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Exam Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter exam title"
        error={errors.title}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter exam description"
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions
        </label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          placeholder="Enter exam instructions (optional)"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Duration (minutes)"
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="60"
          error={errors.duration}
          required
        />

        <Input
          label="Total Marks"
          type="number"
          name="total_marks"
          value={formData.total_marks}
          onChange={handleChange}
          placeholder="100"
          error={errors.total_marks}
          required
        />

        <Input
          label="Passing Marks"
          type="number"
          name="passing_marks"
          value={formData.passing_marks}
          onChange={handleChange}
          placeholder="40"
          error={errors.passing_marks}
          required
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Exam' : 'Create Exam'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default ExamForm