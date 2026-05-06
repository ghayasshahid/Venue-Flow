import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/bookings/Bookings'
import BookingDetails from './pages/bookings/BookingDetails'
import AddEditBooking from './pages/bookings/AddEditBooking'
import Calendar from './pages/Calendar'
import Requests from './pages/Requests'
import Finance from './pages/Finance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AdminLayout />}>
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
    </BrowserRouter>
  )
}
