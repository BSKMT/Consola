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
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Rutas de gestión de usuarios */}
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:documentNumber" element={<UserProfile />} />
          <Route path="users/:documentNumber/edit" element={<UserForm />} />
          
          {/* Otras rutas protegidas pueden agregarse aquí */}
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App