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
        const token = localStorage.getItem('bskmt_accessToken')
        if (token) {
          const { data } = await apiClient.get('/auth/me') // Asegúrate de tener este endpoint
          setUser(data.user)
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
    try {
      const { data } = await apiClient.post('/auth/login', credentials)
      
      // Guardar tokens en localStorage
      localStorage.setItem('bskmt_accessToken', data.accessToken)
      localStorage.setItem('bskmt_refreshToken', data.refreshToken)
      
      // Obtener datos del usuario
      const userResponse = await apiClient.get('/auth/me')
      setUser(userResponse.data.user)
      
      navigate('/dashboard')
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error de autenticación')
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      localStorage.removeItem('bskmt_accessToken')
      localStorage.removeItem('bskmt_refreshToken')
      setUser(null)
      navigate('/login')
    }
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