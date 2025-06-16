import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CreateUser from './pages/users/CreateUser'
import EditUser from './pages/users/EditUser'
import UserList from './pages/users/UserList'
import CreateEvent from './pages/events/CreateEvent'
import EditEvent from './pages/events/EditEvent'
import EventList from './pages/events/EventList'

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
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="events/edit/:id" element={<EditEvent />} />
            <Route path="events" element={<EventList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}