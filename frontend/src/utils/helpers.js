import { VALIDATION } from './constants'

export const formatTime = (seconds) => {
  if (seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60)
    return `${mins} minute${mins > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(dateString)
  }
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const calculatePercentage = (obtained, total) => {
  if (total === 0) return 0
  return Math.round((obtained / total) * 100)
}

export const getPassFailStatus = (percentage, passingPercentage) => {
  return percentage >= passingPercentage ? 'pass' : 'fail'
}

export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email)
}

export const validatePassword = (password) => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH
}

export const validateName = (name) => {
  return name.trim().length >= VALIDATION.NAME_MIN_LENGTH
}

export const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getStatusColor = (status) => {
  const colors = {
    pass: 'text-green-600 bg-green-100',
    fail: 'text-red-600 bg-red-100',
    published: 'text-green-600 bg-green-100',
    unpublished: 'text-gray-600 bg-gray-100',
    active: 'text-green-600 bg-green-100',
    inactive: 'text-red-600 bg-red-100'
  }
  return colors[status] || 'text-gray-600 bg-gray-100'
}

export const sortByDate = (arr, key, order = 'desc') => {
  return [...arr].sort((a, b) => {
    const dateA = new Date(a[key])
    const dateB = new Date(b[key])
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

export const filterBySearchTerm = (arr, searchTerm, keys) => {
  if (!searchTerm) return arr
  const term = searchTerm.toLowerCase()
  return arr.filter(item =>
    keys.some(key => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], item)
      return value?.toString().toLowerCase().includes(term)
    })
  )
}

export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const handleError = (error) => {
  if (error.response) {
    return error.response.data.message || error.response.data.error || 'An error occurred'
  } else if (error.request) {
    return 'Network error. Please check your connection.'
  } else {
    return error.message || 'An unexpected error occurred'
  }
}