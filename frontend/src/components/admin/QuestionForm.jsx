import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { QUESTION_OPTIONS, VALIDATION } from '../../utils/constants'

const QuestionForm = ({ onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: '',
    marks: '',
    explanation: ''
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

    if (formData.question_text.trim().length < VALIDATION.QUESTION_TEXT_MIN_LENGTH) {
      newErrors.question_text = `Question must be at least ${VALIDATION.QUESTION_TEXT_MIN_LENGTH} characters`
    }

    QUESTION_OPTIONS.forEach(option => {
      const key = `option_${option.toLowerCase()}`
      if (!formData[key].trim()) {
        newErrors[key] = `Option ${option} is required`
      }
    })

    if (!formData.correct_answer) {
      newErrors.correct_answer = 'Correct answer is required'
    }

    if (!formData.marks || parseInt(formData.marks) <= 0) {
      newErrors.marks = 'Marks must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
      setFormData({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: '',
        marks: '',
        explanation: ''
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text <span className="text-red-500">*</span>
        </label>
        <textarea
          name="question_text"
          value={formData.question_text}
          onChange={handleChange}
          placeholder="Enter the question"
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
            errors.question_text ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.question_text && <p className="mt-1 text-sm text-red-600">{errors.question_text}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUESTION_OPTIONS.map(option => (
          <Input
            key={option}
            label={`Option ${option}`}
            name={`option_${option.toLowerCase()}`}
            value={formData[`option_${option.toLowerCase()}`]}
            onChange={handleChange}
            placeholder={`Enter option ${option}`}
            error={errors[`option_${option.toLowerCase()}`]}
            required
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer <span className="text-red-500">*</span>
          </label>
          <select
            name="correct_answer"
            value={formData.correct_answer}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
              errors.correct_answer ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select correct answer</option>
            {QUESTION_OPTIONS.map(option => (
              <option key={option} value={option}>Option {option}</option>
            ))}
          </select>
          {errors.correct_answer && <p className="mt-1 text-sm text-red-600">{errors.correct_answer}</p>}
        </div>

        <Input
          label="Marks"
          type="number"
          name="marks"
          value={formData.marks}
          onChange={handleChange}
          placeholder="Enter marks"
          error={errors.marks}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (Optional)
        </label>
        <textarea
          name="explanation"
          value={formData.explanation}
          onChange={handleChange}
          placeholder="Enter explanation for the correct answer"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="primary" loading={loading}>
          Add Question
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

export default QuestionForm