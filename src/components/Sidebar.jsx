import { FaMotorcycle, FaUsers, FaCog } from 'react-icons/fa'

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">BSKMT Dashboard</h1>
      </div>
      <nav className="mt-4">
        <a href="/" className="flex items-center p-3 hover:bg-gray-700">
          <FaMotorcycle className="mr-2" /> Motos
        </a>
        <a href="/users" className="flex items-center p-3 hover:bg-gray-700">
          <FaUsers className="mr-2" /> Usuarios
        </a>
        <a href="/settings" className="flex items-center p-3 hover:bg-gray-700">
          <FaCog className="mr-2" /> Configuración
        </a>
      </nav>
    </div>
  )
}