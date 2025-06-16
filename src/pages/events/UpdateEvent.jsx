// src/pages/events/UpdateEvent.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { format, parseISO } from 'date-fns'

export default function UpdateEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    // ... otros campos iniciales
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`)
        setEvent(response)
        
        // Preparar datos para el formulario
        setFormData({
          name: response.name,
          description: response.description,
          startDate: format(parseISO(response.startDate), 'yyyy-MM-dd'),
          endDate: format(parseISO(response.endDate), 'yyyy-MM-dd'),
          meetupTime: response.meetupTime,
          departureTime: response.departureTime,
          durationDays: response.durationDays,
          departureLocation: response.departureLocation,
          stayLocation: response.stayLocation || {},
          arrivalLocation: response.arrivalLocation || {},
          basePriceRider: response.basePriceRider,
          basePriceCompanion: response.basePriceCompanion,
          membershipDiscounts: response.membershipDiscounts,
          itinerary: response.itinerary || [],
          includes: response.includes || [],
          visits: response.visits || [],
          activities: response.activities || [],
          requirements: response.requirements || [],
          recommendations: response.recommendations || [],
          additionalInformation: response.additionalInformation || '',
          difficultyLevel: response.difficultyLevel || 'medium',
          eventType: response.eventType,
          internalEventType: response.internalEventType || '',
          eventPurpose: response.eventPurpose,
          maxParticipants: response.maxParticipants,
          registrationStatus: response.registrationStatus,
          eventStatus: response.eventStatus
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleArrayChange = (field, index, subfield, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]]
      if (subfield) {
        newArray[index] = { ...newArray[index], [subfield]: value }
      } else {
        newArray[index] = value
      }
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field, initialValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], typeof initialValue === 'object' ? {...initialValue} : initialValue]
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleLocationChange = (locationType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`${locationType}Location`]: {
        ...prev[`${locationType}Location`],
        [field]: value
      }
    }))
  }

  const handleCoordinatesChange = (locationType, coord, value) => {
    setFormData(prev => ({
      ...prev,
      [`${locationType}Location`]: {
        ...prev[`${locationType}Location`],
        coordinates: {
          ...prev[`${locationType}Location`].coordinates,
          [coord]: parseFloat(value) || 0
        }
      }
    }))
  }

  const handleDiscountChange = (userType, membership, value) => {
    setFormData(prev => ({
      ...prev,
      membershipDiscounts: {
        ...prev.membershipDiscounts,
        [userType]: {
          ...prev.membershipDiscounts[userType],
          [membership]: parseInt(value) || 0
        }
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`/events/${id}`, formData)
      navigate('/events', { state: { success: 'Evento actualizado correctamente' } })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="p-4">Cargando evento...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!event) return <div className="p-4">Evento no encontrado</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Actualizar Evento: {event.name}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de Información Básica */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="Ride">Ride</option>
                <option value="Event">Event</option>
                <option value="Meetup">Meetup</option>
                <option value="Training">Training</option>
                <option value="Practice">Practice</option>
                <option value="Competition">Competition</option>
                <option value="Social">Social</option>
                <option value="Charity">Charity</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Encuentro</label>
              <input
                type="time"
                name="meetupTime"
                value={formData.meetupTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Salida</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (días)</label>
              <input
                type="number"
                name="durationDays"
                value={formData.durationDays}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Dificultad</label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Propósito del Evento</label>
              <select
                name="eventPurpose"
                value={formData.eventPurpose}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="Community">Comunidad</option>
                <option value="Cultural">Cultural</option>
                <option value="Tourism">Turismo</option>
                <option value="Social">Social</option>
                <option value="Training">Entrenamiento</option>
                <option value="Education">Educación</option>
                <option value="Competition">Competencia</option>
                <option value="Charity">Caridad</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado del Evento</label>
              <select
                name="eventStatus"
                value={formData.eventStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="confirmed">Confirmado</option>
                <option value="postponed">Aplazado</option>
                <option value="canceled">Cancelado</option>
                <option value="completed">Completado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Registro</label>
              <select
                name="registrationStatus"
                value={formData.registrationStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="available">Disponible</option>
                <option value="upcoming">Próximamente</option>
                <option value="closed">Cerrado</option>
                <option value="sold-out">Agotado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Participantes</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                max="500"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Información Adicional</label>
            <textarea
              name="additionalInformation"
              value={formData.additionalInformation}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        {/* Sección de Ubicaciones */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ubicaciones</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ubicación de Salida */}
            <div>
              <h3 className="font-medium mb-2">Punto de Salida</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.departureLocation.address}
                    onChange={(e) => handleLocationChange('departure', 'address', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.departureLocation.city}
                    onChange={(e) => handleLocationChange('departure', 'city', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Latitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.departureLocation.coordinates.lat}
                      onChange={(e) => handleCoordinatesChange('departure', 'lat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Longitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.departureLocation.coordinates.lng}
                      onChange={(e) => handleCoordinatesChange('departure', 'lng', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ubicación de Estancia */}
            <div>
              <h3 className="font-medium mb-2">Lugar de Estancia</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.stayLocation.address || ''}
                    onChange={(e) => handleLocationChange('stay', 'address', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.stayLocation.city || ''}
                    onChange={(e) => handleLocationChange('stay', 'city', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Latitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.stayLocation.coordinates?.lat || ''}
                      onChange={(e) => handleCoordinatesChange('stay', 'lat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Longitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.stayLocation.coordinates?.lng || ''}
                      onChange={(e) => handleCoordinatesChange('stay', 'lng', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ubicación de Llegada */}
            <div>
              <h3 className="font-medium mb-2">Punto de Llegada</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.arrivalLocation.address || ''}
                    onChange={(e) => handleLocationChange('arrival', 'address', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.arrivalLocation.city || ''}
                    onChange={(e) => handleLocationChange('arrival', 'city', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Latitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.arrivalLocation.coordinates?.lat || ''}
                      onChange={(e) => handleCoordinatesChange('arrival', 'lat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Longitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.arrivalLocation.coordinates?.lng || ''}
                      onChange={(e) => handleCoordinatesChange('arrival', 'lng', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de Precios */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Precios y Descuentos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Precios Base</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Precio para Pilotos (COP)</label>
                  <input
                    type="number"
                    name="basePriceRider"
                    value={formData.basePriceRider}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Precio para Acompañantes (COP)</label>
                  <input
                    type="number"
                    name="basePriceCompanion"
                    value={formData.basePriceCompanion}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Descuentos por Membresía</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Pilotos</h4>
                  <div className="space-y-1">
                    {Object.entries(formData.membershipDiscounts.rider).map(([membership, discount]) => (
                      <div key={`rider-${membership}`} className="flex items-center">
                        <label className="text-xs w-16">{membership}:</label>
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => handleDiscountChange('rider', membership, e.target.value)}
                          min="0"
                          max="100"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                        />
                        <span className="text-xs ml-1">%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Acompañantes</h4>
                  <div className="space-y-1">
                    {Object.entries(formData.membershipDiscounts.companion).map(([membership, discount]) => (
                      <div key={`companion-${membership}`} className="flex items-center">
                        <label className="text-xs w-16">{membership}:</label>
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => handleDiscountChange('companion', membership, e.target.value)}
                          min="0"
                          max="100"
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                        />
                        <span className="text-xs ml-1">%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de Itinerario */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Itinerario</h2>
          
          {formData.itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-4 p-4 border border-gray-200 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Día {day.day}</h3>
                <button
                  type="button"
                  onClick={() => removeArrayItem('itinerary', dayIndex)}
                  className="text-red-500 text-sm"
                >
                  Eliminar día
                </button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Número de día</label>
                  <input
                    type="number"
                    value={day.day}
                    onChange={(e) => handleArrayChange('itinerary', dayIndex, 'day', parseInt(e.target.value))}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Actividad {activityIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newItinerary = [...formData.itinerary]
                          newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter((_, i) => i !== activityIndex)
                          setFormData({...formData, itinerary: newItinerary})
                        }}
                        className="text-red-500 text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-700 mb-1">Hora</label>
                        <input
                          type="time"
                          value={activity.time}
                          onChange={(e) => {
                            const newItinerary = [...formData.itinerary]
                            newItinerary[dayIndex].activities[activityIndex].time = e.target.value
                            setFormData({...formData, itinerary: newItinerary})
                          }}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-700 mb-1">Descripción</label>
                        <input
                          type="text"
                          value={activity.description}
                          onChange={(e) => {
                            const newItinerary = [...formData.itinerary]
                            newItinerary[dayIndex].activities[activityIndex].description = e.target.value
                            setFormData({...formData, itinerary: newItinerary})
                          }}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    const newItinerary = [...formData.itinerary]
                    newItinerary[dayIndex].activities.push({
                      time: '08:00',
                      description: ''
                    })
                    setFormData({...formData, itinerary: newItinerary})
                  }}
                  className="text-blue-500 text-sm"
                >
                  + Añadir actividad
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('itinerary', {
              day: formData.itinerary.length + 1,
              activities: [{ time: '08:00', description: '' }]
            })}
            className="mt-2 bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm"
          >
            + Añadir día
          </button>
        </div>
        
        {/* Sección de Incluye */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Incluye</h2>
          
          {formData.includes.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="flex-grow grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleArrayChange('includes', index, 'item', e.target.value)}
                    placeholder="Elemento incluido"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.detail || ''}
                    onChange={(e) => handleArrayChange('includes', index, 'detail', e.target.value)}
                    placeholder="Detalle (opcional)"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('includes', index)}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('includes', { item: '', detail: '' })}
            className="mt-2 bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm"
          >
            + Añadir elemento
          </button>
        </div>
        
        {/* Secciones de listas simples (visitas, actividades, requisitos, recomendaciones) */}
        {['visits', 'activities', 'requirements', 'recommendations'].map((field) => (
          <div key={field} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {field === 'visits' && 'Lugares a Visitar'}
              {field === 'activities' && 'Actividades'}
              {field === 'requirements' && 'Requisitos'}
              {field === 'recommendations' && 'Recomendaciones'}
            </h2>
            
            {formData[field].map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field, index, null, e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(field, index)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem(field, '')}
              className="mt-2 bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm"
            >
              + Añadir elemento
            </button>
          </div>
        ))}
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Actualizar Evento
          </button>
        </div>
      </form>
    </div>
  )
}