import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.bskmt.com', // Sin /api al final
  withCredentials: true // Para manejar cookies si las usas
})

// Interceptor para añadir el token JWT a los headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar respuestas exitosas
api.interceptors.response.use(
  (response) => {
    // Normalizamos la estructura de respuesta exitosa
    if (response.data && response.data.status === 'success') {
      // Para respuestas con estructura {status, data}
      return {
        ...response,
        data: response.data.data // Extraemos solo la parte de datos
      }
    }
    // Para otras respuestas que no siguen el formato estándar
    return response
  },
  // Interceptor para manejar errores
  (error) => {
    // Manejo de errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    // Normalización de errores
    const normalizedError = {
      message: error.response?.data?.message || 
              error.message || 
              'Error de conexión con el servidor',
      status: error.response?.status,
      data: error.response?.data
    }

    // Opcional: Mostrar notificación de error global
    if (typeof window !== 'undefined' && normalizedError.message) {
      console.error('API Error:', normalizedError.message)
    }

    return Promise.reject(normalizedError)
  }
)

export default api