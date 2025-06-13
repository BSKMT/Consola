// src/components/users/UserList.jsx
import { useState, useEffect } from 'react'
import { getAllUsers } from '../../api/userService'
import { Table, Button, Badge, Alert, Spinner } from 'flowbite-react'
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, results, total } = await getAllUsers({
        page: pagination.page,
        limit: pagination.limit
      })
      setUsers(data || [])
      setPagination(prev => ({ ...prev, total }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, pagination.limit])

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  if (error) return <Alert color="failure">{error}</Alert>

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <Button as={Link} to="/users/new" color="blue">
          <HiPlus className="mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Documento</Table.HeadCell>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Rol</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map(user => (
                <Table.Row key={user.documentNumber} className="bg-white">
                  <Table.Cell>{user.documentNumber}</Table.Cell>
                  <Table.Cell>{`${user.firstName} ${user.lastName}`}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color={user.role === 'admin' ? 'indigo' : 'gray'}>
                      {user.role}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={user.active ? 'success' : 'failure'}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button as={Link} to={`/users/${user.documentNumber}`} size="xs" color="blue">
                        <HiPencil className="mr-1" />
                        Editar
                      </Button>
                      <Button size="xs" color="failure">
                        <HiTrash className="mr-1" />
                        Desactivar
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} usuarios
            </span>
            <div className="flex space-x-2">
              <Button 
                onClick={() => handlePageChange(pagination.page - 1)} 
                disabled={pagination.page === 1}
                size="sm"
              >
                Anterior
              </Button>
              <Button 
                onClick={() => handlePageChange(pagination.page + 1)} 
                disabled={pagination.page * pagination.limit >= pagination.total}
                size="sm"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}