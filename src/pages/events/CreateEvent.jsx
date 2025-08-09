import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import http from '../../lib/http'
import { toast } from 'react-toastify'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventData, setEventData] = useState({
    // Información básica
    name: '',
    description: '',
    mainImage: '',
    secondaryImages: [],
    
    // Fechas y horarios
    startDate: '',
    endDate: '',
    meetupTime: '08:00',
    departureTime: '09:00',
    durationDays: 1,
    generalRegistrationDates: {
      preSaleStart: '',
      preSaleEnd: '',
      generalSaleStart: '',
      generalSaleEnd: ''
    },
    
    // Ubicaciones
    departureLocation: {
      address: '',
      city: '',
      coordinates: { lat: 0, lng: 0 }
    },
    stayLocation: {
      address: '',
      city: '',
      coordinates: { lat: 0, lng: 0 }
    },
    arrivalLocation: {
      address: '',
      city: '',
      coordinates: { lat: 0, lng: 0 }
    },
    
    // Precios
    basePriceRider: 0,
    basePriceCompanion: 0,
    membershipDiscounts: {
      rider: {
        friend: 0,
        rider: 25,
        pro: 50,
        volunteer: 50,
        leader: 50
      },
      companion: {
        friend: 0,
        rider: 15,
        pro: 25,
        volunteer: 35,
        leader: 50
      }
    },
    
    // Detalles del evento
    itinerary: [{ day: 1, activities: [{ time: '09:00', description: '' }] }],
    includes: [{ item: '', detail: '' }],
    visits: [''],
    activities: [''],
    requirements: [''],
    recommendations: [''],
    additionalInformation: '',
    
    // Clasificación del evento
    difficultyLevel: 'medium',
    eventType: 'Ride',
    internalEventType: 'Road',
    eventPurpose: 'Community',
    
    // Organización
    organizer: null,
    maxParticipants: 20,
    pointsAwarded: {
      rider: 0,
      companion: 0
    },
    
    // Estados
    preSaleStatus: 'upcoming',
    generalSaleStatus: 'upcoming',
    eventStatus: 'confirmed',
    
    // Registros
    registeredParticipants: 0,
    registrations: [],
    
    // Notificaciones
    notificationsSent: [],
    
    // Metadata
    createdBy: null,
    updatedBy: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Manejar campos anidados
    if (name.includes('.')) {
      const [parent, child, subChild, subSubChild] = name.split('.')
      
      if (subSubChild) {
        setEventData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: {
                ...prev[parent][child][subChild],
                [subSubChild]: value
              }
            }
          }
        }))
      } else if (subChild) {
        setEventData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }))
      } else {
        setEventData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }))
      }
    } else {
      setEventData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleArrayChange = (arrayName, index, field, value) => {
    setEventData(prev => {
      const newArray = [...prev[arrayName]]
      newArray[index][field] = value
      return { ...prev, [arrayName]: newArray }
    })
  }

  const handleAddArrayItem = (arrayName, template) => {
    setEventData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }))
  }

  const handleRemoveArrayItem = (arrayName, index) => {
    setEventData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }))
  }

  const handleSimpleArrayChange = (arrayName, index, value) => {
    setEventData(prev => {
      const newArray = [...prev[arrayName]]
      newArray[index] = value
      return { ...prev, [arrayName]: newArray }
    })
  }

  const handleAddSimpleArrayItem = (arrayName, defaultValue = '') => {
    setEventData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultValue]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await http.postJson('/events', eventData)
      toast.success('Evento creado exitosamente!')
      navigate('/')
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(error.message || 'Error al crear el evento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Evento</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección 1: Información Básica */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Evento *
              </label>
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento *
              </label>
              <select
                name="eventType"
                value={eventData.eventType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen Principal (URL) *
              </label>
              <input
                type="url"
                name="mainImage"
                value={eventData.mainImage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes Secundarias (URLs)
              </label>
              {eventData.secondaryImages.map((img, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleSimpleArrayChange('secondaryImages', index, e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('secondaryImages', index)}
                    className="ml-2 px-3 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddSimpleArrayItem('secondaryImages')}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                + Añadir Imagen
              </button>
            </div>
          </div>
        </div>
        
        {/* Sección 2: Fechas y Horarios */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Fechas y Horarios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="startDate"
                value={eventData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin *
              </label>
              <input
                type="date"
                name="endDate"
                value={eventData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Encuentro *
              </label>
              <input
                type="time"
                name="meetupTime"
                value={eventData.meetupTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Salida *
              </label>
              <input
                type="time"
                name="departureTime"
                value={eventData.departureTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (días) *
              </label>
              <input
                type="number"
                name="durationDays"
                value={eventData.durationDays}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Nuevos campos de fechas de registro */}
          <h3 className="text-lg font-semibold mt-6 mb-4">Fechas de Registro</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inicio Pre-Venta *
              </label>
              <input
                type="date"
                name="generalRegistrationDates.preSaleStart"
                value={eventData.generalRegistrationDates.preSaleStart}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin Pre-Venta *
              </label>
              <input
                type="date"
                name="generalRegistrationDates.preSaleEnd"
                value={eventData.generalRegistrationDates.preSaleEnd}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inicio Venta General *
              </label>
              <input
                type="date"
                name="generalRegistrationDates.generalSaleStart"
                value={eventData.generalRegistrationDates.generalSaleStart}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin Venta General *
              </label>
              <input
                type="date"
                name="generalRegistrationDates.generalSaleEnd"
                value={eventData.generalRegistrationDates.generalSaleEnd}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Sección 3: Ubicaciones */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ubicaciones</h2>
          
          <div className="space-y-4">
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Punto de Partida *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="departureLocation.address"
                    value={eventData.departureLocation.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    name="departureLocation.city"
                    value={eventData.departureLocation.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    name="departureLocation.coordinates.lat"
                    value={eventData.departureLocation.coordinates.lat}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    name="departureLocation.coordinates.lng"
                    value={eventData.departureLocation.coordinates.lng}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Lugar de Estadía</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="stayLocation.address"
                    value={eventData.stayLocation.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    name="stayLocation.city"
                    value={eventData.stayLocation.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    name="stayLocation.coordinates.lat"
                    value={eventData.stayLocation.coordinates.lat}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    name="stayLocation.coordinates.lng"
                    value={eventData.stayLocation.coordinates.lng}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Punto de Llegada</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="arrivalLocation.address"
                    value={eventData.arrivalLocation.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    name="arrivalLocation.city"
                    value={eventData.arrivalLocation.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    name="arrivalLocation.coordinates.lat"
                    value={eventData.arrivalLocation.coordinates.lat}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    name="arrivalLocation.coordinates.lng"
                    value={eventData.arrivalLocation.coordinates.lng}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección 4: Precios */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Precios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Base (Rider) *
              </label>
              <input
                type="number"
                name="basePriceRider"
                value={eventData.basePriceRider}
                onChange={handleChange}
                min="0"
                max="10000000"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Base (Companion) *
              </label>
              <input
                type="number"
                name="basePriceCompanion"
                value={eventData.basePriceCompanion}
                onChange={handleChange}
                min="0"
                max="10000000"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          
          <h3 className="font-medium mt-4 mb-2">Descuentos por Membresía (Rider)</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Friend</label>
              <input
                type="number"
                name="membershipDiscounts.rider.friend"
                value={eventData.membershipDiscounts.rider.friend}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Rider</label>
              <input
                type="number"
                name="membershipDiscounts.rider.rider"
                value={eventData.membershipDiscounts.rider.rider}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Pro</label>
              <input
                type="number"
                name="membershipDiscounts.rider.pro"
                value={eventData.membershipDiscounts.rider.pro}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Volunteer</label>
              <input
                type="number"
                name="membershipDiscounts.rider.volunteer"
                value={eventData.membershipDiscounts.rider.volunteer}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Leader</label>
              <input
                type="number"
                name="membershipDiscounts.rider.leader"
                value={eventData.membershipDiscounts.rider.leader}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <h3 className="font-medium mt-4 mb-2">Descuentos por Membresía (Companion)</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Friend</label>
              <input
                type="number"
                name="membershipDiscounts.companion.friend"
                value={eventData.membershipDiscounts.companion.friend}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Rider</label>
              <input
                type="number"
                name="membershipDiscounts.companion.rider"
                value={eventData.membershipDiscounts.companion.rider}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Pro</label>
              <input
                type="number"
                name="membershipDiscounts.companion.pro"
                value={eventData.membershipDiscounts.companion.pro}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Volunteer</label>
              <input
                type="number"
                name="membershipDiscounts.companion.volunteer"
                value={eventData.membershipDiscounts.companion.volunteer}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Leader</label>
              <input
                type="number"
                name="membershipDiscounts.companion.leader"
                value={eventData.membershipDiscounts.companion.leader}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Sección 5: Detalles del Evento */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Detalles del Evento</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Itinerario</h3>
              {eventData.itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="mb-4 border p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <h4>Día {day.day}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('itinerary', dayIndex)}
                      className="text-red-500"
                    >
                      Eliminar día
                    </button>
                  </div>
                  
                  <input
                    type="number"
                    value={day.day}
                    onChange={(e) => handleArrayChange('itinerary', dayIndex, 'day', e.target.value)}
                    min="1"
                    className="w-20 p-1 border rounded mb-3"
                  />
                  
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="mb-3 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center mb-1">
                        <input
                          type="time"
                          value={activity.time}
                          onChange={(e) => {
                            const newActivities = [...day.activities]
                            newActivities[actIndex].time = e.target.value
                            handleArrayChange('itinerary', dayIndex, 'activities', newActivities)
                          }}
                          className="p-1 border rounded mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newActivities = day.activities.filter((_, i) => i !== actIndex)
                            handleArrayChange('itinerary', dayIndex, 'activities', newActivities)
                          }}
                          className="text-red-500 text-sm"
                        >
                          Eliminar actividad
                        </button>
                      </div>
                      <textarea
                        value={activity.description}
                        onChange={(e) => {
                          const newActivities = [...day.activities]
                          newActivities[actIndex].description = e.target.value
                          handleArrayChange('itinerary', dayIndex, 'activities', newActivities)
                        }}
                        className="w-full p-2 border rounded"
                        placeholder="Descripción de la actividad"
                      />
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newActivities = [...day.activities, { time: '09:00', description: '' }]
                      handleArrayChange('itinerary', dayIndex, 'activities', newActivities)
                    }}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    + Añadir Actividad
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => handleAddArrayItem('itinerary', { 
                  day: eventData.itinerary.length + 1, 
                  activities: [{ time: '09:00', description: '' }] 
                })}
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
              >
                + Añadir Día
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Incluye</h3>
              {eventData.includes.map((item, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => {
                      const newIncludes = [...eventData.includes]
                      newIncludes[index].item = e.target.value
                      setEventData({ ...eventData, includes: newIncludes })
                    }}
                    placeholder="Item"
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <input
                    type="text"
                    value={item.detail}
                    onChange={(e) => {
                      const newIncludes = [...eventData.includes]
                      newIncludes[index].detail = e.target.value
                      setEventData({ ...eventData, includes: newIncludes })
                    }}
                    placeholder="Detalle"
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('includes', index)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem('includes', { item: '', detail: '' })}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                + Añadir Inclusión
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Visitas</h3>
              {eventData.visits.map((visit, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={visit}
                    onChange={(e) => handleSimpleArrayChange('visits', index, e.target.value)}
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('visits', index)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddSimpleArrayItem('visits')}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                + Añadir Visita
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Actividades</h3>
              {eventData.activities.map((activity, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => handleSimpleArrayChange('activities', index, e.target.value)}
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('activities', index)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddSimpleArrayItem('activities')}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                + Añadir Actividad
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Requisitos</h3>
              {eventData.requirements.map((requirement, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleSimpleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('requirements', index)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddSimpleArrayItem('requirements')}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                + Añadir Requisito
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Recomendaciones</h3>
              {eventData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={recommendation}
                    onChange={(e) => handleSimpleArrayChange('recommendations', index, e.target.value)}
                    className="flex-1 p-2 border rounded mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('recommendations', index)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddSimpleArrayItem('recommendations')}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                + Añadir Recomendación
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Información Adicional
              </label>
              <textarea
                name="additionalInformation"
                value={eventData.additionalInformation}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
          </div>
        </div>
        
        {/* Sección 6: Clasificación del Evento */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Clasificación del Evento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Dificultad
              </label>
              <select
                name="difficultyLevel"
                value={eventData.difficultyLevel}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Interno
              </label>
              <select
                name="internalEventType"
                value={eventData.internalEventType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Road">Road</option>
                <option value="We come and go">We come and go</option>
                <option value="Tour">Tour</option>
                <option value="Coffee or aromatic">Coffee or aromatic</option>
                <option value="Direct">Direct</option>
                <option value="Training">Training</option>
                <option value="Adventure">Adventure</option>
                <option value="Enduro">Enduro</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Propósito del Evento *
              </label>
              <select
                name="eventPurpose"
                value={eventData.eventPurpose}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Community">Community</option>
                <option value="Cultural">Cultural</option>
                <option value="Tourism">Tourism</option>
                <option value="Social">Social</option>
                <option value="Training">Training</option>
                <option value="Education">Education</option>
                <option value="Competition">Competition</option>
                <option value="Charity">Charity</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Sección 7: Organización */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Organización</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de Participantes *
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={eventData.maxParticipants}
                onChange={handleChange}
                min="1"
                max="500"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Pre-Venta
              </label>
              <select
                name="preSaleStatus"
                value={eventData.preSaleStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="available">Disponible</option>
                <option value="upcoming">Próximamente</option>
                <option value="closed">Cerrado</option>
                <option value="sold-out">Agotado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Venta General
              </label>
              <select
                name="generalSaleStatus"
                value={eventData.generalSaleStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="available">Disponible</option>
                <option value="upcoming">Próximamente</option>
                <option value="closed">Cerrado</option>
                <option value="sold-out">Agotado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado del Evento
              </label>
              <select
                name="eventStatus"
                value={eventData.eventStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="confirmed">Confirmado</option>
                <option value="postponed">Aplazado</option>
                <option value="canceled">Cancelado</option>
                <option value="completed">Completado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntos Otorgados (Rider)
              </label>
              <input
                type="number"
                name="pointsAwarded.rider"
                value={eventData.pointsAwarded.rider}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntos Otorgados (Companion)
              </label>
              <input
                type="number"
                name="pointsAwarded.companion"
                value={eventData.pointsAwarded.companion}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creando Evento...' : 'Crear Evento'}
          </button>
        </div>
      </form>
    </div>
  )
}