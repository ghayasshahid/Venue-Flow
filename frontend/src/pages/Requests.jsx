import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Mail, UserPlus, ChevronDown, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { getRequests, updateRequest, deleteRequest } from '../lib/api'

export default function Requests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getRequests()
      .then(r => setRequests(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const markContacted = async (id) => {
    try {
      const res = await updateRequest(id, { status: 'contacted' })
      setRequests(rs => rs.map(r => r._id === id ? res.data : r))
    } catch {
      // silently fail
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteRequest(id)
      setRequests(rs => rs.filter(r => r._id !== id))
    } catch {
      // silently fail
    }
  }

  // Pass all request fields so the booking form can pre-fill without asking again
  const addAsBooking = (req) => {
    navigate('/bookings/new', {
      state: {
        prefill: {
          customerName: req.customer,
          customerPhone: req.phone,
          customerEmail: req.email,
          eventType: req.eventType,
          date: req.requestedDate
            ? new Date(req.requestedDate).toISOString().split('T')[0]
            : '',
          guests: req.guests,
          hallName: req.hall,
          requestId: req._id,
        },
      },
    })
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Requests', value: requests.length },
          { label: 'Pending', value: requests.filter(r => r.status === 'pending').length },
          { label: 'Contacted', value: requests.filter(r => r.status === 'contacted').length },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-border pb-3">
        {['all', 'pending', 'contacted', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary hover:bg-cream'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="font-semibold text-text-primary">Booking Inquiries</p>
        <span className="text-xs text-text-muted">{filtered.length} requests</span>
      </div>

      {/* Request list */}
      {loading ? (
        <div className="card text-center py-12 text-text-muted text-sm">Loading…</div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-text-muted">No requests found.</p>
            </div>
          )}
          {filtered.map(req => (
            <div key={req._id} className="card space-y-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center flex-shrink-0 font-semibold text-text-primary text-sm">
                  {req.customer.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-text-primary">{req.customer}</p>
                    <StatusBadge status={req.status} />
                    <span className="text-xs text-text-muted bg-cream px-2 py-0.5 rounded-full">{req.eventType}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Requested: <span className="font-medium text-text-primary">
                      {req.requestedDate ? new Date(req.requestedDate).toLocaleDateString('en-GB') : '—'}
                    </span> · Hall: {req.hall} · {req.guests} guests
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Received: {req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-GB') : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {req.status === 'pending' && (
                    <button onClick={() => markContacted(req._id)} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5">
                      <Phone size={12} /> Mark Contacted
                    </button>
                  )}
                  {req.status !== 'approved' && req.status !== 'rejected' && (
                    <button onClick={() => addAsBooking(req)} className="btn-primary text-xs py-1.5 flex items-center gap-1.5">
                      <UserPlus size={12} /> Add as Booking
                    </button>
                  )}
                  <button onClick={() => setExpandedId(expandedId === req._id ? null : req._id)} className="p-1.5 hover:bg-cream rounded-lg transition-colors">
                    <ChevronDown size={15} className={`text-text-muted transition-transform ${expandedId === req._id ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => handleDelete(req._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} className="text-red-400 hover:text-red-600" />
                  </button>
                </div>
              </div>

              {expandedId === req._id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="label">Phone</p>
                      <a href={`tel:${req.phone}`} className="text-sm text-accent flex items-center gap-1"><Phone size={12} />{req.phone}</a>
                    </div>
                    <div>
                      <p className="label">Email</p>
                      <a href={`mailto:${req.email}`} className="text-sm text-accent flex items-center gap-1"><Mail size={12} />{req.email}</a>
                    </div>
                    <div>
                      <p className="label">Requested Hall</p>
                      <p className="text-sm font-medium text-text-primary">{req.hall}</p>
                    </div>
                    <div>
                      <p className="label">Guests</p>
                      <p className="text-sm font-medium text-text-primary">{req.guests}</p>
                    </div>
                  </div>
                  {req.message && (
                    <div>
                      <p className="label">Message</p>
                      <p className="text-sm text-text-primary bg-cream rounded-lg p-3">{req.message}</p>
                    </div>
                  )}
                  {req.adminNotes && (
                    <div>
                      <p className="label">Admin Notes</p>
                      <p className="text-sm text-text-primary bg-cream rounded-lg p-3">{req.adminNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Banner */}
      <div className="rounded-xl overflow-hidden relative bg-sidebar p-6">
        <div className="max-w-sm">
          <p className="text-2xl font-bold text-white">The Grand Marquee East Wing</p>
          <p className="text-sm text-white/60 mt-2">A masterpiece of architectural elegance, offering unparalleled luxury for grand celebrations.</p>
          <div className="flex gap-6 mt-4">
            <div><p className="text-2xl font-bold text-accent">1,200</p><p className="text-xs text-white/50">Capacity</p></div>
            <div><p className="text-2xl font-bold text-accent">80</p><p className="text-xs text-white/50">Events hosted</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
