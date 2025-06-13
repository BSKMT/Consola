import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/ui/Loader'
import UserList from './components/users/UserList'
import UserForm from './components/users/UserForm'
import UserProfile from './components/users/UserProfile'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Rutas con layout */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Gestión de usuarios */}
            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="new" element={<UserForm />} />
              <Route path=":documentNumber" element={<UserProfile />} />
              <Route path=":documentNumber/edit" element={<UserForm />} />
            </Route>
            
            {/* Otras rutas pueden agregarse aquí */}
          </Route>
        </Route>

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={
          <ProtectedRoute>
            <Dashboard /> {/* O puedes crear un componente NotFound */}
          </ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  )
}

export default App