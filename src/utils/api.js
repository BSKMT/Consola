import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.bskmt.com',
  withCredentials: true
})

// Interceptor para añadir el token JWT a los headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  
  // Solo añadir el token si existe y es válido
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    // Si no hay token válido, redirigir al login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
  
  return config
})

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    // Manejar respuesta exitosa
    if (response.data && response.data.status === 'success') {
      return response.data.data // Extraemos solo la parte de datos para respuestas con estructura {status, data}
    }
    return response.data?.data || response.data || response
  },
  (error) => {
    // Manejo de errores
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined') {
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