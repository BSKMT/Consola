import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { FaSignInAlt } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Endpoint: POST /auth/login (según tu authRoutes.js)
      const response = await api.post('/auth/login', { email, password })

      // Tu backend devuelve { accessToken, refreshToken } en response.data
      const { accessToken } = response.data

      // Guardar el token en localStorage (o cookies si prefieres)
      localStorage.setItem('token', accessToken)

      // Redirigir al dashboard
      navigate('/')
    } catch (err) {
      // Manejo de errores específicos según tu backend
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión'
      setError(errorMessage)
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
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
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
              className="w-full p-2 border rounded"
              required
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
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}