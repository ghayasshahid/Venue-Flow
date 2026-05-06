import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/bookings': 'Bookings',
  '/calendar': 'Calendar',
  '/requests': 'Booking Requests',
  '/finance': 'Finance',
  '/reports': 'Reports & Logs',
  '/settings': 'Settings',
}

export default function AdminLayout() {
  const location = useLocation()
  const path = '/' + location.pathname.split('/')[1]
  const title = pageTitles[path] || 'Venue Flow'

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60">
        <TopBar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
