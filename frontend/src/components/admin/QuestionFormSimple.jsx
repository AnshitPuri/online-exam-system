import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import Button from '../common/Button'

const QuestionFormSimple = ({ onSave, onCancel, loading = false, initialQuestions = [] }) => {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    marks: 1,
    explanation: ''
  })

  useEffect(() => {
    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions)
    }
  }, [initialQuestions])

  const handleAddQuestion = () => {
    if (!currentQuestion.question_text || !currentQuestion.option_a || 
        !currentQuestion.option_b || !currentQuestion.option_c || !currentQuestion.option_d) {
      alert('Please fill in all required fields')
      return
    }

    setQuestions([...questions, { ...currentQuestion, id: Date.now() }])
    setCurrentQuestion({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      marks: 1,
      explanation: ''
    })
  }

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSaveAll = () => {
    if (questions.length === 0) {
      alert('Please add at least one question')
      return
    }
    onSave(questions)
  }

  const totalMarks = questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0)

  return (
    <div className="space-y-6">
      {/* Questions List */}
      {questions.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Added Questions ({questions.length})</h3>
            <span className="text-sm text-gray-600">Total Marks: {totalMarks}</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-lg p-3 flex items-start gap-3 shadow-sm">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{q.question_text}</p>
                  <p className="text-xs text-gray-500">
                    {q.option_a}, {q.option_b}, {q.option_c}, {q.option_d} • Correct: {q.correct_answer} • {q.marks} mark{q.marks > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Question Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Add New Question</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={currentQuestion.question_text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
              placeholder="Enter your question here..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D'].map((option) => (
              <div key={option}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option {option} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentQuestion[`option_${option.toLowerCase()}`]}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, [`option_${option.toLowerCase()}`]: e.target.value })}
                  placeholder={`Option ${option}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer <span className="text-red-500">*</span>
              </label>
              <select
                value={currentQuestion.correct_answer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks
              </label>
              <input
                type="number"
                min="1"
                value={currentQuestion.marks}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explanation (optional)
              </label>
              <input
                type="text"
                value={currentQuestion.explanation}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                placeholder="Why is this answer correct?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="primary"
          onClick={handleSaveAll}
          disabled={loading || questions.length === 0}
          loading={loading}
        >
          Save {questions.length > 0 ? `${questions.length} Question${questions.length > 1 ? 's' : ''}` : 'Questions'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuestionFormSimple
