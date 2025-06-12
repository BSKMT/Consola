import { NavLink } from 'react-router-dom'
import {
  FaDatabase,
  FaUser,
  FaGear,
  FaNewspaper
} from "react-icons/fa6"

const navigation = [
  { name: 'Endpoints', href: '/dashboard', icon: FaDatabase },
  { name: 'Usuarios', href: '/dashboard/users', icon: FaUser },
  { name: 'Documentación', href: '/dashboard/docs', icon: FaNewspaper },
  { name: 'Configuración', href: '/dashboard/settings', icon: FaGear },
]

export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-bskmt-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    location.pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}