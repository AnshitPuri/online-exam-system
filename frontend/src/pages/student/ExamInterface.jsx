import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useExam } from '../../hooks/useExam'
import { useTimer } from '../../hooks/useTimer'
import ExamTimer from '../../components/student/ExamTimer'
import QuestionCard from '../../components/student/QuestionCard'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Modal, { ConfirmModal } from '../../components/common/Modal'
import { MAX_TAB_SWITCHES, MESSAGES } from '../../utils/constants'

const ExamInterface = () => {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { exam, questions, currentAttempt, answers, loading, error, saveAnswer, submitExam, recordTabSwitch } = useExam(examId)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleTimeUp = async () => {
    alert(MESSAGES.TIME_UP)
    await handleSubmitExam()
  }

  const { timeLeft, start } = useTimer(
    exam ? exam.duration * 60 : 0,
    handleTimeUp
  )

  useEffect(() => {
    if (exam && currentAttempt && !loading) {
      start()
    }
  }, [exam, currentAttempt, loading])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentAttempt) {
        const newCount = tabSwitches + 1
        setTabSwitches(newCount)
        recordTabSwitch()

        if (newCount >= MAX_TAB_SWITCHES) {
          alert(MESSAGES.TAB_SWITCH_LIMIT)
          handleSubmitExam()
        } else {
          setShowWarningModal(true)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [tabSwitches, currentAttempt])

  const handleAnswerSelect = async (questionId, selectedOption) => {
    await saveAnswer(questionId, selectedOption)
  }

  const handleSubmitExam = async () => {
    setSubmitting(true)
    const result = await submitExam(tabSwitches)
    
    if (result.success) {
      navigate(`/student/exam/${examId}/result?attemptId=${currentAttempt.id}`)
    } else {
      alert(result.error || 'Failed to submit exam')
      setSubmitting(false)
    }
  }

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false)
    handleSubmitExam()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text="Loading exam..." />
      </div>
    )
  }

  if (error || !exam || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Exam</h3>
          <p className="text-gray-600 mb-6">{error || 'Unable to load exam'}</p>
          <Button onClick={() => navigate('/student')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const totalQuestions = questions.length

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ExamTimer timeLeft={timeLeft} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {totalQuestions} • {answeredCount} answered
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Tab Switches</div>
              <div className={`text-2xl font-bold ${tabSwitches >= MAX_TAB_SWITCHES - 1 ? 'text-red-600' : 'text-gray-900'}`}>
                {tabSwitches}/{MAX_TAB_SWITCHES}
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedAnswer={answers[currentQuestion.id]}
          onSelectAnswer={handleAnswerSelect}
        />

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-12 h-12 rounded-lg font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                variant="success"
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="Tab Switch Detected!"
        size="sm"
      >
        <div className="text-center py-4">
          <AlertTriangle size={64} className="mx-auto text-yellow-500 mb-4" />
          <p className="text-gray-700 mb-4">{MESSAGES.TAB_SWITCH_WARNING}</p>
          <p className="text-sm text-gray-600 mb-6">
            You have {MAX_TAB_SWITCHES - tabSwitches} warning(s) remaining.
          </p>
          <Button variant="primary" onClick={() => setShowWarningModal(false)} fullWidth>
            I Understand
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Exam"
        message={MESSAGES.CONFIRM_SUBMIT}
        confirmText="Submit"
        variant="success"
      />
    </div>
  )
}

export default ExamInterface