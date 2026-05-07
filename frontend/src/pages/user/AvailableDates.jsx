import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPublicHalls, getPublicAvailability } from '../../lib/api'

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD      = '#C8A96E'
const DARK      = '#1A1A18'
const CREAM     = '#F5F4EF'
const BORDER    = '#E8E5DC'
const TEXT      = '#1C1C1A'
const MUTED     = '#6B7280'

const SLOTS = [
  { id: 'afternoon', label: '1:00 PM – 4:00 PM', short: '1–4 PM',   icon: '☀️' },
  { id: 'evening',   label: '7:00 PM – 10:00 PM', short: '7–10 PM', icon: '🌙' },
]

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Availability → colour mapping ───────────────────────────────────────────
function availColor(free, total) {
  if (total === 0 || free === 0) return { bg: '#E5E7EB', fg: '#6B7280', ring: '#9CA3AF', label: 'Fully Booked' }
  const pct = free / total
  if (pct > 0.7) return { bg: '#DCFCE7', fg: '#166534', ring: '#4ADE80', label: 'Highly Available' }
  if (pct > 0.5) return { bg: '#D9F99D', fg: '#365314', ring: '#84CC16', label: 'Available' }
  if (pct > 0.3) return { bg: '#FEF9C3', fg: '#713F12', ring: '#FACC15', label: 'Limited' }
  return               { bg: '#FEE2E2', fg: '#991B1B', ring: '#F87171', label: 'Very Limited' }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function prettyDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AvailableDates() {
  const navigate   = useNavigate()
  const todayLocal = (() => { const t = new Date(); t.setHours(0,0,0,0); return t })()
  const todayKey   = toDateKey(todayLocal.getFullYear(), todayLocal.getMonth(), todayLocal.getDate())

  const [viewY, setViewY]   = useState(todayLocal.getFullYear())
  const [viewM, setViewM]   = useState(todayLocal.getMonth())
  const [selDate, setSelDate] = useState(null)
  const [selSlot, setSelSlot] = useState(null)

  // Real data state
  const [halls, setHalls]             = useState([])
  const [monthBookings, setMonthBookings] = useState([])   // [{ date, hallId, slot }]
  const [hallsLoading, setHallsLoading]   = useState(true)
  const [availLoading, setAvailLoading]   = useState(false)
  const [error, setError]             = useState(null)

  // Fetch halls once on mount
  useEffect(() => {
    getPublicHalls()
      .then(res => setHalls(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setHallsLoading(false))
  }, [])

  // Fetch availability whenever the viewed month changes
  useEffect(() => {
    setAvailLoading(true)
    getPublicAvailability(viewY, viewM + 1)   // API expects 1-indexed month
      .then(res => setMonthBookings(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setAvailLoading(false))
  }, [viewY, viewM])

  const TOTAL_SLOTS = halls.length * SLOTS.length

  // ── Calendar grid ──────────────────────────────────────────────────────────
  const calCells = useMemo(() => {
    const firstDow    = new Date(viewY, viewM, 1).getDay()
    const daysInMonth = new Date(viewY, viewM + 1, 0).getDate()
    const cells = Array(firstDow).fill(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const key  = toDateKey(viewY, viewM, d)
      const date = new Date(viewY, viewM, d)
      const past = date < todayLocal
      cells.push({ d, key, past, isToday: key === todayKey })
    }
    return cells
  }, [viewY, viewM])

  // ── Booking data for selected date ─────────────────────────────────────────
  // bookedSet contains strings like "<hallId>-<slot>"
  const bookedSet = useMemo(() => {
    if (!selDate) return new Set()
    return new Set(
      monthBookings
        .filter(b => b.date === selDate)
        .map(b => `${b.hallId}-${b.slot}`)
    )
  }, [selDate, monthBookings])

  const hallRows = useMemo(() => {
    if (!selDate) return []
    return halls.map(h => {
      const id    = h._id.toString()
      const slots = SLOTS.map(s => ({ ...s, free: !bookedSet.has(`${id}-${s.id}`) }))
      return { ...h, id, slots, anyFree: slots.some(s => s.free) }
    })
  }, [selDate, bookedSet, halls])

  const visibleHalls = useMemo(() => {
    if (!selDate) return []
    if (!selSlot) return hallRows
    return hallRows.filter(h => !bookedSet.has(`${h.id}-${selSlot}`))
  }, [hallRows, selDate, selSlot, bookedSet])

  // ── Month navigation ───────────────────────────────────────────────────────
  const prevMonth = () => viewM === 0 ? (setViewY(y => y - 1), setViewM(11)) : setViewM(m => m - 1)
  const nextMonth = () => viewM === 11 ? (setViewY(y => y + 1), setViewM(0)) : setViewM(m => m + 1)

  const pickDate = (key) => {
    if (key === selDate) { setSelDate(null); setSelSlot(null) }
    else { setSelDate(key); setSelSlot(null) }
  }

  const totalFreeOnDay = selDate ? TOTAL_SLOTS - bookedSet.size : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        .ad { font-family:'Inter',system-ui,sans-serif; color:${TEXT}; min-height:100vh; background:${CREAM}; }
        .ad * { box-sizing:border-box; margin:0; padding:0; }
        .ad-serif { font-family:'Playfair Display',Georgia,serif; }

        .cal-cell {
          aspect-ratio:1; display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          border-radius:8px; font-size:.82rem; font-weight:600;
          cursor:pointer; position:relative;
          border:2px solid transparent;
          transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
          user-select:none;
        }
        .cal-cell:not(.cal-past):hover {
          transform:scale(1.1); z-index:2;
          box-shadow:0 4px 14px rgba(0,0,0,.13);
        }
        .cal-cell.cal-past   { cursor:default; opacity:.38; }
        .cal-cell.cal-sel    { border-color:${DARK} !important; box-shadow:0 0 0 3px rgba(200,169,110,.45) !important; }
        .cal-cell.cal-today::after {
          content:''; position:absolute; bottom:5px; left:50%; transform:translateX(-50%);
          width:4px; height:4px; border-radius:50%; background:${GOLD};
        }

        .hall-card {
          background:#fff; border-radius:16px; border:1px solid ${BORDER};
          overflow:hidden;
          transition:transform .22s ease, box-shadow .22s ease;
        }
        .hall-card:hover { transform:translateY(-4px); box-shadow:0 14px 36px rgba(0,0,0,.10); }

        .slot-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:7px 16px; border-radius:50px; font-size:.82rem;
          font-weight:500; cursor:pointer;
          border:1.5px solid transparent;
          transition:all .18s ease;
          font-family:'Inter',system-ui,sans-serif;
        }
        .slot-pill:hover { transform:translateY(-1px); }

        .slot-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 13px; border-radius:50px; font-size:.78rem; font-weight:500;
          border:1px solid;
        }

        .mnav {
          width:34px; height:34px; border-radius:8px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          font-size:1.1rem; font-weight:700; line-height:1;
          border:1.5px solid ${BORDER}; background:#fff; color:${MUTED};
          transition:all .18s;
        }
        .mnav:hover { background:${DARK}; color:#fff; border-color:${DARK}; }

        .gold-btn {
          display:inline-flex; align-items:center; gap:6px;
          background:${GOLD}; color:#fff; border:none; cursor:pointer;
          font-family:'Inter',system-ui,sans-serif; font-weight:600;
          transition:background .18s, transform .15s;
        }
        .gold-btn:hover { background:#b8935a; transform:translateY(-1px); }

        @media (max-width:900px) {
          .ad-layout { flex-direction:column !important; }
          .ad-cal    { max-width:100% !important; width:100% !important; flex-shrink:1 !important; }
          .ad-results { width:100% !important; }
          .hall-thumb { width:110px !important; }
        }
        @media (max-width:500px) {
          .cal-cell { font-size:.72rem; border-radius:6px; }
          .hall-thumb { display:none !important; }
        }
      `}</style>

      <div className="ad">

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav style={{
          background:DARK, height:'60px', padding:'0 28px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          position:'sticky', top:0, zIndex:50,
          borderBottom:'1px solid rgba(200,169,110,.12)',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.55)',
              fontSize:'.85rem', display:'flex', alignItems:'center', gap:'6px',
              fontFamily:'Inter,system-ui,sans-serif', fontWeight:500,
              transition:'color .18s',
            }}
            onMouseOver={e => e.currentTarget.style.color = GOLD}
            onMouseOut={e  => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
          >
            ← Home
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{
              width:'30px', height:'30px', borderRadius:'7px', background:GOLD,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:800, fontSize:'.75rem',
            }}>VF</div>
            <span style={{ color:'#fff', fontWeight:600, fontSize:'1rem' }}>Venue Flow</span>
          </div>
        </nav>

        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <div style={{ background:DARK, padding:'44px 28px 56px', textAlign:'center' }}>
          <p style={{ color:GOLD, fontSize:'.72rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'14px' }}>
            Plan Your Event
          </p>
          <h1 className="ad-serif" style={{
            color:'#fff', fontSize:'clamp(1.9rem, 3.5vw, 2.9rem)',
            fontWeight:400, lineHeight:1.2, marginBottom:'14px',
          }}>
            Check Available Dates
          </h1>
          <p style={{ color:'rgba(255,255,255,.48)', fontSize:'.95rem', maxWidth:'460px', margin:'0 auto', lineHeight:1.7 }}>
            Pick a date to explore available halls. Narrow down further by selecting a time slot.
          </p>
        </div>

        {/* ── ERROR BANNER ─────────────────────────────────────────────────── */}
        {error && (
          <div style={{
            background:'#FEE2E2', border:'1px solid #FECACA', color:'#991B1B',
            padding:'12px 24px', textAlign:'center', fontSize:'.88rem',
          }}>
            {error} — please refresh or try again.
          </div>
        )}

        {/* ── MAIN LAYOUT ─────────────────────────────────────────────────── */}
        <div className="ad-layout" style={{
          display:'flex', gap:'22px',
          padding:'26px 24px 72px', maxWidth:'1220px', margin:'0 auto',
          alignItems:'flex-start',
        }}>

          {/* ── LEFT COLUMN: Calendar ────────────────────────────────────── */}
          <div className="ad-cal" style={{ width:'400px', flexShrink:0 }}>
            <div style={{
              background:'#fff', borderRadius:'18px', border:`1px solid ${BORDER}`,
              padding:'22px', marginBottom:'16px', boxShadow:'0 2px 12px rgba(0,0,0,.04)',
            }}>
              {/* Month nav */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
                <button className="mnav" onClick={prevMonth}>‹</button>
                <h2 style={{ fontWeight:700, fontSize:'1rem', color:TEXT }}>
                  {MONTH_NAMES[viewM]} {viewY}
                  {availLoading && (
                    <span style={{ marginLeft:'8px', fontSize:'.7rem', color:MUTED, fontWeight:400 }}>loading…</span>
                  )}
                </h2>
                <button className="mnav" onClick={nextMonth}>›</button>
              </div>

              {/* Day-of-week headers */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'3px', marginBottom:'4px' }}>
                {DAY_NAMES.map(d => (
                  <div key={d} style={{
                    textAlign:'center', fontSize:'.68rem', fontWeight:700,
                    color:MUTED, padding:'4px 0', letterSpacing:'.5px',
                  }}>{d}</div>
                ))}
              </div>

              {/* Calendar cells */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'3px' }}>
                {calCells.map((cell, i) => {
                  if (!cell) return <div key={`b-${i}`} />
                  const isSel = selDate === cell.key
                  return (
                    <div
                      key={cell.key}
                      className={[
                        'cal-cell',
                        cell.past    ? 'cal-past' : '',
                        isSel        ? 'cal-sel'  : '',
                        cell.isToday ? 'cal-today': '',
                      ].join(' ')}
                      style={{
                        background: cell.past ? '#F3F4F6' : '#fff',
                        color:      cell.past ? '#C0C4CE' : TEXT,
                      }}
                      onClick={() => !cell.past && pickDate(cell.key)}
                    >
                      {cell.d}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Results ────────────────────────────────────── */}
          <div className="ad-results" style={{ flex:1, minWidth:0 }}>

            {/* Loading state */}
            {hallsLoading && (
              <div style={{
                background:'#fff', borderRadius:'18px', border:`1px solid ${BORDER}`,
                padding:'80px 40px', textAlign:'center',
                boxShadow:'0 2px 12px rgba(0,0,0,.04)',
              }}>
                <p style={{ color:MUTED, fontSize:'1rem' }}>Loading halls…</p>
              </div>
            )}

            {/* No date selected */}
            {!hallsLoading && !selDate && (
              <div style={{
                background:'#fff', borderRadius:'18px', border:`1px solid ${BORDER}`,
                padding:'80px 40px', textAlign:'center',
                boxShadow:'0 2px 12px rgba(0,0,0,.04)',
              }}>
                <div style={{ fontSize:'2.8rem', marginBottom:'20px' }}>📅</div>
                <h3 className="ad-serif" style={{ color:TEXT, fontSize:'1.5rem', fontWeight:400, marginBottom:'10px' }}>
                  Select a Date
                </h3>
                <p style={{ color:MUTED, fontSize:'.93rem', lineHeight:1.75, maxWidth:'320px', margin:'0 auto' }}>
                  Click any future date on the calendar to see which halls and time slots are available.
                </p>
              </div>
            )}

            {/* Date selected */}
            {!hallsLoading && selDate && (
              <>
                {/* Date header + summary + slot filter */}
                <div style={{
                  background:'#fff', borderRadius:'18px', border:`1px solid ${BORDER}`,
                  padding:'22px 24px', marginBottom:'16px',
                  boxShadow:'0 2px 12px rgba(0,0,0,.04)',
                }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'6px', flexWrap:'wrap' }}>
                    <div>
                      <p style={{ color:MUTED, fontSize:'.7rem', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'5px' }}>
                        Selected Date
                      </p>
                      <h2 className="ad-serif" style={{ color:TEXT, fontSize:'1.35rem', fontWeight:400 }}>
                        {prettyDate(selDate)}
                      </h2>
                    </div>
                    <div style={{
                      display:'flex', alignItems:'center', gap:'7px',
                      padding:'6px 14px', borderRadius:'50px', flexShrink:0,
                      background: availColor(totalFreeOnDay, TOTAL_SLOTS).bg,
                      border: `1.5px solid ${availColor(totalFreeOnDay, TOTAL_SLOTS).ring}`,
                    }}>
                      <div style={{
                        width:'8px', height:'8px', borderRadius:'50%',
                        background: availColor(totalFreeOnDay, TOTAL_SLOTS).ring,
                      }}/>
                      <span style={{ fontSize:'.78rem', fontWeight:600, color: availColor(totalFreeOnDay, TOTAL_SLOTS).fg }}>
                        {totalFreeOnDay} / {TOTAL_SLOTS} slots free
                      </span>
                    </div>
                  </div>

                  {/* Slot filter */}
                  <div style={{ marginTop:'18px' }}>
                    <p style={{ fontSize:'.7rem', fontWeight:700, color:MUTED, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>
                      Filter by Time Slot
                    </p>
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      <button
                        className="slot-pill"
                        onClick={() => setSelSlot(null)}
                        style={{
                          background: !selSlot ? DARK : CREAM,
                          color:      !selSlot ? '#fff' : TEXT,
                          borderColor:!selSlot ? DARK : BORDER,
                        }}
                      >
                        All Slots
                      </button>

                      {SLOTS.map(s => {
                        const freeCount = halls.filter(h => !bookedSet.has(`${h._id}-${s.id}`)).length
                        const active    = selSlot === s.id
                        return (
                          <button
                            key={s.id}
                            className="slot-pill"
                            onClick={() => setSelSlot(active ? null : s.id)}
                            style={{
                              background: active ? DARK : CREAM,
                              color:      active ? '#fff' : TEXT,
                              borderColor:active ? DARK : BORDER,
                            }}
                          >
                            <span>{s.icon}</span>
                            {s.short}
                            <span style={{
                              background: active ? 'rgba(255,255,255,.2)' : BORDER,
                              color:      active ? '#fff' : MUTED,
                              fontSize:'.72rem', fontWeight:700,
                              padding:'1px 7px', borderRadius:'20px', marginLeft:'2px',
                            }}>
                              {freeCount}/{halls.length}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Result count label */}
                <p style={{ color:MUTED, fontSize:'.82rem', padding:'0 4px', marginBottom:'12px' }}>
                  {selSlot
                    ? `${visibleHalls.length} of ${halls.length} halls available for ${SLOTS.find(s => s.id === selSlot)?.short}`
                    : `All ${halls.length} halls — tap a slot above to filter`}
                </p>

                {/* Hall cards */}
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {visibleHalls.map(hall => {
                    const displaySlots = selSlot
                      ? hall.slots.filter(s => s.id === selSlot)
                      : hall.slots
                    const showCTA = selSlot ? true : hall.anyFree

                    return (
                      <div key={hall.id} className="hall-card">
                        <div style={{ display:'flex', alignItems:'stretch' }}>

                          {/* Thumbnail */}
                          {hall.image && (
                            <div className="hall-thumb" style={{ width:'135px', flexShrink:0 }}>
                              <img
                                src={hall.image}
                                alt={hall.name}
                                loading="lazy"
                                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                              />
                            </div>
                          )}

                          {/* Info */}
                          <div style={{ flex:1, padding:'18px 20px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'12px' }}>
                            <div>
                              <h3 style={{ fontSize:'1.05rem', fontWeight:700, color:TEXT, marginBottom:'3px' }}>
                                {hall.name}
                              </h3>
                              <p style={{ fontSize:'.8rem', color:MUTED, fontWeight:500 }}>
                                Capacity: up to <strong style={{ color:TEXT }}>{hall.capacity.toLocaleString()} guests</strong>
                              </p>
                            </div>

                            {/* Slot badges */}
                            <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                              {displaySlots.map(s => (
                                <span
                                  key={s.id}
                                  className="slot-badge"
                                  style={{
                                    background:   s.free ? '#DCFCE7' : '#F3F4F6',
                                    color:        s.free ? '#166534' : '#9CA3AF',
                                    borderColor:  s.free ? '#86EFAC' : '#E5E7EB',
                                  }}
                                >
                                  <span style={{ fontSize:'.85rem' }}>{s.free ? '✓' : '✗'}</span>
                                  <span>{s.icon}</span>
                                  {s.short}
                                </span>
                              ))}

                              {!hall.anyFree && !selSlot && (
                                <span style={{
                                  padding:'5px 12px', borderRadius:'50px', fontSize:'.75rem',
                                  fontWeight:600, background:'#FEE2E2', color:'#991B1B',
                                  border:'1px solid #FECACA',
                                }}>
                                  Fully Booked Today
                                </span>
                              )}
                            </div>
                          </div>

                          {/* CTA */}
                          {showCTA && (
                            <div style={{
                              padding:'18px 20px', display:'flex', alignItems:'center',
                              borderLeft:`1px solid ${BORDER}`, flexShrink:0,
                            }}>
                              <button
                                className="gold-btn"
                                style={{ padding:'10px 18px', borderRadius:'9px', fontSize:'.8rem', whiteSpace:'nowrap' }}
                                onClick={() => navigate('/request-booking', {
                                  state: { date: selDate, slot: selSlot || '', hall: hall.name }
                                })}
                              >
                                Request Booking
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Empty state for slot filter */}
                  {selSlot && visibleHalls.length === 0 && (
                    <div style={{
                      background:'#fff', borderRadius:'16px', border:`1px solid ${BORDER}`,
                      padding:'56px 32px', textAlign:'center',
                    }}>
                      <div style={{ fontSize:'2.2rem', marginBottom:'16px' }}>🗓️</div>
                      <h4 style={{ fontWeight:700, color:TEXT, marginBottom:'8px' }}>No halls available</h4>
                      <p style={{ color:MUTED, fontSize:'.9rem', lineHeight:1.7, maxWidth:'340px', margin:'0 auto 20px' }}>
                        All halls are booked for the {SLOTS.find(s => s.id === selSlot)?.label} slot on this date.
                        Try a different date, or switch to <strong>All Slots</strong> to see partial availability.
                      </p>
                      <button
                        className="gold-btn"
                        style={{ padding:'10px 22px', borderRadius:'9px', fontSize:'.85rem', margin:'0 auto' }}
                        onClick={() => setSelSlot(null)}
                      >
                        Show All Slots
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
