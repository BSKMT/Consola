import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  const { login } = useAuth()
  const [error, setError] = useState(null)

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials)
    } catch (err) {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acceso al Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona tu API de BSKMT
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}