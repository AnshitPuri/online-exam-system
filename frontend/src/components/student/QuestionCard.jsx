import { Award, CheckCircle } from 'lucide-react'
import Card from '../common/Card'
import { QUESTION_OPTIONS } from '../../utils/constants'

const QuestionCard = ({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onSelectAnswer, 
  disabled = false 
}) => {
  const handleOptionSelect = (option) => {
    if (!disabled) {
      onSelectAnswer(question.id, option)
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Question {questionNumber}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Award size={16} />
                <span>{question.marks} marks</span>
              </div>
            </div>
            <p className="text-lg text-gray-900 leading-relaxed">{question.question_text}</p>
          </div>
        </div>

        <div className="space-y-3">
          {QUESTION_OPTIONS.map((option) => {
            const optionText = question[`option_${option.toLowerCase()}`]
            const isSelected = selectedAnswer === option
            
            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={disabled}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 bg-white'
                } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-primary-600 bg-primary-600'
                      : 'border-gray-300'
                  }`}>
                    {isSelected ? (
                      <CheckCircle size={20} className="text-white" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">{option}</span>
                    )}
                  </div>
                  <span className={`flex-1 ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {optionText}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {selectedAnswer && !disabled && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle size={16} />
            <span>Answer saved</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default QuestionCard