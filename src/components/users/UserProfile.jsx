import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUser, updateUserPoints } from '../../api/userService'
import { HiPencil, HiStar, HiUserCircle, HiX } from 'react-icons/hi'

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg">
        Usuario no encontrado
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h2>
        <button
          onClick={() => setShowPointsModal(true)}
          className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          <HiStar className="mr-2" />
          Asignar Puntos
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 mx-auto">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <HiUserCircle className="w-full h-full text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tipo de Documento</p>
                <p className="font-medium text-gray-900">{user.documentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número de Documento</p>
                <p className="font-medium text-gray-900">{user.documentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Puntos y Actividades</h3>
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
      </div>

      {/* Modal para agregar puntos */}
      {showPointsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-800">Asignar Puntos</h3>
              <button 
                onClick={() => setShowPointsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="pointsType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Puntos
                </label>
                <select
                  id="pointsType"
                  name="pointsType"
                  value={pointsData.pointsType}
                  onChange={handlePointsChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="events">Eventos</option>
                  <option value="trainings">Entrenamientos</option>
                  <option value="rides">Paseos</option>
                  <option value="partnerConsumption">Consumo en aliados</option>
                  <option value="others">Otros</option>
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={pointsData.amount}
                  onChange={handlePointsChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Razón
                </label>
                <input
                  id="reason"
                  name="reason"
                  type="text"
                  value={pointsData.reason}
                  onChange={handlePointsChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-4 border-t">
              <button
                onClick={() => setShowPointsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPoints}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Asignar Puntos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}