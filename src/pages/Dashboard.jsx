import { useState } from 'react'
import EndpointCard from '../components/dashboard/EndpointCard'
import RequestPanel from '../components/dashboard/RequestPanel'
import ResponseViewer from '../components/dashboard/ResponseViewer'

// Definición de endpoints basada en tu API
const endpoints = [
  {
    name: 'Obtener Todos los Proyectos',
    method: 'GET',
    path: '/proyectos',
    description: 'Lista todos los proyectos disponibles',
    requiresAuth: true
  },
  {
    name: 'Crear Nuevo Proyecto',
    method: 'POST',
    path: '/proyectos',
    description: 'Crea un nuevo proyecto',
    requiresAuth: true,
    sampleData: {
      nombre: 'Nombre del proyecto',
      descripcion: 'Descripción detallada',
      estado: 'activo'
    }
  },
  // Agrega más endpoints según tu API
]

export default function Dashboard() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [response, setResponse] = useState(null)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">API Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Endpoints</h3>
          <div className="space-y-3">
            {endpoints.map((endpoint) => (
              <EndpointCard
                key={`${endpoint.method}-${endpoint.path}`}
                endpoint={endpoint}
                isSelected={selectedEndpoint?.path === endpoint.path}
                onClick={() => {
                  setSelectedEndpoint(endpoint)
                  setResponse(null)
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {selectedEndpoint ? (
            <>
              <RequestPanel 
                endpoint={selectedEndpoint} 
                onResponse={setResponse} 
              />
              <ResponseViewer response={response} />
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Selecciona un endpoint para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}