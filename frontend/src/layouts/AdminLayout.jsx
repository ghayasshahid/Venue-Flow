import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const pageTitles = {
  '/manager/dashboard': 'Dashboard',
  '/manager/bookings': 'Bookings',
  '/manager/calendar': 'Calendar',
  '/manager/requests': 'Booking Requests',
  '/manager/finance': 'Finance',
  '/manager/reports': 'Reports & Logs',
  '/manager/settings': 'Settings',
}

export default function AdminLayout() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const path = '/' + segments[1] + '/' + segments[2]
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
