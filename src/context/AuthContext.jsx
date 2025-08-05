import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      // Try to get current user info from backend using the verifyToken endpoint
      const response = await api.get('/auth/verifyToken')
      setCurrentUser(response.user)
    } catch (error) {
      // If request fails, user is not authenticated
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const loginUser = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      
      // After successful login, get user info
      await checkAuthStatus()
      
      return { success: true, data: response }
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.message).join(', ')
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logoutUser = async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Clear user state and redirect
      setCurrentUser(null)
      navigate('/login')
    }
  }

  const value = {
    currentUser,
    isLoading,
    loginUser,
    logoutUser,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
