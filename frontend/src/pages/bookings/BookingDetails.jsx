import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, CreditCard, StickyNote, Trash2, FileText, CheckCircle } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { getBooking, updateBooking, getExpenses, getMenuPackages, getDecorPackages, createTransaction } from '../../lib/api'

export default function BookingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [bookingExpenses, setBookingExpenses] = useState([])
  const [menuPackages, setMenuPackages] = useState([])
  const [decorPackages, setDecorPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([])
  const [showExpense, setShowExpense] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [paidToast, setPaidToast] = useState(false)
  const [showRecordPayment, setShowRecordPayment] = useState(false)
  const [recordAmount, setRecordAmount] = useState('')
  const [recordSaving, setRecordSaving] = useState(false)


  useEffect(() => {
    Promise.all([getBooking(id), getExpenses({ bookingId: id }), getMenuPackages(), getDecorPackages()])
      .then(([bRes, eRes, menuRes, decorRes]) => {
        const b = bRes.data
        setBooking(b)
        setPaymentStatus(b.paymentStatus)
        setNotes(b.notes ? [b.notes] : [])
        setBookingExpenses(eRes.data)
        setMenuPackages(menuRes.data)
        setDecorPackages(decorRes.data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="card text-center py-16 text-text-muted">Loading…</div>
  if (notFound || !booking) return (
    <div className="card text-center py-16">
      <p className="text-text-muted">Booking not found.</p>
      <button onClick={() => navigate('/bookings')} className="btn-primary mt-4">Back to Bookings</button>
    </div>
  )

  const totalExpenses = bookingExpenses.reduce((s, e) => s + e.amount, 0)
  const profit = booking.totalAmount - totalExpenses
  const menu = menuPackages.find(m => m.name === booking.menu)
  const decor = decorPackages.find(d => d.name === booking.decor)

  const addNote = async () => {
    if (!note.trim()) return
    const newNotes = [...notes, note.trim()]
    setNotes(newNotes)
    setNote('')
    await updateBooking(id, { notes: newNotes.join('\n') }).catch(() => {})
  }

  const removeNote = async (i) => {
    const newNotes = notes.filter((_, j) => j !== i)
    setNotes(newNotes)
    await updateBooking(id, { notes: newNotes.join('\n') }).catch(() => {})
  }

  const markAsPaid = async () => {
    try {
      await updateBooking(id, { paymentStatus: 'paid' })
      const balance = booking.totalAmount - booking.advance
      if (balance > 0) {
        await createTransaction({
          booking: id,
          bookingId: booking.bookingId,
          customer: booking.customer.name,
          eventType: booking.eventType,
          amount: balance,
          type: 'partial',
          status: 'paid',
          date: new Date().toISOString(),
        })
      }
      setPaymentStatus('paid')
      setPaidToast(true)
      setTimeout(() => setPaidToast(false), 3000)
    } catch {
      // silently fail
    }
  }

  const recordBalancePayment = async () => {
    const amount = Number(recordAmount)
    if (!amount || amount <= 0) return
    setRecordSaving(true)
    try {
      await createTransaction({
        booking: id,
        bookingId: booking.bookingId,
        customer: booking.customer.name,
        eventType: booking.eventType,
        amount,
        type: 'partial',
        status: 'paid',
        date: new Date().toISOString(),
      })
      setShowRecordPayment(false)
      setRecordAmount('')
      setPaidToast(true)
      setTimeout(() => setPaidToast(false), 3000)
    } catch {
      // silently fail
    } finally {
      setRecordSaving(false)
    }
  }

  const exportPDF = () => window.print()

  const eventDate = new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-5">
      {paidToast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle size={16} /> Payment recorded — revenue updated
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/bookings')} className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft size={18} className="text-text-muted" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-text-primary">{booking.bookingId}</p>
              <StatusBadge status={booking.status} />
              <StatusBadge status={paymentStatus} />
            </div>
            <p className="text-sm text-text-muted mt-0.5">{booking.eventType} · {eventDate} at {booking.time}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExpense(true)} className="btn-secondary flex items-center gap-1.5">
            <FileText size={14} /> Expense Report
          </button>
          <button onClick={() => navigate(`/bookings/${id}/edit`)} className="btn-primary flex items-center gap-1.5">
            <Edit size={14} /> Edit Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Event Info */}
          <div className="card">
            <p className="font-semibold text-text-primary mb-4">Event Information</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Event Type', value: booking.eventType },
                { label: 'Date', value: eventDate },
                { label: 'Time', value: booking.time },
                { label: 'Guest Count', value: `${booking.guests} guests` },
                { label: 'Hall / Venue', value: booking.hall?.name || booking.hallName },
                { label: 'Hall Capacity', value: booking.hall?.capacity ? `${booking.hall.capacity} guests` : '—' },
              ].map(f => (
                <div key={f.label}>
                  <p className="label">{f.label}</p>
                  <p className="text-sm font-medium text-text-primary">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="card">
            <p className="font-semibold text-text-primary mb-4">Customer Information</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: booking.customer.name },
                { label: 'Phone', value: booking.customer.phone },
                { label: 'Email', value: booking.customer.email },
              ].map(f => (
                <div key={f.label}>
                  <p className="label">{f.label}</p>
                  <p className="text-sm font-medium text-text-primary">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Menu & Decor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card">
              <p className="font-semibold text-text-primary mb-3">Menu Package</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">{booking.menu}</span>
                <span className="text-sm text-text-muted">{menu ? `PKR ${menu.price.toLocaleString()}/head` : ''}</span>
              </div>
              {menu?.items?.length > 0 && (
                <ul className="space-y-1">
                  {menu.items.map(item => (
                    <li key={item} className="text-xs text-text-muted flex items-center gap-1.5 before:content-['•'] before:text-accent">{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card">
              <p className="font-semibold text-text-primary mb-3">Décor Package</p>
              <p className="text-sm font-medium mb-1">{booking.decor}</p>
              <p className="text-xs text-text-muted mb-2">{decor?.description}</p>
              {decor?.price > 0 && <p className="text-sm text-text-muted">PKR {decor.price.toLocaleString()}</p>}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <p className="font-semibold text-text-primary mb-3">Notes</p>
            <div className="space-y-2 mb-3">
              {notes.length === 0 && <p className="text-sm text-text-muted italic">No notes yet.</p>}
              {notes.map((n, i) => (
                <div key={i} className="flex items-start justify-between bg-cream rounded-lg p-3">
                  <p className="text-sm text-text-primary">{n}</p>
                  <button onClick={() => removeNote(i)} className="ml-3 text-red-400 hover:text-red-600">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} className="input flex-1" placeholder="Add a note…" />
              <button onClick={addNote} className="btn-primary flex items-center gap-1.5">
                <StickyNote size={14} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Payment Summary */}
          <div className="card">
            <p className="font-semibold text-text-primary mb-4">Payment Summary</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Total Amount</span>
                <span className="font-semibold">PKR {booking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Advance Paid</span>
                <span className="font-medium text-green-600">PKR {booking.advance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-text-muted">Balance Due</span>
                <span className={`font-semibold ${paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {paymentStatus === 'paid' ? 'PKR 0' : `PKR ${(booking.totalAmount - booking.advance).toLocaleString()}`}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p className="label">Payment Status</p>
              <StatusBadge status={paymentStatus} />
            </div>
            {paymentStatus !== 'paid' && (
              <button onClick={markAsPaid} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                <CreditCard size={14} /> Mark as Paid
              </button>
            )}
            {paymentStatus === 'paid' && !showRecordPayment && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={15} /> Fully settled
                </div>
                <button onClick={() => { setShowRecordPayment(true); setRecordAmount(String(booking.totalAmount - booking.advance)) }} className="text-xs text-text-muted hover:text-accent underline">
                  Record a payment transaction
                </button>
              </div>
            )}
            {paymentStatus === 'paid' && showRecordPayment && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-text-muted font-medium">Record payment amount (PKR)</p>
                <input type="number" value={recordAmount} onChange={e => setRecordAmount(e.target.value)} className="input text-sm" placeholder={String(booking.totalAmount - booking.advance)} />
                <div className="flex gap-2">
                  <button onClick={recordBalancePayment} disabled={recordSaving} className="btn-primary flex-1 text-xs disabled:opacity-60">
                    {recordSaving ? 'Saving…' : 'Record'}
                  </button>
                  <button onClick={() => setShowRecordPayment(false)} className="btn-secondary text-xs">Cancel</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Expense Report Modal */}
      {showExpense && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <p className="font-semibold text-text-primary">Expense Report — {booking.bookingId}</p>
              <button onClick={() => setShowExpense(false)} className="text-text-muted hover:text-text-primary text-lg">×</button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm font-medium text-text-muted pb-2 border-b border-border">
                <span>Description</span><span>Amount</span>
              </div>
              {bookingExpenses.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No expenses logged yet.</p>
              ) : bookingExpenses.map(e => (
                <div key={e._id} className="flex justify-between text-sm">
                  <span className="text-text-primary">{e.description}</span>
                  <span className="font-medium">PKR {e.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Revenue</span>
                  <span className="text-green-600">PKR {booking.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Expenses</span>
                  <span className="text-red-500">PKR {totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span>Net Profit</span>
                  <span className={profit >= 0 ? 'text-green-600' : 'text-red-500'}>PKR {profit.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-2">
              <button onClick={exportPDF} className="btn-secondary">Export PDF</button>
              <button onClick={() => setShowExpense(false)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
