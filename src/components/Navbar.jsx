import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Panel de Control</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Cerrar Sesión
          </button>
          <img 
            src="https://via.placeholder.com/40" 
            alt="Avatar" 
            className="rounded-full"
          />
        </div>
      </div>
    </header>
  )
}