import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck, Clock, CreditCard, Inbox, TrendingUp, ArrowRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import {
  getDashboardStats,
  getRecentBookings,
  getMonthlyRevenue,
  getHallUtilization,
} from '../lib/api'

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-text-primary mt-0.5">{value}</p>
        {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
      </div>
    </div>
  )
}

const formatPKR = (v) => `PKR ${(v / 1000).toFixed(0)}K`

export default function Dashboard() {
  const navigate = useNavigate()
  const { admin } = useAuth()

  const [stats, setStats] = useState({ bookedToday: 0, upcoming: 0, pendingPayments: 0, pendingRequests: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [hallUtilization, setHallUtilization] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getRecentBookings(),
      getMonthlyRevenue(),
      getHallUtilization(),
    ]).then(([statsRes, recentRes, revenueRes, hallRes]) => {
      setStats(statsRes.data)
      setRecentBookings(recentRes.data)
      setMonthlyRevenue(revenueRes.data)
      setHallUtilization(hallRes.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const maxBookings = Math.max(...hallUtilization.map(h => h.bookings), 1)
  const firstName = admin?.name?.split(' ')[0] || 'Admin'

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-sidebar rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white/50 text-sm">Welcome back, {firstName}</p>
          <p className="text-white font-semibold text-lg mt-0.5">
            {stats.pendingRequests > 0
              ? `You have ${stats.pendingRequests} new booking ${stats.pendingRequests === 1 ? 'request' : 'requests'} awaiting review.`
              : 'No pending requests right now. All clear!'}
          </p>
        </div>
        <button onClick={() => navigate('/manager/requests')} className="btn-primary whitespace-nowrap">
          Review Requests
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} label="Booked Today" value={loading ? '…' : stats.bookedToday} sub="Events today" color="bg-accent" />
        <StatCard icon={Clock} label="Upcoming Events" value={loading ? '…' : stats.upcoming} sub="From today onwards" color="bg-blue-500" />
        <StatCard icon={CreditCard} label="Pending Payments" value={loading ? '…' : stats.pendingPayments} sub="Require follow-up" color="bg-amber-500" />
        <StatCard icon={Inbox} label="New Requests" value={loading ? '…' : stats.pendingRequests} sub="Awaiting review" color="bg-purple-500" />
      </div>

      {/* Charts + hall availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-text-primary">Revenue Trend</p>
              <p className="text-xs text-text-muted mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
              <TrendingUp size={13} />
              Live data
            </div>
          </div>
          {monthlyRevenue.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-text-muted text-sm">
              {loading ? 'Loading…' : 'No revenue data yet.'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A96E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#C8A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DC" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatPKR} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip formatter={(v) => [`PKR ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #E8E5DC', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#C8A96E" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Hall Utilization */}
        <div className="card">
          <p className="font-semibold text-text-primary mb-4">Hall Utilization</p>
          {loading ? (
            <p className="text-sm text-text-muted">Loading…</p>
          ) : hallUtilization.length === 0 ? (
            <p className="text-sm text-text-muted">No booking data yet.</p>
          ) : (
            <div className="space-y-3">
              {hallUtilization.map(h => (
                <div key={h._id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-primary font-medium truncate pr-2">{h.hallName || '—'}</span>
                    <span className="text-text-muted whitespace-nowrap">{h.bookings} booked</span>
                  </div>
                  <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${Math.max((h.bookings / maxBookings) * 100, 6)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 font-medium">Customize another masterpiece.</p>
            <p className="text-xs text-amber-600 mt-0.5">Every booking is a chapter in a couple's history.</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-text-primary">Recent Bookings</p>
          <button onClick={() => navigate('/manager/bookings')} className="flex items-center gap-1 text-xs text-accent hover:text-accent-dark font-medium transition-colors">
            View all <ArrowRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-th">Date</th>
                <th className="table-th">Hall</th>
                <th className="table-th">Event</th>
                <th className="table-th">Customer</th>
                <th className="table-th">Payment</th>
                <th className="table-th"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="table-td text-center text-text-muted py-8">Loading…</td></tr>
              ) : recentBookings.length === 0 ? (
                <tr><td colSpan={6} className="table-td text-center text-text-muted py-8">No bookings yet.</td></tr>
              ) : recentBookings.map(b => (
                <tr key={b._id} className="hover:bg-cream/50 transition-colors">
                  <td className="table-td text-text-muted">{new Date(b.date).toLocaleDateString('en-GB')}</td>
                  <td className="table-td font-medium">{b.hall?.name || b.hallName}</td>
                  <td className="table-td">{b.eventType}</td>
                  <td className="table-td">{b.customer?.name}</td>
                  <td className="table-td"><StatusBadge status={b.paymentStatus} /></td>
                  <td className="table-td">
                    <button onClick={() => navigate(`/manager/bookings/${b._id}`)} className="text-accent text-xs font-medium hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
