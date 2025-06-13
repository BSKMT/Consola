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
          const { data } = await apiClient.get('/users/me')
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
    // 1. Hacer la petición de login
    const { data } = await apiClient.post('/auth/login', credentials);
    
    // 2. Guardar el token (verifica el nombre correcto en la respuesta)
    localStorage.setItem('bskmt_token', data.token); 
    
    // 3. Obtener datos del usuario (usando tu endpoint correcto)
    const userResponse = await apiClient.get('/users/me');
    
    // 4. Actualizar estado del usuario
    setUser(userResponse.data.user);
    
    // 5. Redirigir al dashboard
    navigate('/dashboard', { replace: true }); // Asegúrate que esta ruta existe
    
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Error de autenticación');
  }
};

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