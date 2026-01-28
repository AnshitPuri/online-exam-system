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

  useEffect(() => {
    if (examId) {
      fetchExamDetails()
    }
  }, [examId])

  const fetchExamDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await studentAPI.getExamDetails(examId)
      setExam(response.data.exam)
      if (response.data.attempt) {
        setCurrentAttempt(response.data.attempt)
        setQuestions(response.data.questions || [])
        const savedAnswers = {}
        if (response.data.attempt.answers) {
          response.data.attempt.answers.forEach(ans => {
            savedAnswers[ans.question_id] = ans.selected_option
          })
        }
        setAnswers(savedAnswers)
      }
    } catch (err) {
      setError(handleError(err))
    } finally {
      setLoading(false)
    }
  }

  const startExam = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await studentAPI.startExam(examId)
      setCurrentAttempt(response.data.attempt)
      setQuestions(response.data.questions)
      setAnswers({})
      return { success: true, attempt: response.data.attempt }
    } catch (err) {
      const errorMsg = handleError(err)
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const saveAnswer = async (questionId, selectedOption) => {
    if (!currentAttempt) return { success: false, error: 'No active attempt' }

    try {
      setAnswers(prev => ({ ...prev, [questionId]: selectedOption }))
      
      await studentAPI.saveAnswer(currentAttempt.id, {
        question_id: questionId,
        selected_option: selectedOption
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