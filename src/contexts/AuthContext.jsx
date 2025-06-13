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
    console.log('1. Iniciando login...');
    const { data } = await apiClient.post('/auth/login', credentials);
    console.log('2. Login exitoso, token recibido:', data.token);
    
    localStorage.setItem('bskmt_token', data.token);
    console.log('3. Token almacenado en localStorage');
    
    const userResponse = await apiClient.get('/users/me');
    console.log('4. Datos de usuario recibidos:', userResponse.data);
    
    setUser(userResponse.data.user);
    console.log('5. Estado de usuario actualizado');
    
    navigate('/dashboard', { replace: true });
    console.log('6. Navegación al dashboard ejecutada');
    
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
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