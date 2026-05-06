import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { bookings, halls, menuPackages, decorPackages } from '../../data/mockData'

const steps = ['Basic Info', 'Services', 'Payment', 'Review']

const eventTypes = ['Wedding', 'Barat', 'Mehndi', 'Walima', 'Corporate Gala', 'Birthday', 'Anniversary', 'Other']

const emptyForm = {
  date: '', time: '', hallId: '', eventType: '', guests: '',
  customerName: '', customerPhone: '', customerEmail: '',
  menuId: '', decorId: '', customAddons: '',
  advance: '', totalAmount: '', notes: '',
}

export default function AddEditBooking() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const existing = isEdit ? bookings.find(b => b.id === id) : null

  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => {
    if (existing) {
      const hall = halls.find(h => h.name === existing.hall)
      const menu = menuPackages.find(m => m.name === existing.menu)
      const decor = decorPackages.find(d => d.name === existing.decor)
      return {
        date: existing.date, time: existing.time,
        hallId: hall?.id || '', eventType: existing.eventType, guests: existing.guests,
        customerName: existing.customer, customerPhone: existing.phone, customerEmail: existing.email,
        menuId: menu?.id || '', decorId: decor?.id || '', customAddons: '',
        advance: existing.advance, totalAmount: existing.totalAmount, notes: existing.notes,
      }
    }
    return emptyForm
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const selectedHall = halls.find(h => h.id === Number(form.hallId))
  const selectedMenu = menuPackages.find(m => m.id === Number(form.menuId))
  const selectedDecor = decorPackages.find(d => d.id === Number(form.decorId))

  const canNext = () => {
    if (step === 0) return form.date && form.time && form.hallId && form.eventType && form.guests && form.customerName && form.customerPhone
    if (step === 1) return form.menuId && form.decorId
    if (step === 2) return form.advance && form.totalAmount
    return true
  }

  const handleSubmit = () => {
    navigate('/bookings', { state: { toast: isEdit ? 'Booking updated successfully.' : 'Booking created successfully.' } })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/bookings')} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-text-muted" />
        </button>
        <h2 className="font-semibold text-text-primary">{isEdit ? `Edit Booking — ${id}` : 'New Booking'}</h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-accent text-white' : 'bg-cream-dark text-text-muted'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${i === step ? 'text-accent' : 'text-text-muted'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${i < step ? 'bg-green-400' : 'bg-cream-dark'}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card space-y-5">
        {step === 0 && (
          <>
            <p className="font-semibold text-text-primary">Basic Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Event Date *</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Start Time *</label>
                <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Hall / Venue *</label>
                <select value={form.hallId} onChange={e => set('hallId', e.target.value)} className="input">
                  <option value="">Select hall…</option>
                  {halls.map(h => <option key={h.id} value={h.id}>{h.name} (cap. {h.capacity})</option>)}
                </select>
              </div>
              <div>
                <label className="label">Event Type *</label>
                <select value={form.eventType} onChange={e => set('eventType', e.target.value)} className="input">
                  <option value="">Select type…</option>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Guest Count *</label>
                <input type="number" value={form.guests} onChange={e => set('guests', e.target.value)} className="input" placeholder="e.g. 500" />
                {selectedHall && form.guests > selectedHall.capacity && (
                  <p className="text-xs text-red-500 mt-1">Exceeds hall capacity of {selectedHall.capacity}.</p>
                )}
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="font-medium text-text-primary mb-3 text-sm">Customer Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="label">Full Name *</label>
                  <input value={form.customerName} onChange={e => set('customerName', e.target.value)} className="input" placeholder="Customer's full name" />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} className="input" placeholder="+92 300 0000000" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} className="input" placeholder="email@example.com" />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <p className="font-semibold text-text-primary">Services</p>
            {/* Menu */}
            <div>
              <label className="label">Menu Package *</label>
              <div className="grid grid-cols-2 gap-3">
                {menuPackages.map(m => (
                  <div key={m.id} onClick={() => set('menuId', m.id)} className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${Number(form.menuId) === m.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}>
                    <p className="font-semibold text-text-primary text-sm">{m.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{m.price > 0 ? `PKR ${m.price.toLocaleString()}/head` : 'Custom pricing'}</p>
                    {m.items.length > 0 && <p className="text-xs text-text-muted mt-1 truncate">{m.items.slice(0, 3).join(', ')}…</p>}
                  </div>
                ))}
              </div>
            </div>
            {/* Decor */}
            <div>
              <label className="label">Décor Package *</label>
              <div className="grid grid-cols-2 gap-3">
                {decorPackages.map(d => (
                  <div key={d.id} onClick={() => set('decorId', d.id)} className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${Number(form.decorId) === d.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}>
                    <p className="font-semibold text-text-primary text-sm">{d.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{d.price > 0 ? `PKR ${d.price.toLocaleString()}` : 'Custom pricing'}</p>
                    <p className="text-xs text-text-muted mt-1">{d.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Custom Add-ons / Special Requests</label>
              <textarea value={form.customAddons} onChange={e => set('customAddons', e.target.value)} className="input" rows={3} placeholder="e.g. Live BBQ station, custom centrepieces, valet parking…" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="font-semibold text-text-primary">Payment Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Total Amount (PKR) *</label>
                <input type="number" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} className="input" placeholder="e.g. 850000" />
              </div>
              <div>
                <label className="label">Advance Payment (PKR) *</label>
                <input type="number" value={form.advance} onChange={e => set('advance', e.target.value)} className="input" placeholder="e.g. 200000" />
              </div>
            </div>
            {form.totalAmount && form.advance && (
              <div className="bg-cream rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Total Amount</span>
                  <span className="font-semibold">PKR {Number(form.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Advance Received</span>
                  <span className="text-green-600 font-medium">PKR {Number(form.advance).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2">
                  <span className="text-text-muted font-medium">Balance Due</span>
                  <span className="font-bold text-amber-600">PKR {(Number(form.totalAmount) - Number(form.advance)).toLocaleString()}</span>
                </div>
              </div>
            )}
            <div>
              <label className="label">Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="input" rows={3} placeholder="Any special instructions or notes for this booking…" />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="font-semibold text-text-primary">Review & Confirm</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                ['Date', form.date], ['Time', form.time],
                ['Hall', selectedHall?.name || '—'], ['Event Type', form.eventType],
                ['Guests', form.guests], ['Customer', form.customerName],
                ['Phone', form.customerPhone], ['Email', form.customerEmail || '—'],
                ['Menu', selectedMenu?.name || '—'], ['Décor', selectedDecor?.name || '—'],
                ['Total Amount', form.totalAmount ? `PKR ${Number(form.totalAmount).toLocaleString()}` : '—'],
                ['Advance', form.advance ? `PKR ${Number(form.advance).toLocaleString()}` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="label">{k}</p>
                  <p className="text-sm font-medium text-text-primary">{v}</p>
                </div>
              ))}
            </div>
            {form.notes && (
              <div className="bg-cream rounded-lg p-3">
                <p className="label">Notes</p>
                <p className="text-sm text-text-primary">{form.notes}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/bookings')} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={14} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < steps.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            Next <ArrowRight size={14} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
            <Check size={14} /> {isEdit ? 'Update Booking' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  )
}
