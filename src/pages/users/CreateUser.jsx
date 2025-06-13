import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { FaUserPlus, FaMotorcycle, FaIdCard, FaInfoCircle, FaShieldAlt, FaMedal } from 'react-icons/fa'
import { MdMedicalServices, MdEmergency } from 'react-icons/md'

export default function CreateUser() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado inicial con todos los campos del modelo User
  const [userData, setUserData] = useState({
    // Documento e identificación
    documentType: 'CC',
    documentNumber: '',
    avatar: '/default-avatar.jpg',
    
    // Información personal
    firstName: '',
    lastName: '',
    birthDate: '',
    age: '',
    birthPlace: '',
    binaryGender: 'Prefiero no decir',
    genderIdentity: '',
    
    // Información de contacto
    address: '',
    neighborhood: '',
    city: '',
    country: 'Colombia',
    postalCode: '',
    phone: '',
    whatsapp: '',
    email: '',
    
    // Información profesional
    occupation: '',
    discipline: '',
    
    // Información médica
    bloodType: '',
    rhFactor: '',
    allergies: '',
    physicalConditions: '',
    medicalTreatments: '',
    requiredMedications: '',
    healthInsurance: '',
    
    // Contacto de emergencia
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactAddress: '',
    emergencyContactNeighborhood: '',
    emergencyContactCity: 'Colombia',
    emergencyContactPhone: '',
    
    // Información de moto
    motorcyclePlate: '',
    motorcycleBrand: '',
    motorcycleModel: '',
    motorcycleYear: '',
    motorcycleDisplacement: '',
    
    // Consents
    dataConsent: false,
    liabilityWaiver: false,
    termsAcceptance: false,
    
    // Sistema de puntos
    points: 0,
    ridePoints: 0,
    eventPoints: 0,
    trainingPoints: 0,
    partnerConsumptionPoints: 0,
    otherPoints: 0,
    
    // Seguridad y autenticación
    password: '',
    temporaryPassword: false,
    role: 'Membresia Friend',
    
    // Membresía
    membershipExpiry: '',
    membershipBenefits: []
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Asegurar que los campos requeridos estén presentes
      const requiredFields = [
        'documentType', 'documentNumber', 'firstName', 'lastName',
        'birthDate', 'city', 'phone', 'email', 'password',
        'dataConsent', 'liabilityWaiver', 'termsAcceptance'
      ]
      
      const missingFields = requiredFields.filter(field => !userData[field])
      if (missingFields.length > 0) {
        throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`)
      }

      // Validar contraseña
      if (userData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres')
      }

      // Enviar datos al backend
      const response = await api.post('/users', userData)
      
      // Redirigir a la lista de usuarios o mostrar mensaje de éxito
      navigate('/users', { state: { success: 'Usuario creado exitosamente' } })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al crear el usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Opciones para selects
  const documentTypes = ['CC', 'CE', 'TI', 'PA', 'NIT', 'OTRO']
  const bloodTypes = ['A', 'B', 'AB', 'O', '']
  const rhFactors = ['+', '-', '']
  const roles = [
    'Membresia Friend',
    'Membresia Rider',
    'Membresia Pro',
    'Membresia Volunteer',
    'Membresia Leader',
    'admin'
  ]
  const genders = ['Masculino', 'Femenino', 'Prefiero no decir']

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FaUserPlus className="mr-2" /> Crear Nuevo Usuario
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección 1: Documento e identificación */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaIdCard className="mr-2" /> Documento e Identificación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Tipo de Documento *</label>
              <select
                name="documentType"
                value={userData.documentType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Número de Documento *</label>
              <input
                type="text"
                name="documentNumber"
                value={userData.documentNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                minLength="5"
                maxLength="20"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Avatar URL</label>
              <input
                type="url"
                name="avatar"
                value={userData.avatar}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                pattern="^(https?:\/\/|\/).+\.(jpg|jpeg|png|gif)$"
                title="Debe ser una URL de imagen válida (jpg, jpeg, png, gif)"
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Información Personal */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaInfoCircle className="mr-2" /> Información Personal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombres *</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Apellidos *</label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Fecha de Nacimiento *</label>
              <input
                type="date"
                name="birthDate"
                value={userData.birthDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Género</label>
              <select
                name="binaryGender"
                value={userData.binaryGender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Identidad de Género</label>
              <input
                type="text"
                name="genderIdentity"
                value={userData.genderIdentity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Lugar de Nacimiento</label>
              <input
                type="text"
                name="birthPlace"
                value={userData.birthPlace}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="100"
              />
            </div>
          </div>
        </div>

        {/* Sección 3: Información de Contacto */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Barrio</label>
              <input
                type="text"
                name="neighborhood"
                value={userData.neighborhood}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Ciudad *</label>
              <input
                type="text"
                name="city"
                value={userData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">País</label>
              <input
                type="text"
                name="country"
                value={userData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Teléfono *</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                pattern="[0-9]{10,15}"
                title="10-15 dígitos numéricos"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={userData.whatsapp}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                pattern="[0-9]{10,15}"
                title="10-15 dígitos numéricos"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Sección 4: Información de Moto */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaMotorcycle className="mr-2" /> Información de Moto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Placa</label>
              <input
                type="text"
                name="motorcyclePlate"
                value={userData.motorcyclePlate}
                onChange={handleChange}
                className="w-full p-2 border rounded uppercase"
                maxLength="10"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                name="motorcycleBrand"
                value={userData.motorcycleBrand}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                name="motorcycleModel"
                value={userData.motorcycleModel}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Año</label>
              <input
                type="text"
                name="motorcycleYear"
                value={userData.motorcycleYear}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="10"
              />
            </div>
          </div>
        </div>

        {/* Sección 5: Información Médica */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MdMedicalServices className="mr-2" /> Información Médica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Tipo de Sangre</label>
              <select
                name="bloodType"
                value={userData.bloodType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type || 'No especificado'}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Factor RH</label>
              <select
                name="rhFactor"
                value={userData.rhFactor}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {rhFactors.map(factor => (
                  <option key={factor} value={factor}>{factor || 'No especificado'}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Alergias</label>
              <input
                type="text"
                name="allergies"
                value={userData.allergies}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Condiciones Físicas</label>
              <textarea
                name="physicalConditions"
                value={userData.physicalConditions}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
                maxLength="500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Tratamientos Médicos</label>
              <textarea
                name="medicalTreatments"
                value={userData.medicalTreatments}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
                maxLength="500"
              />
            </div>
          </div>
        </div>

        {/* Sección 6: Contacto de Emergencia */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MdEmergency className="mr-2" /> Contacto de Emergencia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="emergencyContactName"
                value={userData.emergencyContactName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Parentesco</label>
              <input
                type="text"
                name="emergencyContactRelationship"
                value={userData.emergencyContactRelationship}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={userData.emergencyContactPhone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                pattern="[0-9]{10,15}"
                title="10-15 dígitos numéricos"
              />
            </div>
          </div>
        </div>

        {/* Sección 7: Permisos y Seguridad */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaShieldAlt className="mr-2" /> Permisos y Seguridad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Rol *</label>
              <select
                name="role"
                value={userData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                minLength="8"
              />
              <p className="text-sm text-gray-500 mt-1">Mínimo 8 caracteres</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="temporaryPassword"
                id="temporaryPassword"
                checked={userData.temporaryPassword}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="temporaryPassword" className="text-gray-700">
                Contraseña temporal (debe ser cambiada)
              </label>
            </div>
          </div>
        </div>

        {/* Sección 8: Consentimientos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Consentimientos</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="dataConsent"
                  id="dataConsent"
                  checked={userData.dataConsent}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="dataConsent" className="font-medium text-gray-700">
                  Consentimiento de Tratamiento de Datos *
                </label>
                <p className="text-gray-500">Autorizo el tratamiento de mis datos personales conforme a la política de privacidad.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="liabilityWaiver"
                  id="liabilityWaiver"
                  checked={userData.liabilityWaiver}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="liabilityWaiver" className="font-medium text-gray-700">
                  Exoneración de Responsabilidad *
                </label>
                <p className="text-gray-500">Exonero a BSK Motorcycle Team de cualquier responsabilidad por accidentes durante eventos.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="termsAcceptance"
                  id="termsAcceptance"
                  checked={userData.termsAcceptance}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAcceptance" className="font-medium text-gray-700">
                  Aceptación de Términos y Condiciones *
                </label>
                <p className="text-gray-500">Acepto los términos y condiciones de membresía y participación en eventos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? 'Creando...' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  )
}