import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { bookings, halls } from '../data/mockData'

const eventColors = {
  'Royal Grand Hall': 'bg-amber-500',
  'Crystal Ballroom': 'bg-blue-500',
  'Garden Pavilion': 'bg-green-500',
  'Pearl Suite': 'bg-purple-500',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Calendar() {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDay, setSelectedDay] = useState(null)
  const [hallFilter, setHallFilter] = useState('all')

  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const pad = (n) => String(n).padStart(2, '0')

  const getBookingsForDay = (day) => {
    const dateStr = `${current.year}-${pad(current.month + 1)}-${pad(day)}`
    return bookings.filter(b => b.date === dateStr && (hallFilter === 'all' || b.hall === hallFilter))
  }

  const prevMonth = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  const nextMonth = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })

  const selectedBookings = selectedDay ? getBookingsForDay(selectedDay) : []

  return (
    <div className="space-y-5">
      {/* Legend + Filters */}
      <div className="card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {halls.map(h => (
            <button
              key={h.id}
              onClick={() => setHallFilter(f => f === h.name ? 'all' : h.name)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${hallFilter === h.name ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text-muted hover:border-accent/40'}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${eventColors[h.name]}`} />
              {h.name}
            </button>
          ))}
        </div>
        <button onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })} className="btn-secondary text-xs py-1.5">
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
          <p className="font-semibold text-text-primary">{MONTHS[current.month]} {current.year}</p>
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
                    <div key={b.id} className={`${eventColors[b.hall] || 'bg-gray-400'} text-white text-xs rounded px-1.5 py-0.5 truncate`}>
                      {b.hall.split(' ')[0]}
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
                <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-cream transition-colors">
                  <div className={`w-1 self-stretch rounded-full ${eventColors[b.hall] || 'bg-gray-400'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary text-sm">{b.hall}</p>
                    <p className="text-xs text-text-muted">{b.eventType} · {b.time} · {b.customer} · {b.guests} guests</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.paymentStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
