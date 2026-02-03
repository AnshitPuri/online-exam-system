import { useState, useEffect } from 'react'
import { studentAPI } from '../services/api'
import { handleError } from '../utils/helpers'

export const useExam = (examId) => {
  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentAttempt, setCurrentAttempt] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (examId && !starting && !currentAttempt) {
      startExam()
    }
  }, [examId])

  const fetchExamDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      // Backend returns exam object directly, not wrapped in {exam: ...}
      const response = await studentAPI.getExamDetails(examId)
      setExam(response.data)
      // getExamDetails doesn't return attempt - students need to start exam first
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const startExam = async () => {
    // Prevent concurrent calls
    if (starting) return { success: false, error: 'Already starting exam' }
    
    try {
      setStarting(true)
      setLoading(true)
      setError(null)
      const response = await studentAPI.startExam(examId)
      // Backend returns AttemptResponse with exam info and questions
      setExam({
        id: response.data.exam_id,
        title: response.data.exam_title,
        duration_minutes: response.data.duration_minutes
      })
      setCurrentAttempt(response.data)
      setQuestions(response.data.questions || [])
      setAnswers({})
      return { success: true, attempt: response.data }
    } catch (err) {
      const errorMsg = handleError(err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setStarting(false)
      setLoading(false)
    }
  }

  const saveAnswer = async (questionId, selectedOption) => {
    if (!currentAttempt) return { success: false, error: 'No active attempt' }

    try {
      setAnswers(prev => ({ ...prev, [questionId]: selectedOption }))
      
      await studentAPI.saveAnswer(currentAttempt.id, {
        question_id: questionId,
        selected_answer: selectedOption
      })
      
      return { success: true }
    } catch (err) {
      const errorMsg = handleError(err)
      return { success: false, error: errorMsg }
    }
  }

  const submitExam = async (tabSwitches = 0) => {
    if (!currentAttempt) return { success: false, error: 'No active attempt' }

    try {
      setSubmitting(true)
      const response = await studentAPI.submitExam(currentAttempt.id, {
        tab_switches: tabSwitches
      })
      return { success: true, result: response.data }
    } catch (err) {
      const errorMsg = handleError(err)
      return { success: false, error: errorMsg }
    } finally {
      setSubmitting(false)
    }
  }

  const recordTabSwitch = async () => {
    if (!currentAttempt) return

    try {
      await studentAPI.recordTabSwitch(currentAttempt.id)
    } catch (err) {
      console.error('Failed to record tab switch:', err)
    }
  }

  return {
    exam,
    questions,
    currentAttempt,
    answers,
    loading,
    error,
    submitting,
    startExam,
    saveAnswer,
    submitExam,
    recordTabSwitch,
    setAnswers
  }
}