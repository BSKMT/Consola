import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.bskmt.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para manejar tokens
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('bskmt_accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    
    // Si el error es 401 y no es una petición de refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('bskmt_refreshToken')
        if (refreshToken) {
          const { data } = await axios.post(
            'https://api.bskmt.com/auth/refresh-token',
            {},
            {
              headers: {
                'Authorization': `Bearer ${refreshToken}`
              }
            }
          )
          
          localStorage.setItem('bskmt_accessToken', data.accessToken)
          localStorage.setItem('bskmt_refreshToken', data.refreshToken)
          
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        console.error('No se pudo refrescar el token:', refreshError)
        // Limpiar tokens y redirigir a login
        localStorage.removeItem('bskmt_accessToken')
        localStorage.removeItem('bskmt_refreshToken')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient