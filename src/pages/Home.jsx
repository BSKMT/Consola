export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard de BSKMT</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjetas de estadísticas */}
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Motos</h3>
          <p className="text-2xl">24</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Usuarios</h3>
          <p className="text-2xl">150</p>
        </div>
      </div>
    </div>
  )
}