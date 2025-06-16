// src/components/Sidebar.jsx
import { Link } from 'react-router-dom'
import { 
  FaMotorcycle, 
  FaUsers, 
  FaCog, 
  FaUserPlus,
  FaUserEdit,
  FaList,
  FaCalendarAlt,
  FaCalendarPlus,
  FaCalendarCheck
} from 'react-icons/fa'

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">BSKMT Dashboard</h1>
      </div>
      <nav className="mt-4">
        {/* Menú principal */}
        <Link to="/" className="flex items-center p-3 hover:bg-gray-700">
          <FaMotorcycle className="mr-2" /> Motos
        </Link>
        
        {/* Sección de Usuarios con submenú */}
        <div className="group">
          <div className="flex items-center p-3 hover:bg-gray-700 cursor-pointer">
            <FaUsers className="mr-2" /> Gestión de Usuarios
          </div>
          <div className="ml-4 hidden group-hover:block">
            <Link 
              to="/users" 
              className="flex items-center p-2 hover:bg-gray-600 rounded"
            >
              <FaList className="mr-2 text-sm" /> Lista de Usuarios
            </Link>
            <Link 
              to="/users/create" 
              className="flex items-center p-2 hover:bg-gray-600 rounded"
            >
              <FaUserPlus className="mr-2 text-sm" /> Crear Usuario
            </Link>
          </div>
        </div>

        {/* Sección de Eventos con submenú */}
        <div className="group">
          <div className="flex items-center p-3 hover:bg-gray-700 cursor-pointer">
            <FaCalendarAlt className="mr-2" /> Gestión de Eventos
          </div>
          <div className="ml-4 hidden group-hover:block">
            <Link 
              to="/events" 
              className="flex items-center p-2 hover:bg-gray-600 rounded"
            >
              <FaList className="mr-2 text-sm" /> Lista de Eventos
            </Link>
            <Link 
              to="/events/create" 
              className="flex items-center p-2 hover:bg-gray-600 rounded"
            >
              <FaCalendarPlus className="mr-2 text-sm" /> Crear Evento
            </Link>
            <Link 
              to="/events/update" 
              className="flex items-center p-2 hover:bg-gray-600 rounded"
            >
              <FaCalendarCheck className="mr-2 text-sm" /> Actualizar Evento
            </Link>
          </div>
        </div>

        {/* Otras secciones */}
        <Link to="/settings" className="flex items-center p-3 hover:bg-gray-700">
          <FaCog className="mr-2" /> Configuración
        </Link>
      </nav>
    </div>
  )
}