import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/user/Home";
import AvailableDates from "./pages/user/AvailableDates";
import RequestBooking from "./pages/user/RequestBooking";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/bookings/Bookings";
import BookingDetails from "./pages/bookings/BookingDetails";
import AddEditBooking from "./pages/bookings/AddEditBooking";
import Calendar from "./pages/Calendar";
import Requests from "./pages/Requests";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-text-muted text-sm">
        Loading…
      </div>
    );
  return admin ? children : <Navigate to="/manager/login" replace />;
}

function AppRoutes() {
  const { admin, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-text-muted text-sm">
        Loading…
      </div>
    );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/available-dates" element={<AvailableDates />} />
      <Route path="/request-booking" element={<RequestBooking />} />
      <Route
        path="/manager"
        element={<Navigate to="/manager/dashboard" replace />}
      />
      <Route
        path="/manager/login"
        element={
          admin ? <Navigate to="/manager/dashboard" replace /> : <Login />
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/manager/dashboard" element={<Dashboard />} />
        <Route path="/manager/bookings" element={<Bookings />} />
        <Route path="/manager/bookings/new" element={<AddEditBooking />} />
        <Route path="/manager/bookings/:id" element={<BookingDetails />} />
        <Route path="/manager/bookings/:id/edit" element={<AddEditBooking />} />
        <Route path="/manager/calendar" element={<Calendar />} />
        <Route path="/manager/requests" element={<Requests />} />
        <Route path="/manager/finance" element={<Finance />} />
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/manager/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
