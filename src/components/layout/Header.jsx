import {
  FaSignOutAlt,
} from "react-icons/fa"

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">BSKMT Console</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
          <button
            onClick={onLogout}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaSignOutAlt className="h-4 w-4 mr-1" />
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}