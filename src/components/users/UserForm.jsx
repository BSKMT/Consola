import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUser, createUser, updateUser } from '../../api/userService'
import { HiSave, HiArrowLeft } from 'react-icons/hi'

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PA', label: 'Pasaporte' }
]

const roles = [
  { value: 'user', label: 'Usuario' },
  { value: 'admin', label: 'Administrador' },
  { value: 'moderator', label: 'Moderador' }
]

export default function UserForm() {
  const { documentNumber } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    documentType: 'CC',
    documentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    active: true,
    password: '',
    dataConsent: false,
    liabilityWaiver: false,
    termsAcceptance: false
  })

  useEffect(() => {
    if (documentNumber) {
      setIsEditing(true)
      fetchUser()
    }
  }, [documentNumber])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const { data } = await getUser(documentNumber)
      setFormData({
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        active: data.active,
        password: '',
        dataConsent: true,
        liabilityWaiver: true,
        termsAcceptance: true
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      if (isEditing) {
        await updateUser(documentNumber, formData)
      } else {
        await createUser(formData)
      }
      
      navigate('/users')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        <button
          onClick={() => navigate('/users')}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          <HiArrowLeft className="mr-2" />
          Volver
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Documento */}
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento
            </label>
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              disabled={isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Documento */}
          <div>
            <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento
            </label>
            <input
              id="documentNumber"
              name="documentNumber"
              type="text"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              disabled={isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Nombres */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombres
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Rol */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contraseña (solo para nuevo usuario) */}
          {!isEditing && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">Mínimo 8 caracteres</p>
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="dataConsent"
              name="dataConsent"
              type="checkbox"
              checked={formData.dataConsent}
              onChange={handleChange}
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="dataConsent" className="ml-2 block text-sm text-gray-700">
              Consentimiento de datos
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="liabilityWaiver"
              name="liabilityWaiver"
              type="checkbox"
              checked={formData.liabilityWaiver}
              onChange={handleChange}
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="liabilityWaiver" className="ml-2 block text-sm text-gray-700">
              Exoneración de responsabilidad
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="termsAcceptance"
              name="termsAcceptance"
              type="checkbox"
              checked={formData.termsAcceptance}
              onChange={handleChange}
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="termsAcceptance" className="ml-2 block text-sm text-gray-700">
              Aceptación de términos y condiciones
            </label>
          </div>
        </div>

        {/* Botón de submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <HiSave className="mr-2" />
                {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}