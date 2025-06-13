// src/api/client.js
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const apiClient = axios.create({
  baseURL: 'https://api.bskmt.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para añadir token y manejar refresco
apiClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('bskmt_accessToken')
  
  if (accessToken) {
    // Verificar expiración del token
    const decoded = jwtDecode(accessToken)
    const isExpired = decoded.exp * 1000 < Date.now()
    
    if (isExpired) {
      try {
        const refreshToken = localStorage.getItem('bskmt_refreshToken')
        if (refreshToken) {
          const { data } = await axios.post('https://api.bskmt.com/auth/refresh-token', {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          })
          
          localStorage.setItem('bskmt_accessToken', data.accessToken)
          localStorage.setItem('bskmt_refreshToken', data.refreshToken)
          config.headers.Authorization = `Bearer ${data.accessToken}`
          return config
        }
      } catch (error) {
        console.error('Failed to refresh token:', error)
        localStorage.removeItem('bskmt_accessToken')
        localStorage.removeItem('bskmt_refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  
  return config
})

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bskmt_accessToken')
      localStorage.removeItem('bskmt_refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient