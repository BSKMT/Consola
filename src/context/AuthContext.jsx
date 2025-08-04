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
      // Try to get current user info from backend
      const response = await api.get('/auth/me')
      setCurrentUser(response)
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
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      }
    }
  }

  const logoutUser = async () => {
    try {
      // Call logout endpoint if available
      await api.post('/auth/logout').catch(() => {
        // Ignore errors on logout endpoint - might not exist
      })
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
