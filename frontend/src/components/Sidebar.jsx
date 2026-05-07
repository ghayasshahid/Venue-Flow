import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, Calendar, Inbox,
  DollarSign, BarChart2, Settings, ChevronRight,
} from 'lucide-react'

const navItems = [
  { path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/manager/bookings', label: 'Bookings', icon: CalendarCheck },
  { path: '/manager/calendar', label: 'Calendar', icon: Calendar },
  { path: '/manager/requests', label: 'Requests', icon: Inbox },
  { path: '/manager/finance', label: 'Finance', icon: DollarSign },
  { path: '/manager/reports', label: 'Reports', icon: BarChart2 },
  { path: '/manager/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">VF</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Venue Flow</p>
            <p className="text-white/40 text-xs mt-0.5">Management Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname.startsWith(path)
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-sidebar-active text-white'
                  : 'text-white/50 hover:text-white hover:bg-sidebar-hover'
              }`}
            >
              <Icon size={17} className={active ? 'text-accent' : 'text-current'} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-accent" />}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-white/25 text-xs text-center">© 2024 Venue Flow</p>
      </div>
    </aside>
  )
}
