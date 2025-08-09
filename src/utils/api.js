import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.bskmt.com/api/v1'

const api = axios.create({
  baseURL,
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
    
    // Your backend returns {status: 'success', data: {...}} structure
    if (responseData?.status === 'success') {
      // For login endpoint, return the full response to access user data
      if (responseData.data?.user) {
        return responseData.data
      }
      // For other endpoints, return the data part
      return responseData.data || responseData
    }
    
    // Default case - return the full response data
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
    
    // Normalize error structure based on your backend
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
