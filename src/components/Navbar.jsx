export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Panel de Control</h2>
        <div className="flex items-center space-x-4">
          <span>Admin</span>
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