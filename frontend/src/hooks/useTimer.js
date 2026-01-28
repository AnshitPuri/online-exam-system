import { useState, useEffect, useRef, useCallback } from 'react'

export const useTimer = (initialSeconds, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            stop()
            if (onTimeUpRef.current) {
              onTimeUpRef.current()
            }
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const reset = useCallback((seconds = initialSeconds) => {
    stop()
    setTimeLeft(seconds)
  }, [initialSeconds, stop])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    setIsRunning(true)
  }, [])

  return {
    timeLeft,
    isRunning,
    start,
    stop,
    reset,
    pause,
    resume,
    setTimeLeft
  }
}