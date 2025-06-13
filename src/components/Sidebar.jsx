import { Link } from 'react-router-dom' // Faltaba esta importación
import { FaMotorcycle, FaUsers, FaCog, FaUserPlus } from 'react-icons/fa'

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">BSKMT Dashboard</h1>
      </div>
      <nav className="mt-4">
        <Link to="/" className="flex items-center p-3 hover:bg-gray-700">
          <FaMotorcycle className="mr-2" /> Motos
        </Link>
        <Link to="/users" className="flex items-center p-3 hover:bg-gray-700">
          <FaUsers className="mr-2" /> Usuarios
        </Link>
        <Link to="/settings" className="flex items-center p-3 hover:bg-gray-700">
          <FaCog className="mr-2" /> Configuración
        </Link>
        <Link to="/users/create" className="flex items-center p-3 hover:bg-gray-700">
          <FaUserPlus className="mr-2" /> Crear Usuario
        </Link>
      </nav>
    </div>
  )
}