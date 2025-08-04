import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Sidebar() {
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({
    users: false,
    events: false
  })

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const isParentActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path))
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">
          BSKMT Dashboard
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Panel de Administración
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Dashboard */}
        <Link 
          to="/" 
          className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive('/') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
          Dashboard
        </Link>
        
        {/* Gestión de Usuarios */}
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu('users')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
              isParentActive(['/users']) 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
              Gestión de Usuarios
            </div>
            <span className={`transform transition-transform duration-200 ${
              openMenus.users ? 'rotate-90' : ''
            }`}>
              ▶
            </span>
          </button>
          
          {openMenus.users && (
            <div className="ml-6 space-y-1">
              <Link 
                to="/users" 
                className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/users') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-current rounded-full mr-3"></span>
                Lista de Usuarios
              </Link>
              <Link 
                to="/users/create" 
                className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/users/create') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-current rounded-full mr-3"></span>
                Crear Usuario
              </Link>
            </div>
          )}
        </div>

        {/* Gestión de Eventos */}
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu('events')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
              isParentActive(['/events']) 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <div className="flex items-center">
              <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
              Gestión de Eventos
            </div>
            <span className={`transform transition-transform duration-200 ${
              openMenus.events ? 'rotate-90' : ''
            }`}>
              ▶
            </span>
          </button>
          
          {openMenus.events && (
            <div className="ml-6 space-y-1">
              <Link 
                to="/events" 
                className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/events') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-current rounded-full mr-3"></span>
                Lista de Eventos
              </Link>
              <Link 
                to="/events/create" 
                className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/events/create') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-current rounded-full mr-3"></span>
                Crear Evento
              </Link>
            </div>
          )}
        </div>

        {/* Configuración */}
        <Link 
          to="/settings" 
          className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive('/settings') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
          Configuración
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          © 2024 BSKMT Dashboard
        </p>
      </div>
    </div>
  )
}
