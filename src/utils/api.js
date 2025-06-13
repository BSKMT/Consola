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

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login' // Redirige si el token es inválido
    }
    return Promise.reject(error)
  }
)

export default api