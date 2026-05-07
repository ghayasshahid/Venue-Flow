import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getBookings, getHalls } from '../lib/api'

const HALL_COLORS = [
  'bg-amber-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Calendar() {
  const navigate = useNavigate()
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDay, setSelectedDay] = useState(null)
  const [hallFilter, setHallFilter] = useState('all')
  const [bookings, setBookings] = useState([])
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)

  // Build a color map keyed by hall _id
  const hallColorMap = {}
  halls.forEach((h, i) => { hallColorMap[h._id] = HALL_COLORS[i % HALL_COLORS.length] })

  const hallColorByName = {}
  halls.forEach((h, i) => { hallColorByName[h.name] = HALL_COLORS[i % HALL_COLORS.length] })

  useEffect(() => {
    getHalls().then(r => setHalls(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const year = current.year
    const month = current.month
    const dateFrom = new Date(year, month, 1).toISOString().split('T')[0]
    const dateTo = new Date(year, month + 1, 0).toISOString().split('T')[0]

    getBookings({ dateFrom, dateTo, limit: 100 })
      .then(r => setBookings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [current])

  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()

  const getBookingsForDay = (day) => {
    return bookings.filter(b => {
      const d = new Date(b.date)
      const matchDay = d.getUTCFullYear() === current.year &&
                       d.getUTCMonth() === current.month &&
                       d.getUTCDate() === day
      const matchHall = hallFilter === 'all' || (b.hall?._id === hallFilter || b.hall === hallFilter)
      return matchDay && matchHall
    })
  }

  const prevMonth = () => {
    setSelectedDay(null)
    setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  }
  const nextMonth = () => {
    setSelectedDay(null)
    setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })
  }

  const selectedBookings = selectedDay ? getBookingsForDay(selectedDay) : []

  const getColor = (b) => {
    const hallId = b.hall?._id || b.hall
    return hallColorMap[hallId] || hallColorByName[b.hallName] || 'bg-gray-400'
  }

  const getHallName = (b) => b.hall?.name || b.hallName || '—'

  return (
    <div className="space-y-5">
      {/* Legend + Filters */}
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setHallFilter('all')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${hallFilter === 'all' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text-muted hover:border-accent/40'}`}
          >
            All Halls
          </button>
          {halls.map((h, i) => (
            <button
              key={h._id}
              onClick={() => setHallFilter(f => f === h._id ? 'all' : h._id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${hallFilter === h._id ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text-muted hover:border-accent/40'}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${HALL_COLORS[i % HALL_COLORS.length]}`} />
              {h.name}
            </button>
          ))}
        </div>
        <button onClick={() => { setCurrent({ year: today.getFullYear(), month: today.getMonth() }); setSelectedDay(null) }} className="btn-secondary text-xs py-1.5">
          Today
        </button>
      </div>

      {/* Calendar */}
      <div className="card p-0 overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <button onClick={prevMonth} className="p-1.5 hover:bg-cream rounded-lg transition-colors">
            <ChevronLeft size={18} className="text-text-muted" />
          </button>
          <p className="font-semibold text-text-primary">
            {MONTHS[current.month]} {current.year}
            {loading && <span className="ml-2 text-xs text-text-muted font-normal">Loading…</span>}
          </p>
          <button onClick={nextMonth} className="p-1.5 hover:bg-cream rounded-lg transition-colors">
            <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map(d => (
            <div key={d} className="py-2.5 text-center text-xs font-semibold text-text-muted uppercase tracking-wide">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24 border-r border-b border-border bg-cream/30" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dayBookings = getBookingsForDay(day)
            const isToday = day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()
            const isSelected = day === selectedDay
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`min-h-24 border-r border-b border-border p-2 cursor-pointer transition-colors ${isSelected ? 'bg-accent/5' : 'hover:bg-cream/60'}`}
              >
                <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-medium mb-1 ${isToday ? 'bg-accent text-white' : 'text-text-primary'}`}>
                  {day}
                </span>
                <div className="space-y-0.5">
                  {dayBookings.slice(0, 2).map(b => (
                    <div key={b._id} className={`${getColor(b)} text-white text-xs rounded px-1.5 py-0.5 truncate`}>
                      {getHallName(b).split(' ')[0]}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <p className="text-xs text-text-muted font-medium">+{dayBookings.length - 2} more</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Day detail panel */}
      {selectedDay && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-text-primary">
              {MONTHS[current.month]} {selectedDay}, {current.year}
            </p>
            <button onClick={() => setSelectedDay(null)}>
              <X size={16} className="text-text-muted hover:text-text-primary" />
            </button>
          </div>
          {selectedBookings.length === 0 ? (
            <p className="text-sm text-text-muted">No bookings on this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedBookings.map(b => (
                <div
                  key={b._id}
                  onClick={() => navigate(`/manager/bookings/${b._id}`)}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-cream transition-colors cursor-pointer"
                >
                  <div className={`w-1 self-stretch rounded-full ${getColor(b)}`} />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary text-sm">{getHallName(b)}</p>
                    <p className="text-xs text-text-muted">
                      {b.eventType} · {b.time} · {b.customer?.name} · {b.guests} guests
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {b.paymentStatus}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${b.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
