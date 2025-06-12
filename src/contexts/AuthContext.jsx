import { createContext, useContext, useState, useEffect } from 'react'
import apiClient from '../api/client'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('bskmt_token')
        if (token) {
          const { data } = await apiClient.get('/auth/me')
          setUser(data)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials)
    localStorage.setItem('bskmt_token', data.token)
    setUser(data.user)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('bskmt_token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}