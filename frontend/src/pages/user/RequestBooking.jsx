import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const GOLD   = '#C8A96E'
const DARK   = '#1A1A18'
const CREAM  = '#F5F4EF'
const BORDER = '#E8E5DC'
const TEXT   = '#1C1C1A'
const MUTED  = '#6B7280'
const ERR    = '#DC2626'

// ─── Static option lists (replace with API fetch when backend is ready) ───────
const HALLS = [
  { value: '',                  label: 'No preference' },
  { value: 'Royal Grand Hall',  label: 'Royal Grand Hall — up to 800 guests' },
  { value: 'Pearl Banquet',     label: 'Pearl Banquet — up to 500 guests' },
  { value: 'Diamond Suite',     label: 'Diamond Suite — up to 300 guests' },
  { value: 'Garden Marquee',    label: 'Garden Marquee — up to 600 guests' },
  { value: 'Crystal Hall',      label: 'Crystal Hall — up to 400 guests' },
]

const EVENT_TYPES = [
  'Wedding (Shaadi)',
  'Mehndi Ceremony',
  'Valima / Reception',
  'Birthday Party',
  'Corporate Event',
  'Anniversary',
  'Other',
]

const MENU_OPTS = [
  { value: '',               label: 'No preference' },
  { value: 'Royal Feast',    label: 'Royal Feast — Full traditional multi-course meal' },
  { value: 'Garden Delight', label: 'Garden Delight — Fresh salads, BBQ & desserts' },
  { value: 'Modern Fusion',  label: 'Modern Fusion — Contemporary international cuisine' },
  { value: 'Economy',        label: 'Economy Package — Budget-friendly meals' },
  { value: 'Custom Menu',    label: 'Custom — I will specify in notes' },
]

const DECOR_OPTS = [
  { value: '',                   label: 'No preference' },
  { value: 'Classic Elegance',   label: 'Classic Elegance — White & gold traditional setup' },
  { value: 'Floral Fantasy',     label: 'Floral Fantasy — Lush flower arrangements throughout' },
  { value: 'Royal Grandeur',     label: 'Royal Grandeur — Full luxury premium setup' },
  { value: 'Modern Minimalist',  label: 'Modern Minimalist — Clean, contemporary aesthetic' },
  { value: 'Custom Decor',       label: 'Custom — I will describe in notes' },
]

const SLOTS = [
  { id: 'afternoon', label: '1:00 PM – 4:00 PM', icon: '☀️' },
  { id: 'evening',   label: '7:00 PM – 10:00 PM', icon: '🌙' },
]

// ─── Shared primitive styles ──────────────────────────────────────────────────
const inp = (err) => ({
  width: '100%', padding: '10px 13px', borderRadius: '9px',
  border: `1.5px solid ${err ? ERR : BORDER}`, fontSize: '.9rem',
  color: TEXT, background: '#fff', outline: 'none',
  fontFamily: 'Inter,system-ui,sans-serif',
  transition: 'border-color .18s',
})

const today = (() => { const d = new Date(); return d.toISOString().split('T')[0] })()

