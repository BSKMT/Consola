import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://consola.bskmt.com/api', // Usando tu subdominio
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para añadir el token automáticamente
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('bskmt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient