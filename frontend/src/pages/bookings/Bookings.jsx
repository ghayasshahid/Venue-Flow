import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus, Download, Filter, Search, X } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { getBookings, getHalls, exportBookingsCSV } from '../../lib/api'

export default function Bookings() {
  const navigate = useNavigate()
  const location = useLocation()

  const [bookings, setBookings] = useState([])
  const [halls, setHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })

  const [search, setSearch] = useState('')
  const [filterHall, setFilterHall] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const perPage = 6

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    if (location.state?.toast) {
      showToast(location.state.toast)
      window.history.replaceState({}, '')
    }
    getHalls().then(r => setHalls(r.data)).catch(() => {})
  }, [])

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: perPage }
      if (search) params.search = search
      if (filterHall !== 'all') params.hall = filterHall
      if (filterPayment !== 'all') params.paymentStatus = filterPayment
      if (filterStatus !== 'all') params.status = filterStatus
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo

      const res = await getBookings(params)
      setBookings(res.data)
      setPagination(res.pagination)
    } catch {
      showToast('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }, [page, search, filterHall, filterPayment, filterStatus, dateFrom, dateTo])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const clearFilters = () => {
    setSearch(''); setFilterHall('all'); setFilterPayment('all')
    setFilterStatus('all'); setDateFrom(''); setDateTo(''); setPage(1)
  }

  const totalRevenue = bookings.reduce((s, b) => s + b.totalAmount, 0)
  const activeCount = bookings.filter(b => b.status === 'upcoming').length
  const pendingCount = bookings.filter(b => b.paymentStatus === 'pending').length

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-sidebar text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `PKR ${(totalRevenue / 1000).toFixed(0)}K`, sub: 'Current filter' },
          { label: 'Active Bookings', value: pagination.total, sub: 'Matching current filter' },
          { label: 'Pending Payments', value: pendingCount, sub: 'On this page' },
          { label: 'Upcoming Events', value: activeCount, sub: 'On this page' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-text-muted text-xs uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-40">
            <label className="label">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="input pl-8" placeholder="Customer or booking ID…" />
            </div>
          </div>
          <div>
            <label className="label">Date From</label>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} className="input w-36" />
          </div>
          <div>
            <label className="label">Date To</label>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} className="input w-36" />
          </div>
          <div>
            <label className="label">Hall</label>
            <select value={filterHall} onChange={e => { setFilterHall(e.target.value); setPage(1) }} className="input w-44">
              <option value="all">All Venues</option>
              {halls.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Payment</label>
            <select value={filterPayment} onChange={e => { setFilterPayment(e.target.value); setPage(1) }} className="input w-36">
              <option value="all">Any Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }} className="input w-36">
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button onClick={() => { setPage(1); fetchBookings() }} className="btn-secondary flex items-center gap-1.5 self-end">
            <Filter size={14} /> Apply
          </button>
          <button onClick={clearFilters} className="btn-secondary flex items-center gap-1.5 self-end text-text-muted">
            <X size={14} /> Clear
          </button>
          <button className="btn-primary flex items-center gap-1.5 self-end ml-auto" onClick={() => navigate('/bookings/new')}>
            <Plus size={15} /> New Booking
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="font-semibold text-text-primary">All Bookings</p>
          <button onClick={() => exportBookingsCSV()} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <Download size={13} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream/60">
              <tr>
                {['Booking ID', 'Date & Time', 'Hall', 'Event Type', 'Customer Name', 'Payment Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={7} className="table-td text-center text-text-muted py-10">Loading…</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="table-td text-center text-text-muted py-10">No bookings found.</td></tr>
              ) : bookings.map(b => (
                <tr key={b._id} className="hover:bg-cream/40 transition-colors">
                  <td className="table-td font-mono text-xs text-text-muted">{b.bookingId}</td>
                  <td className="table-td">
                    <p className="font-medium">{new Date(b.date).toLocaleDateString('en-GB')}</p>
                    <p className="text-xs text-text-muted">{b.time}</p>
                  </td>
                  <td className="table-td">{b.hall?.name || b.hallName}</td>
                  <td className="table-td">{b.eventType}</td>
                  <td className="table-td">
                    <p className="font-medium">{b.customer.name}</p>
                    <p className="text-xs text-text-muted">{b.customer.email}</p>
                  </td>
                  <td className="table-td"><StatusBadge status={b.paymentStatus} /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <button onClick={() => navigate(`/bookings/${b._id}`)} className="text-accent text-xs font-medium hover:underline">View</button>
                      <button onClick={() => navigate(`/bookings/${b._id}/edit`)} className="text-text-muted text-xs hover:text-text-primary">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, pagination.total)} of {pagination.total} entries
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-accent text-white' : 'hover:bg-cream text-text-muted'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
