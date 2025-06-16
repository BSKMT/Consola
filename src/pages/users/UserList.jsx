import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa'
import Swal from 'sweetalert2' // Para alertas bonitas

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      console.log('API Response:', response)
      setUsers(response.users || [])
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err.message || 'Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (documentNumber) => {
    try {
      // Confirmación antes de eliminar
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto! El usuario será desactivado.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        // Llamada a la API para desactivar
        await api.delete(`/users/${documentNumber}`)
        
        // Actualizar lista de usuarios
        await fetchUsers()
        
        // Mostrar confirmación
        Swal.fire(
          '¡Desactivado!',
          'El usuario ha sido desactivado.',
          'success'
        )
      }
    } catch (err) {
      console.error('Error al desactivar usuario:', err)
      Swal.fire(
        'Error',
        err.message || 'Ocurrió un error al desactivar el usuario',
        'error'
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
        <Link
          to="/users/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaUserPlus className="mr-2" /> Nuevo Usuario
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.documentNumber}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.documentNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/users/edit/${user.documentNumber}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit className="inline mr-1" /> Editar
                    </Link>
                    <button 
                      onClick={() => handleDeleteUser(user.documentNumber)}
                      className="text-red-600 hover:text-red-900"
                      disabled={!user.active}
                    >
                      <FaTrash className="inline mr-1" /> 
                      {user.active ? 'Desactivar' : 'Desactivado'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}