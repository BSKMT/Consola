import { useAuth } from '../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const { currentUser, logoutUser } = useAuth()

  const handleLogout = () => {
    logoutUser()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu button and title */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-3"
            >
              <span className="sr-only">Abrir menú</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              Panel de Control
            </h2>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            {currentUser && (
              <div className="hidden sm:flex sm:items-center sm:space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser.role || 'Administrador'}
                  </p>
                </div>
              </div>
            )}

            {/* Avatar */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.firstName?.charAt(0) || 'A'}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Mobile user info */}
      {currentUser && (
        <div className="sm:hidden px-4 pb-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 pt-3">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {currentUser.firstName?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser.role || 'Administrador'}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
