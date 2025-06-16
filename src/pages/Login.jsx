import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { FaSignInAlt } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Hacemos la petición sin el interceptor que añade el token
      const response = await api.post('/auth/login', { email, password }, {
        skipAuthRefresh: true // Opcional: puedes añadir esta propiedad personalizada
      })

      // Verificamos que la respuesta tenga la estructura esperada
      if (!response?.data?.accessToken) {
        throw new Error('La respuesta del servidor no contiene el token')
      }

      // Guardamos el token en localStorage
      localStorage.setItem('token', response.data.accessToken)

      // Redirigimos al dashboard
      navigate('/')
    } catch (err) {
      console.error('Error en login:', err)
      
      // Manejo mejorado de errores
      let errorMessage = 'Error al iniciar sesión'
      if (err.response) {
        // Error del servidor (4xx, 5xx)
        errorMessage = err.response.data?.message || 
                      err.response.statusText || 
                      `Error ${err.response.status}`
      } else if (err.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage = 'No se recibió respuesta del servidor'
      } else {
        // Error al configurar la petición
        errorMessage = err.message || 'Error al configurar la petición'
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <FaSignInAlt className="text-2xl mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition flex items-center justify-center ${isLoading ? 'opacity-75' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <FaSignInAlt className="mr-2" />
                Ingresar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}