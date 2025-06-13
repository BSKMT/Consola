import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { FaUserPlus, FaMotorcycle, FaIdCard, FaEnvelope, FaLock } from 'react-icons/fa'
import { MdDateRange, MdPhone, MdLocationCity } from 'react-icons/md'

export default function CreateUser() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Campos obligatorios según tu userController.js
  const [formData, setFormData] = useState({
    documentType: 'CC',
    documentNumber: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    city: '',
    phone: '',
    email: '',
    password: '',
    dataConsent: false,
    liabilityWaiver: false,
    termsAcceptance: false,
    role: 'Membresia Friend'
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      // Endpoint: POST /users (según userRoutes.js)
      const response = await api.post('/users', formData)

      setSuccess('Usuario creado exitosamente!')
      setTimeout(() => navigate('/users'), 2000) // Redirige después de 2 segundos
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear usuario'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <FaUserPlus className="text-2xl mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">Crear Nuevo Usuario</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de Información Básica */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Documento */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tipo de Documento</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="PA">Pasaporte</option>
                <option value="NIT">NIT</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            {/* Número de Documento */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaIdCard className="mr-2" /> Número de Documento
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                minLength="5"
                maxLength="20"
                pattern="[a-zA-Z0-9-]+"
                title="Solo letras, números y guiones"
              />
            </div>

            {/* Nombres */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nombres</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                minLength="2"
                maxLength="50"
              />
            </div>

            {/* Apellidos */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Apellidos</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                minLength="2"
                maxLength="50"
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <MdDateRange className="mr-2" /> Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Ciudad */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <MdLocationCity className="mr-2" /> Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                maxLength="50"
              />
            </div>
          </div>
        </div>

        {/* Sección de Contacto */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4">Información de Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <MdPhone className="mr-2" /> Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                pattern="[0-9]{7,15}"
                title="Entre 7 y 15 dígitos"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaEnvelope className="mr-2" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Contraseña */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaLock className="mr-2" /> Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                minLength="8"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"
                title="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número"
              />
            </div>

            {/* Rol */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Membresia Friend">Membresía Friend</option>
                <option value="Membresia Rider">Membresía Rider</option>
                <option value="Membresia Pro">Membresía Pro</option>
                <option value="Membresia Volunteer">Membresía Volunteer</option>
                <option value="Membresia Leader">Membresía Leader</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección de Consentimientos */}
        <div className="pb-6">
          <h2 className="text-lg font-semibold mb-4">Consentimientos</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="dataConsent"
                checked={formData.dataConsent}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label>Consiento el tratamiento de mis datos personales</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="liabilityWaiver"
                checked={formData.liabilityWaiver}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label>Acepto la exoneración de responsabilidad</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="termsAcceptance"
                checked={formData.termsAcceptance}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label>Acepto los términos y condiciones</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Creando...' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  )
}