import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, ChevronDown, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function TopBar({ title }) {
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const initials = admin?.name
    ? admin.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const goToRequests = () => { setNotifOpen(false); navigate('/requests') }
  const goToSettings = () => { setProfileOpen(false); navigate('/settings') }

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-6 gap-4 sticky top-0 z-20">
      <h1 className="page-header flex-1">{title}</h1>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search bookings, customers..."
          className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-cream w-64 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
          className="relative p-2 rounded-lg hover:bg-cream transition-colors"
        >
          <Bell size={19} className="text-text-muted" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-border rounded-xl shadow-lg z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold">Notifications</p>
              <button onClick={() => setNotifOpen(false)}><X size={15} className="text-text-muted" /></button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <p className="text-sm text-text-muted text-center py-6">No new notifications</p>
            </div>
            <button onClick={goToRequests} className="w-full text-center text-xs text-accent font-medium py-2.5 hover:bg-cream transition-colors rounded-b-xl">
              View all requests →
            </button>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-cream transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-text-primary leading-none">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-text-muted mt-0.5 capitalize">{admin?.role || 'Admin'}</p>
          </div>
          <ChevronDown size={14} className="text-text-muted hidden md:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 w-44 bg-white border border-border rounded-xl shadow-lg z-50 py-1">
            <button onClick={goToSettings} className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-cream transition-colors">Account Settings</button>
            <div className="border-t border-border my-1" />
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">Sign out</button>
          </div>
        )}
      </div>
    </header>
  )
}
