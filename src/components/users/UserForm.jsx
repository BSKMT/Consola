// src/components/users/UserForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  getUser, 
  createUser, 
  updateUser 
} from '../../api/userService'
import { 
  Button, 
  TextInput, 
  Select, 
  Alert, 
  Spinner,
  Label,
  Checkbox
} from 'flowbite-react'
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

  if (loading && !isEditing) return <Spinner size="xl" />

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        <Button onClick={() => navigate('/users')} color="gray">
          <HiArrowLeft className="mr-2" />
          Volver
        </Button>
      </div>

      {error && <Alert color="failure" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="documentType">Tipo de Documento</Label>
            <Select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              disabled={isEditing}
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="documentNumber">Número de Documento</Label>
            <TextInput
              id="documentNumber"
              name="documentNumber"
              type="text"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              disabled={isEditing}
            />
          </div>

          <div>
            <Label htmlFor="firstName">Nombres</Label>
            <TextInput
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName">Apellidos</Label>
            <TextInput
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <TextInput
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Rol</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </Select>
          </div>

          {!isEditing && (
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <TextInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                helperText="Mínimo 8 caracteres"
              />
            </div>
          )}

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="dataConsent"
                name="dataConsent"
                checked={formData.dataConsent}
                onChange={handleChange}
                required
              />
              <Label htmlFor="dataConsent">Consentimiento de datos</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="liabilityWaiver"
                name="liabilityWaiver"
                checked={formData.liabilityWaiver}
                onChange={handleChange}
                required
              />
              <Label htmlFor="liabilityWaiver">Exoneración de responsabilidad</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="termsAcceptance"
                name="termsAcceptance"
                checked={formData.termsAcceptance}
                onChange={handleChange}
                required
              />
              <Label htmlFor="termsAcceptance">Aceptación de términos y condiciones</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" className="mr-2" /> : <HiSave className="mr-2" />}
            {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </div>
  )
}