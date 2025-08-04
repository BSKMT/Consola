import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.bskmt.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - no longer needs to handle tokens
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with withCredentials: true
    // No need to manually add Authorization headers
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling responses and errors
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    const responseData = response.data
    
    // Case 1: Structure {status, data, accessToken} (login response)
    if (responseData?.status === 'success' && responseData.accessToken) {
      return responseData
    }
    
    // Case 2: Structure {status, data} (other endpoints)
    if (responseData?.status === 'success' && responseData.data) {
      return responseData.data
    }
    
    // Case 3: Direct structure {data} (legacy)
    if (responseData?.data) {
      return responseData.data
    }
    
    // Default case
    return responseData || response
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // For cookie-based auth, we redirect to login on auth errors
      // The AuthContext will handle the logout logic
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // Normalize error structure
    const normalizedError = {
      message: error.response?.data?.message || 
              error.message || 
              'Error de conexión',
      status: error.response?.status,
      data: error.response?.data,
      response: error.response
    }
    
    console.error('API Error:', normalizedError.message)
    return Promise.reject(normalizedError)
  }
)

export default api
