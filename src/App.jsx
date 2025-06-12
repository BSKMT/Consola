import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Loader from './components/ui/Loader'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {user ? (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </Suspense>
  )
}

export default App