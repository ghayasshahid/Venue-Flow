import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AdminLayout from './layouts/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/bookings/Bookings'
import BookingDetails from './pages/bookings/BookingDetails'
import AddEditBooking from './pages/bookings/AddEditBooking'
import Calendar from './pages/Calendar'
import Requests from './pages/Requests'
import Finance from './pages/Finance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center text-text-muted text-sm">Loading…</div>
  return admin ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { admin, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center text-text-muted text-sm">Loading…</div>

  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/new" element={<AddEditBooking />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/bookings/:id/edit" element={<AddEditBooking />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
