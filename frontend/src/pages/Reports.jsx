import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { getOverviewReport, getHallUtilization, getEventTypeReport, getMonthlyRevenue } from '../lib/api'

const exportCSV = (headers, rows, filename) => {
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv,' + encodeURIComponent(csv)
  a.download = filename
  a.click()
}

export default function Reports() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [overview, setOverview] = useState(null)
  const [hallUtilization, setHallUtilization] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getOverviewReport(year),
      getHallUtilization(),
      getEventTypeReport(),
      getMonthlyRevenue(),
    ]).then(([ovRes, hallRes, evRes, revRes]) => {
      setOverview(ovRes.data)
      setHallUtilization(hallRes.data)
      setEventTypes(evRes.data)
      setMonthlyRevenue(revRes.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [year])

  const totalBookings = overview?.totalBookings || 0
  const totalRevenue = overview?.totalRevenue || 0
  const avgPerBooking = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0

  // Booking trends from monthly data in overview
  const bookingTrends = overview?.monthly || []
  const maxHallBookings = Math.max(...hallUtilization.map(h => h.bookings), 1)

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-sidebar text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>
      )}

      {/* Year selector */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-text-muted font-medium">Year:</p>
        {[currentYear - 1, currentYear, currentYear + 1].map(y => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${year === y ? 'bg-accent text-white' : 'text-text-muted hover:bg-cream'}`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: `Total Revenue (${year})`, value: loading ? '…' : `PKR ${(totalRevenue / 1000000).toFixed(2)}M` },
          { label: 'Total Bookings', value: loading ? '…' : totalBookings },
          { label: 'Completed Events', value: loading ? '…' : overview?.completedBookings ?? '…' },
          { label: 'Avg per Booking', value: loading ? '…' : `PKR ${(avgPerBooking / 1000).toFixed(0)}K` },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-text-muted text-xs uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Booking Trends */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-text-primary">Booking Trends</p>
            <button
              onClick={() => exportCSV(
                ['Month', 'Bookings', 'Guests'],
                bookingTrends.map(r => [r.month, r.bookings, r.guests]),
                'booking-trends.csv'
              )}
              className="btn-secondary text-xs py-1.5 flex items-center gap-1.5"
            >
              <Download size={12} /> Export
            </button>
          </div>
          {bookingTrends.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-text-muted text-sm">
              {loading ? 'Loading…' : 'No data for this year.'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bookingTrends} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DC" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} width={25} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E5DC', fontSize: 12 }} />
                <Line type="monotone" dataKey="bookings" stroke="#C8A96E" strokeWidth={2.5} dot={{ fill: '#C8A96E', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Hall Utilization */}
        <div className="card">
          <p className="font-semibold text-text-primary mb-4">Hall Utilization</p>
          {loading ? (
            <p className="text-sm text-text-muted">Loading…</p>
          ) : hallUtilization.length === 0 ? (
            <p className="text-sm text-text-muted">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {hallUtilization.map((h, i) => (
                <div key={h._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-text-primary">#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{h.hallName || '—'}</p>
                    <div className="h-1.5 bg-cream-dark rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${Math.max((h.bookings / maxHallBookings) * 100, 4)}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-text-muted flex-shrink-0">{h.bookings} events</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Type Breakdown */}
      <div className="card">
        <p className="font-semibold text-text-primary mb-4">Bookings by Event Type</p>
        {loading ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : eventTypes.length === 0 ? (
          <p className="text-sm text-text-muted">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={eventTypes} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="eventType" type="category" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                formatter={(v, name) => [v, name === 'count' ? 'Bookings' : name]}
                contentStyle={{ borderRadius: 8, border: '1px solid #E8E5DC', fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#C8A96E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue trend table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="font-semibold text-text-primary">Monthly Revenue — {year}</p>
          <button
            onClick={() => exportCSV(
              ['Month', 'Revenue (PKR)'],
              monthlyRevenue.map(r => [r.month, r.revenue]),
              `revenue-${year}.csv`
            )}
            className="btn-secondary text-xs py-1.5 flex items-center gap-1.5"
          >
            <Download size={13} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/60">
              <tr>
                {['Month', 'Revenue', 'Bookings', 'Guests'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookingTrends.length === 0 ? (
                <tr><td colSpan={4} className="table-td text-center text-text-muted py-10">
                  {loading ? 'Loading…' : 'No data for this year.'}
                </td></tr>
              ) : bookingTrends.map((row, i) => {
                const revRow = monthlyRevenue.find(r => r.month === row.month)
                return (
                  <tr key={i} className="hover:bg-cream/40 transition-colors">
                    <td className="table-td font-medium">{row.month}</td>
                    <td className="table-td text-green-600 font-medium">
                      PKR {(revRow?.revenue || 0).toLocaleString()}
                    </td>
                    <td className="table-td">{row.bookings}</td>
                    <td className="table-td text-text-muted">{row.guests}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