// ─── Confirmation / "invoice" view ───────────────────────────────────────────
function Confirmation({ form, ref_, navigate }) {
  const slotLabel = SLOTS.find(s => s.id === form.slot)?.label || form.slot
  const rows = [
    { label: 'Date',         value: new Date(form.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) },
    { label: 'Time Slot',    value: slotLabel ? `${SLOTS.find(s=>s.id===form.slot)?.icon || ''} ${slotLabel}` : '—' },
    { label: 'Hall',         value: form.hall || 'No preference' },
    { label: 'Event Type',   value: form.eventType },
    { label: 'Guests',       value: `${form.capacity} people` },
    ...(form.menu  ? [{ label: 'Menu',  value: form.menu  }] : []),
    ...(form.decor ? [{ label: 'Decor', value: form.decor }] : []),
    ...(form.notes ? [{ label: 'Notes', value: form.notes }] : []),
  ]

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: 'Inter,system-ui,sans-serif' }}>
      {/* Nav */}
      <nav style={{
        background: DARK, height: '60px', padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(200,169,110,.12)',
      }}>
        <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '.85rem' }}>Booking Request</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width:'30px', height:'30px', borderRadius:'7px', background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.75rem' }}>VF</div>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>Venue Flow</span>
        </div>
      </nav>

      {/* Card */}
      <div style={{ maxWidth: '580px', margin: '48px auto', padding: '0 20px 72px' }}>
        <div style={{
          background: '#fff', borderRadius: '20px', border: `1px solid ${BORDER}`,
          boxShadow: '0 8px 40px rgba(0,0,0,.08)', overflow: 'hidden',
        }}>
          {/* Green header strip */}
          <div style={{ background: '#DCFCE7', padding: '32px 36px 28px', textAlign: 'center', borderBottom: `1px solid #BBF7D0` }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', background: '#22C55E',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '1.6rem', lineHeight: 1 }}>✓</span>
            </div>
            <h1 style={{ color: '#14532D', fontSize: '1.35rem', fontWeight: 700, marginBottom: '6px' }}>
              Request Submitted!
            </h1>
            <p style={{ color: '#166534', fontSize: '.9rem' }}>
              Our team will review and contact you within 24 hours.
            </p>
          </div>

          {/* Reference number */}
          <div style={{ padding: '22px 36px', background: CREAM, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '1px' }}>Reference No.</span>
            <span style={{
              fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem',
              color: DARK, background: '#fff', padding: '4px 14px',
              borderRadius: '6px', border: `1px solid ${BORDER}`,
              letterSpacing: '1px',
            }}>{ref_}</span>
          </div>

          {/* Booking details */}
          <div style={{ padding: '24px 36px' }}>
            <p style={{ fontSize: '.72rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '18px' }}>
              Booking Summary
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {rows.map(({ label, value }, i) => (
                <div key={label} style={{
                  display: 'flex', gap: '12px', justifyContent: 'space-between',
                  padding: '11px 0',
                  borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : 'none',
                }}>
                  <span style={{ fontSize: '.85rem', color: MUTED, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '.85rem', color: TEXT, fontWeight: 500, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Contact details */}
            <div style={{
              marginTop: '20px', padding: '16px', borderRadius: '10px',
              background: CREAM, border: `1px solid ${BORDER}`,
            }}>
              <p style={{ fontSize: '.72rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Contact</p>
              <p style={{ fontSize: '.88rem', color: TEXT, fontWeight: 600, marginBottom: '3px' }}>{form.name}</p>
              <p style={{ fontSize: '.84rem', color: MUTED }}>{form.phone} · {form.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            padding: '20px 36px 28px', display: 'flex', gap: '10px', flexWrap: 'wrap',
            borderTop: `1px solid ${BORDER}`,
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                flex: 1, padding: '11px', borderRadius: '9px', fontSize: '.88rem', fontWeight: 600,
                background: DARK, color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter,system-ui,sans-serif', transition: 'background .18s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#2e2e2a'}
              onMouseOut={e  => e.currentTarget.style.background = DARK}
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/available-dates')}
              style={{
                flex: 1, padding: '11px', borderRadius: '9px', fontSize: '.88rem', fontWeight: 600,
                background: '#fff', color: TEXT, border: `1.5px solid ${BORDER}`, cursor: 'pointer',
                fontFamily: 'Inter,system-ui,sans-serif', transition: 'border-color .18s',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = GOLD}
              onMouseOut={e  => e.currentTarget.style.borderColor = BORDER}
            >
              Check Another Date
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: MUTED, fontSize: '.78rem', marginTop: '20px' }}>
          Save your reference number. You can quote it when contacting us.
        </p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RequestBooking() {
  const navigate   = useNavigate()
  const { state }  = useLocation()
  const prefill    = state || {}

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    date:      prefill.date  || '',
    slot:      prefill.slot  || '',
    hall:      prefill.hall  || '',
    eventType: '',
    capacity:  '',
    menu:  '',
    decor: '',
    notes: '',
  })

  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [refNumber,  setRefNumber]  = useState('')

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())         e.name      = 'Full name is required'
    if (!form.phone.trim())        e.phone     = 'Phone number is required'
    if (!form.email.trim())        e.email     = 'Email address is required'
    if (!form.date)                e.date      = 'Please select a date'
    if (!form.slot)                e.slot      = 'Please select a time slot'
    if (!form.eventType)           e.eventType = 'Please select an event type'
    if (!form.capacity || Number(form.capacity) < 1)
                                   e.capacity  = 'Enter expected number of guests'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      const firstErr = document.querySelector('.rb-err')
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    // Simulate POST — replace with fetch('/api/user/booking-requests', { method:'POST', body: JSON.stringify(form) })
    setTimeout(() => {
      setRefNumber(`VF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)
      setSubmitting(false)
      setSubmitted(true)
    }, 1600)
  }

  if (submitted) return <Confirmation form={form} ref_={refNumber} navigate={navigate} />

  // ── Form helpers ─────────────────────────────────────────────────────────
  const Label = ({ children, required }) => (
    <label style={{ display:'block', fontSize:'.72rem', fontWeight:700, color:MUTED, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' }}>
      {children}{required && <span style={{ color:GOLD, marginLeft:'3px' }}>*</span>}
    </label>
  )

  const ErrMsg = ({ field }) => errors[field]
    ? <p className="rb-err" style={{ color:ERR, fontSize:'.75rem', marginTop:'5px' }}>{errors[field]}</p>
    : null

  const Card = ({ title, subtitle, children }) => (
    <div style={{ background:'#fff', borderRadius:'18px', border:`1px solid ${BORDER}`, padding:'26px 28px', boxShadow:'0 2px 12px rgba(0,0,0,.04)', marginBottom:'18px' }}>
      <div style={{ marginBottom:'22px' }}>
        <h2 style={{ color:TEXT, fontSize:'1rem', fontWeight:700 }}>{title}</h2>
        {subtitle && <p style={{ color:MUTED, fontSize:'.82rem', marginTop:'4px', lineHeight:1.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )

  const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap');
        .rb-root { font-family:'Inter',system-ui,sans-serif; color:${TEXT}; min-height:100vh; background:${CREAM}; }
        .rb-root * { box-sizing:border-box; }
        .rb-input:focus { border-color:${GOLD} !important; box-shadow:0 0 0 3px rgba(200,169,110,.18); }
        .rb-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 13px center; padding-right:36px !important; }
        .slot-opt { flex:1; padding:14px 10px; border-radius:10px; border:1.5px solid ${BORDER}; cursor:pointer; text-align:center; transition:all .18s; background:#fff; }
        .slot-opt:hover { border-color:${GOLD}; }
        .slot-opt.active { background:${DARK}; border-color:${DARK}; color:#fff; }
        .submit-btn { width:100%; padding:15px; border-radius:10px; background:${GOLD}; color:#fff; border:none; font-size:1rem; font-weight:700; cursor:pointer; font-family:'Inter',system-ui,sans-serif; transition:background .18s, transform .15s; letter-spacing:.02em; display:flex; align-items:center; justify-content:center; gap:8px; }
        .submit-btn:hover:not(:disabled) { background:#b8935a; transform:translateY(-1px); }
        .submit-btn:disabled { opacity:.7; cursor:not-allowed; transform:none; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spinner { width:18px; height:18px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
        @media (max-width:640px) {
          .rb-grid2 { grid-template-columns:1fr !important; }
          .slot-opts { flex-direction:column !important; }
        }
      `}</style>

      <div className="rb-root">

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav style={{
          background:DARK, height:'60px', padding:'0 28px', position:'sticky', top:0, zIndex:50,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom:'1px solid rgba(200,169,110,.12)',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.55)', fontSize:'.85rem', display:'flex', alignItems:'center', gap:'6px', fontFamily:'Inter,system-ui,sans-serif', fontWeight:500, transition:'color .18s' }}
            onMouseOver={e => e.currentTarget.style.color = GOLD}
            onMouseOut={e  => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
          >
            ← Back
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'30px', height:'30px', borderRadius:'7px', background:GOLD, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.75rem' }}>VF</div>
            <span style={{ color:'#fff', fontWeight:600, fontSize:'1rem' }}>Venue Flow</span>
          </div>
        </nav>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div style={{ background:DARK, padding:'40px 28px 52px', textAlign:'center' }}>
          <p style={{ color:GOLD, fontSize:'.72rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'12px' }}>
            Book Your Event
          </p>
          <h1 style={{ color:'#fff', fontSize:'clamp(1.7rem, 3vw, 2.6rem)', fontFamily:"'Playfair Display',Georgia,serif", fontWeight:400, marginBottom:'12px' }}>
            Request a Booking
          </h1>
          <p style={{ color:'rgba(255,255,255,.48)', fontSize:'.93rem', maxWidth:'420px', margin:'0 auto', lineHeight:1.7 }}>
            Fill in the details below and our team will confirm availability and get back to you within 24 hours.
          </p>
        </div>

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ maxWidth:'700px', margin:'0 auto', padding:'28px 20px 72px' }} noValidate>

          {/* ── 1. Contact Information ─────────────────────────────────── */}
          <Card title="Contact Information" subtitle="We'll reach out to confirm your booking.">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }} className="rb-grid2">
              <div style={{ gridColumn:'span 2' }} className="rb-grid2-full">
                <Label required>Full Name</Label>
                <input className="rb-input" style={inp(errors.name)} value={form.name} onChange={set('name')} placeholder="e.g. Ahmed Ali" />
                <ErrMsg field="name" />
              </div>
              <div>
                <Label required>Phone Number</Label>
                <input className="rb-input" style={inp(errors.phone)} value={form.phone} onChange={set('phone')} placeholder="+92 300 0000000" type="tel" />
                <ErrMsg field="phone" />
              </div>
              <div>
                <Label required>Email Address</Label>
                <input className="rb-input" style={inp(errors.email)} value={form.email} onChange={set('email')} placeholder="you@example.com" type="email" />
                <ErrMsg field="email" />
              </div>
            </div>
          </Card>

          {/* ── 2. Event Details ──────────────────────────────────────── */}
          <Card title="Event Details" subtitle="Required fields marked with ✦">
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

              {/* Date + Hall */}
              <div style={grid2} className="rb-grid2">
                <div>
                  <Label required>Event Date</Label>
                  <input
                    className="rb-input" type="date"
                    style={{ ...inp(errors.date), colorScheme:'light' }}
                    min={today} value={form.date} onChange={set('date')}
                  />
                  <ErrMsg field="date" />
                </div>
                <div>
                  <Label>Preferred Hall</Label>
                  <select className="rb-input rb-select" style={inp(false)} value={form.hall} onChange={set('hall')}>
                    {HALLS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Time slot — styled pills */}
              <div>
                <Label required>Time Slot</Label>
                <div className="slot-opts" style={{ display:'flex', gap:'10px', marginTop:'2px' }}>
                  {SLOTS.map(s => (
                    <div
                      key={s.id}
                      className={`slot-opt${form.slot === s.id ? ' active' : ''}`}
                      onClick={() => { setForm(f => ({...f, slot: f.slot === s.id ? '' : s.id})); if(errors.slot) setErrors(er=>({...er,slot:''})) }}
                    >
                      <div style={{ fontSize:'1.3rem', marginBottom:'5px' }}>{s.icon}</div>
                      <div style={{ fontSize:'.88rem', fontWeight:600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {errors.slot && <p className="rb-err" style={{ color:ERR, fontSize:'.75rem', marginTop:'6px' }}>{errors.slot}</p>}
              </div>

              {/* Event type + capacity */}
              <div style={grid2} className="rb-grid2">
                <div>
                  <Label required>Event Type</Label>
                  <select className="rb-input rb-select" style={inp(errors.eventType)} value={form.eventType} onChange={set('eventType')}>
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ErrMsg field="eventType" />
                </div>
                <div>
                  <Label required>Expected Guests</Label>
                  <input
                    className="rb-input" type="number" min="1"
                    style={inp(errors.capacity)} value={form.capacity} onChange={set('capacity')}
                    placeholder="e.g. 250"
                  />
                  <ErrMsg field="capacity" />
                </div>
              </div>
            </div>
          </Card>

          {/* ── 3. Package Preferences (optional) ────────────────────── */}
          <Card
            title="Package Preferences"
            subtitle="Optional — skip if you'd like to discuss these later."
          >
            <div style={grid2} className="rb-grid2">
              <div>
                <Label>Menu Package</Label>
                <select className="rb-input rb-select" style={inp(false)} value={form.menu} onChange={set('menu')}>
                  {MENU_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Decor Package</Label>
                <select className="rb-input rb-select" style={inp(false)} value={form.decor} onChange={set('decor')}>
                  {DECOR_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </Card>

          {/* ── 4. Additional Notes (optional) ───────────────────────── */}
          <Card title="Additional Notes" subtitle="Optional — anything else you'd like us to know?">
            <textarea
              className="rb-input"
              style={{ ...inp(false), minHeight:'110px', resize:'vertical', lineHeight:1.6 }}
              value={form.notes} onChange={set('notes')}
              placeholder="Special requests, dietary restrictions, accessibility needs, theme ideas…"
            />
          </Card>

          {/* ── Submit ────────────────────────────────────────────────── */}
          <div style={{ marginTop:'8px' }}>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting
                ? <><div className="spinner" /> Sending Request…</>
                : '📩 Submit Booking Request'}
            </button>
            <p style={{ textAlign:'center', color:MUTED, fontSize:'.78rem', marginTop:'14px', lineHeight:1.6 }}>
              By submitting, you agree that this is an inquiry — not a confirmed booking.
              A team member will contact you to confirm availability and payment.
            </p>
          </div>
        </form>
      </div>
    </>
  )
}
