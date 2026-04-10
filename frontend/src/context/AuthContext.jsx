import { createContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { TOKEN_KEY, USER_KEY } from '../utils/constants'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      const savedUser = localStorage.getItem(USER_KEY)

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authAPI.login(credentials)
      const { access_token, user: userData } = response.data
    
    if (!access_token) {
      alert('ERROR: No access token received!')
      setLoading(false)
      return { success: false, error: 'No access token' }
    }
    
    localStorage.setItem(TOKEN_KEY, access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
    setLoading(false)
    
    return { success: true, user: userData }
  } catch (error) {
    console.error('Login error:', error)
    setLoading(false)
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Login failed' 
    }
  }
}


  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    authAPI.logout().catch(() => {})
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}