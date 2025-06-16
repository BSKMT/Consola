import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.bskmt.com',
  withCredentials: true
})

// Interceptor para añadir el token JWT a los headers
api.interceptors.request.use((config) => {
  // Excluir la ruta de login de la verificación del token
  if (config.url === '/auth/login') {
    return config
  }

  const token = localStorage.getItem('token')
  
  // Solo añadir el token si existe y es válido
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    // Si no hay token válido, redirigir al login
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
    return Promise.reject(new Error('No hay token de autenticación'))
  }
  
  return config
})

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    // Caso especial para la respuesta de login
    if (response.config.url === '/auth/login') {
      return response.data // Devuelve la estructura completa {status, accessToken, data}
    }
    
    // Para todas las demás respuestas
    if (response.data && response.data.status === 'success') {
      return response.data.data // Devuelve response.data.data para mantener compatibilidad
    }
    
    return response.data?.data || response.data || response
  },
  (error) => {
    // Manejo de errores
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // Normalizar el error
    const normalizedError = {
      message: error.response?.data?.message || 
              error.message || 
              'Error de conexión',
      status: error.response?.status,
      data: error.response?.data
    }
    
    console.error('API Error:', normalizedError.message)
    return Promise.reject(normalizedError)
  }
)

export default api