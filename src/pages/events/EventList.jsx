// src/pages/events/EventList.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events')
        // Ordenar por fecha del evento (no de creación)
        const sortedEvents = response.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        setEvents(sortedEvents)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return <div className="p-4">Cargando eventos...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Eventos</h1>
        <Link 
          to="/events/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Crear Nuevo Evento
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Tipo</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-left">Participantes</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {events.map((event) => (
              <tr key={event._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{event.name}</td>
                <td className="py-3 px-4 capitalize">{event.eventType}</td>
                <td className="py-3 px-4">
                  {format(new Date(event.startDate), 'PPP', { locale: es })}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
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
                <td className="py-3 px-4">
                  {event.registeredParticipants} / {event.maxParticipants}
                </td>
                <td className="py-3 px-4">
                  <Link
                    to={`/events/update/${event._id}`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
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