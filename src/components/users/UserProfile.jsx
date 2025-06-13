// src/components/users/UserProfile.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUser, updateUserPoints } from '../../api/userService'
import { 
  Card, 
  Badge, 
  Alert, 
  Spinner, 
  Button, 
  Modal, 
  TextInput,
  Select,
  Label
} from 'flowbite-react'
import { HiPencil, HiStar, HiUserCircle } from 'react-icons/hi'

export default function UserProfile() {
  const { documentNumber } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPointsModal, setShowPointsModal] = useState(false)
  const [pointsData, setPointsData] = useState({
    pointsType: 'events',
    amount: 0,
    reason: ''
  })

  useEffect(() => {
    fetchUser()
  }, [documentNumber])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const { data } = await getUser(documentNumber)
      setUser(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePointsChange = (e) => {
    const { name, value } = e.target
    setPointsData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }))
  }

  const handleAddPoints = async () => {
    try {
      setLoading(true)
      await updateUserPoints(documentNumber, pointsData)
      setShowPointsModal(false)
      fetchUser()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner size="xl" />
  if (error) return <Alert color="failure">{error}</Alert>
  if (!user) return <Alert color="info">Usuario no encontrado</Alert>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfil de Usuario</h2>
        <Button onClick={() => setShowPointsModal(true)} color="yellow">
          <HiStar className="mr-2" />
          Asignar Puntos
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 mx-auto">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <HiUserCircle className="w-full h-full text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <Badge color={user.active ? 'success' : 'failure'}>
                {user.active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tipo de Documento</p>
                <p className="font-medium">{user.documentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número de Documento</p>
                <p className="font-medium">{user.documentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <Badge color={user.role === 'admin' ? 'indigo' : 'gray'} className="w-fit">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold mb-4">Puntos y Actividades</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Puntos Totales</p>
            <p className="text-2xl font-bold text-blue-800">{user.points}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Eventos</p>
            <p className="text-xl font-bold text-green-800">{user.pointsBreakdown?.events || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600">Entrenamientos</p>
            <p className="text-xl font-bold text-yellow-800">{user.pointsBreakdown?.trainings || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Paseos</p>
            <p className="text-xl font-bold text-purple-800">{user.pointsBreakdown?.rides || 0}</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-pink-600">Consumo en aliados</p>
            <p className="text-xl font-bold text-pink-800">{user.pointsBreakdown?.partners || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Otros</p>
            <p className="text-xl font-bold text-gray-800">{user.pointsBreakdown?.others || 0}</p>
          </div>
        </div>
      </Card>

      {/* Modal para agregar puntos */}
      <Modal show={showPointsModal} onClose={() => setShowPointsModal(false)}>
        <Modal.Header>Asignar Puntos</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pointsType">Tipo de Puntos</Label>
              <Select
                id="pointsType"
                name="pointsType"
                value={pointsData.pointsType}
                onChange={handlePointsChange}
                required
              >
                <option value="events">Eventos</option>
                <option value="trainings">Entrenamientos</option>
                <option value="rides">Paseos</option>
                <option value="partnerConsumption">Consumo en aliados</option>
                <option value="others">Otros</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Cantidad</Label>
              <TextInput
                id="amount"
                name="amount"
                type="number"
                value={pointsData.amount}
                onChange={handlePointsChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Razón</Label>
              <TextInput
                id="reason"
                name="reason"
                type="text"
                value={pointsData.reason}
                onChange={handlePointsChange}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddPoints} disabled={loading}>
            {loading ? <Spinner size="sm" className="mr-2" /> : 'Asignar Puntos'}
          </Button>
          <Button color="gray" onClick={() => setShowPointsModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}