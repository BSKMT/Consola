import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CreateUser from './pages/users/CreateUser'
import EditUser from './pages/users/EditUser'
import UserList from './pages/users/UserList'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/edit/:documentNumber" element={<EditUser />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}