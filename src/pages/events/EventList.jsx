// src/pages/events/EventList.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events?sort=-startDate')
        setEvents(response.events || [])
      } catch (err) {
        setError(err.message)
        toast.error('Error al cargar los eventos')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return <div className="p-6">Cargando eventos...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Eventos</h1>
        <Link 
          to="/events/create" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Crear Nuevo Evento
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{event.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {event.eventType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(event.startDate), 'PPP', { locale: es })} - {format(new Date(event.endDate), 'PPP', { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.eventStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                    event.eventStatus === 'postponed' ? 'bg-yellow-100 text-yellow-800' :
                    event.eventStatus === 'canceled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.eventStatus === 'confirmed' ? 'Confirmado' :
                     event.eventStatus === 'postponed' ? 'Aplazado' :
                     event.eventStatus === 'canceled' ? 'Cancelado' : 'Completado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.registeredParticipants} / {event.maxParticipants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/events/edit/${event._id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}