import { useState } from 'react'
import { Download } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { bookings, monthlyRevenue, wasteLogs, menuPackages } from '../data/mockData'

const exportCSV = (headers, rows, filename) => {
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv); a.download = filename; a.click()
}

const bookingTrends = [
  { month: 'Jun', bookings: 6 }, { month: 'Jul', bookings: 9 },
  { month: 'Aug', bookings: 7 }, { month: 'Sep', bookings: 11 },
  { month: 'Oct', bookings: 14 }, { month: 'Nov', bookings: 8 },
]

const financialHistory = [
  { date: 'Oct 12', event: 'Fatima Wedding', hall: 'Grand Ballroom', package: 'Platinum', revenue: 1050000, expenses: 780000, net: 270000 },
  { date: 'Oct 18', event: 'Corporate Gala', hall: 'Crystal Hall', package: 'Premium', revenue: 620000, expenses: 405000, net: 215000 },
  { date: 'Oct 22', event: 'Garden Party', hall: 'Garden Terrace', package: 'Standard', revenue: 220000, expenses: 160000, net: 60000 },
]

export default function Reports() {
  const [toast, setToast] = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const completedBookings = bookings.filter(b => b.status === 'completed')
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalBookings = bookingTrends.reduce((s, m) => s + m.bookings, 0)
  const lastMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0

  const popularHalls = ['Royal Grand Hall', 'Crystal Ballroom', 'Garden Pavilion', 'Pearl Suite'].map(hall => ({
    name: hall, count: bookings.filter(b => b.hall === hall).length,
  })).sort((a, b) => b.count - a.count)

  const popularMenus = menuPackages.filter(m => m.name !== 'Custom').map(m => ({
    name: m.name, count: bookings.filter(b => b.menu === m.name).length,
  })).sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-sidebar text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>
      )}
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (6mo)', value: `PKR ${(totalRevenue / 1000000).toFixed(2)}M` },
          { label: 'Total Bookings', value: totalBookings },
          { label: 'Last Month Revenue', value: `PKR ${(lastMonthRevenue / 1000).toFixed(0)}K` },
          { label: 'Avg per Booking', value: `PKR ${Math.round(totalRevenue / totalBookings / 1000)}K` },
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
            <button onClick={() => exportCSV(['Month','Bookings'], bookingTrends.map(r => [r.month, r.bookings]), 'booking-trends.csv')} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5"><Download size={12} /> Export</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bookingTrends} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DC" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} width={25} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E5DC', fontSize: 12 }} />
              <Line type="monotone" dataKey="bookings" stroke="#C8A96E" strokeWidth={2.5} dot={{ fill: '#C8A96E', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Halls */}
        <div className="card">
          <p className="font-semibold text-text-primary mb-4">Popular Halls</p>
          <div className="space-y-3">
            {popularHalls.map((h, i) => (
              <div key={h.name} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cream-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-text-primary">#{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{h.name}</p>
                  <div className="h-1.5 bg-cream-dark rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(h.count / bookings.length) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-text-muted flex-shrink-0">{h.count} events</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular menus + wastage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Popular Menu Items */}
        <div className="card">
          <p className="font-semibold text-text-primary mb-4">Popular Menu Packages</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={popularMenus} layout="vertical" margin={{ left: 0, right: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E5DC', fontSize: 12 }} />
              <Bar dataKey="count" fill="#C8A96E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Food Wastage */}
        <div className="card">
          <p className="font-semibold text-text-primary mb-4">Food Wastage Log</p>
          {wasteLogs.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No wastage logged yet.</p>
          ) : (
            <div className="space-y-3">
              {wasteLogs.map((w, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-cream rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{w.item} — {w.quantity}</p>
                    <p className="text-xs text-text-muted mt-0.5">{w.date} · Booking {w.bookingId}</p>
                    <p className="text-xs text-text-muted italic">{w.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Financial History */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="font-semibold text-text-primary">Recent Financial Performance</p>
          <button onClick={() => exportCSV(['Date','Event','Hall','Package','Revenue','Expenses','Net'], financialHistory.map(r => [r.date, r.event, r.hall, r.package, r.revenue, r.expenses, r.net]), 'financial-report.csv')} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5"><Download size={13} /> Export Full</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/60">
              <tr>
                {['Date', 'Event', 'Hall', 'Package', 'Revenue', 'Expenses', 'Net Profit'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {financialHistory.map((row, i) => (
                <tr key={i} className="hover:bg-cream/40 transition-colors">
                  <td className="table-td text-text-muted">{row.date}</td>
                  <td className="table-td font-medium">{row.event}</td>
                  <td className="table-td text-text-muted">{row.hall}</td>
                  <td className="table-td">{row.package}</td>
                  <td className="table-td text-green-600 font-medium">PKR {row.revenue.toLocaleString()}</td>
                  <td className="table-td text-red-500">PKR {row.expenses.toLocaleString()}</td>
                  <td className="table-td font-semibold text-text-primary">PKR {row.net.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
