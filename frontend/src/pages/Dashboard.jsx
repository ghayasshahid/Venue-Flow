import { useNavigate } from 'react-router-dom'
import { CalendarCheck, Clock, CreditCard, Inbox, TrendingUp, ArrowRight } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import StatusBadge from '../components/StatusBadge'
import { bookings, bookingRequests, monthlyRevenue } from '../data/mockData'

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
  const today = new Date().toISOString().split('T')[0]

  const todayBookings = bookings.filter(b => b.date === today)
  const upcomingBookings = bookings
    .filter(b => b.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 7)
  const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending')
  const pendingRequests = bookingRequests.filter(r => r.status === 'pending')
  const monthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-sidebar rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white/50 text-sm">Welcome back, Alex</p>
          <p className="text-white font-semibold text-lg mt-0.5">
            You have {pendingRequests.length} new booking {pendingRequests.length === 1 ? 'request' : 'requests'} awaiting review.
          </p>
        </div>
        <button onClick={() => navigate('/requests')} className="btn-primary whitespace-nowrap">
          Review Requests
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} label="Booked Today" value={todayBookings.length || 4} sub="Active bookings" color="bg-accent" />
        <StatCard icon={Clock} label="Upcoming Events" value={upcomingBookings.length} sub="Next 7 days" color="bg-blue-500" />
        <StatCard icon={CreditCard} label="Pending Payments" value={pendingPayments.length} sub="Require follow-up" color="bg-amber-500" />
        <StatCard icon={Inbox} label="New Requests" value={pendingRequests.length} sub="Awaiting review" color="bg-purple-500" />
      </div>

      {/* Charts + recent */}
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
              +12.5%
            </div>
          </div>
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
        </div>

        {/* Hall Availability */}
        <div className="card">
          <p className="font-semibold text-text-primary mb-4">Hall Availability</p>
          <div className="space-y-3">
            {['Royal Grand Hall', 'Crystal Ballroom', 'Garden Pavilion', 'Pearl Suite'].map((hall, i) => {
              const booked = bookings.filter(b => b.hall === hall && b.status === 'upcoming').length
              const pct = Math.round((booked / 4) * 100)
              return (
                <div key={hall}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-primary font-medium truncate pr-2">{hall}</span>
                    <span className="text-text-muted whitespace-nowrap">{booked} booked</span>
                  </div>
                  <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${Math.max(pct, 8)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
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
          <button onClick={() => navigate('/bookings')} className="flex items-center gap-1 text-xs text-accent hover:text-accent-dark font-medium transition-colors">
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
              {recentBookings.map(b => (
                <tr key={b.id} className="hover:bg-cream/50 transition-colors">
                  <td className="table-td text-text-muted">{b.date}</td>
                  <td className="table-td font-medium">{b.hall}</td>
                  <td className="table-td">{b.eventType}</td>
                  <td className="table-td">{b.customer}</td>
                  <td className="table-td"><StatusBadge status={b.paymentStatus} /></td>
                  <td className="table-td">
                    <button onClick={() => navigate(`/bookings/${b.id}`)} className="text-accent text-xs font-medium hover:underline">
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
