import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.bskmt.com',
  withCredentials: true
})

// Interceptor para añadir el token JWT a los headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
  } else if (!config.url.includes('/auth/')) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return Promise.reject(new Error('No hay token de autenticación'))
  }
  
  return config
})

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    // Respuestas exitosas
    const responseData = response.data
    
    // Caso 1: Estructura {status, data, accessToken} (login)
    if (responseData?.status === 'success' && responseData.accessToken) {
      return responseData
    }
    
    // Caso 2: Estructura {status, data} (otros endpoints)
    if (responseData?.status === 'success' && responseData.data) {
      return responseData.data
    }
    
    // Caso 3: Estructura directa {data} (legacy)
    if (responseData?.data) {
      return responseData.data
    }
    
    // Caso por defecto
    return responseData || response
  },
  (error) => {
    // Manejo de errores
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
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