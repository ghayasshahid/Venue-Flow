import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuSection from './Menu'
import DecorSection from './Decor'

const GOLD = '#C8A96E'
const DARK = '#1A1A18'
const CREAM = '#F5F4EF'
const CREAM_DARK = '#EDEAE0'
const BORDER = '#E8E5DC'
const TEXT = '#1C1C1A'
const MUTED = '#6B7280'

const HERO_IMG = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80'
const CTA_IMG  = 'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=1920&q=80'

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80', alt: 'Grand Ballroom', span: 7, h: 420 },
  { src: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=900&q=80',  alt: 'Garden Marquee',  span: 5, h: 420 },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',  alt: 'Ceremony Hall',  span: 4, h: 300 },
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',  alt: 'Reception Hall', span: 4, h: 300 },
  { src: 'https://images.unsplash.com/photo-1519225421980-b20171be9f68?w=800&q=80',  alt: 'Intimate Hall',  span: 4, h: 300 },
]

const FEATURES = [
  { icon: '🏛️', title: 'Iconic Halls', desc: 'Architecturally stunning spaces with premium interiors crafted to create unforgettable atmospheres for every occasion.' },
  { icon: '📅', title: 'Easy Booking', desc: 'Check real-time availability and reserve your perfect date in minutes — no back-and-forth, no stress.' },
  { icon: '🍽️', title: 'Curated Menus', desc: 'World-class catering packages tailored to your taste, from traditional feasts to modern fusion cuisine.' },
  { icon: '✨', title: 'Decor Packages', desc: 'Handpicked décor themes that transform our halls into a living, breathing version of your vision.' },
  { icon: '🛡️', title: 'Trusted & Reliable', desc: 'Over a decade of flawlessly delivered events. Your special day is in experienced, caring hands.' },
  { icon: '💎', title: 'Premium Experience', desc: 'From your first inquiry to the final farewell, every touchpoint is designed to make you feel like royalty.' },
]

const EVENTS = [
  { label: 'Weddings',   count: '320+', bg: '#fef3e2' },
  { label: 'Receptions', count: '180+', bg: '#f0f4ff' },
  { label: 'Corporate',  count: '95+',  bg: '#f0fff4' },
  { label: 'Birthdays',  count: '150+', bg: '#fff0f3' },
]

const TESTIMONIALS = [
  { name: 'Fatima & Usman', event: 'Wedding Reception', text: "We couldn't have dreamed of a more perfect setting. The hall was breathtaking and the team made everything completely seamless. Truly beyond our expectations!" },
  { name: 'Aisha Khan', event: 'Mehndi Ceremony', text: 'From the first call to the last guest leaving, everything was handled with such warmth and care. The décor team truly understood our vision. Absolutely magical!' },
  { name: 'Ahmed Family', event: 'Valima Dinner', text: 'Our guests are still talking about the venue. The ambiance, the food, the service — every single detail was world-class. We are so grateful for this memory.' },
]

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vf-revealed') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.vf-reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Home() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [showSticky, setShowSticky] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  useReveal()

  useEffect(() => {
    const sectionIds = ['vf-gallery', 'vf-features', 'vf-menu', 'vf-decor', 'vf-contact']
    const onScroll = () => {
      setScrollY(window.scrollY)
      setShowSticky(window.scrollY > 500)
      const mid = window.scrollY + window.innerHeight / 2
      let active = ''
      sectionIds.forEach(id => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= mid) active = id.replace('vf-', '')
      })
      setActiveSection(active)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navSolid = scrollY > 80

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');

        .vf-root { font-family: 'Inter', system-ui, sans-serif; color: ${TEXT}; }
        .vf-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .vf-serif { font-family: 'Playfair Display', Georgia, serif; }

        .vf-reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1);
        }
        .vf-reveal.vf-revealed { opacity: 1; transform: none; }
        .vf-reveal-d1 { transition-delay: 0.1s; }
        .vf-reveal-d2 { transition-delay: 0.2s; }
        .vf-reveal-d3 { transition-delay: 0.3s; }
        .vf-reveal-d4 { transition-delay: 0.4s; }
        .vf-reveal-d5 { transition-delay: 0.5s; }

        @keyframes heroFadeDown { from { opacity:0; transform:translateY(-24px); } to { opacity:1; transform:none; } }
        @keyframes heroFadeUp   { from { opacity:0; transform:translateY(24px);  } to { opacity:1; transform:none; } }
        @keyframes scrollLine   { 0%,100% { opacity:.6; transform:scaleY(1); } 50% { opacity:1; transform:scaleY(1.3); } }
        @keyframes stickyPulse  { 0%,100% { box-shadow:0 0 0 0 rgba(200,169,110,.45); } 60% { box-shadow:0 0 0 14px rgba(200,169,110,0); } }

        .vf-hero-eyebrow { animation: heroFadeDown .9s ease .2s both; }
        .vf-hero-h1      { animation: heroFadeDown .9s ease .45s both; }
        .vf-hero-sub     { animation: heroFadeUp  .9s ease .7s both; }
        .vf-hero-ctas    { animation: heroFadeUp  .9s ease .9s both; }

        .vf-gold-btn {
          display:inline-flex; align-items:center; gap:8px;
          background: linear-gradient(135deg, #d4b47a 0%, ${GOLD} 50%, #b8935a 100%);
          background-size: 200% auto;
          color:#fff; border:none; cursor:pointer;
          font-family:'Inter',system-ui,sans-serif; font-weight:600;
          transition: background-position .5s ease, transform .2s ease, box-shadow .2s ease;
        }
        .vf-gold-btn:hover {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(200,169,110,.38);
        }
        .vf-outline-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; border:1.5px solid rgba(255,255,255,.35);
          color:#fff; cursor:pointer;
          font-family:'Inter',system-ui,sans-serif; font-weight:500;
          transition: border-color .2s, color .2s, transform .2s;
        }
        .vf-outline-btn:hover {
          border-color:${GOLD}; color:${GOLD}; transform:translateY(-2px);
        }

        .vf-gallery-img {
          width:100%; height:100%; object-fit:cover;
          transition: transform .7s cubic-bezier(.16,1,.3,1);
          display:block;
        }
        .vf-gallery-cell:hover .vf-gallery-img { transform:scale(1.06); }

        .vf-feature-card {
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .vf-feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,.10);
        }

        .vf-sticky-btn { animation: stickyPulse 2.5s infinite; }

        .vf-nav-link {
          color:rgba(255,255,255,.75); text-decoration:none;
          font-size:.88rem; font-weight:500; letter-spacing:.02em;
          transition:color .2s; cursor:pointer;
        }
        .vf-nav-link:hover { color:${GOLD}; }
        .vf-nav-active { color:${GOLD} !important; }

        .vf-scroll-line {
          width:1px; height:48px;
          background:linear-gradient(to bottom, ${GOLD}, transparent);
          animation: scrollLine 1.8s ease-in-out infinite;
        }

        .vf-divider {
          width:56px; height:2px;
          background:linear-gradient(90deg,${GOLD},rgba(200,169,110,.2));
          margin:0 auto;
        }

        .vf-stat-num {
          font-family:'Playfair Display',Georgia,serif;
          font-size:2.8rem; color:${GOLD}; line-height:1;
        }
        .vf-stat-label { color:rgba(255,255,255,.45); font-size:.8rem; letter-spacing:1px; margin-top:6px; }

        @media (max-width:768px) {
          .vf-nav-links { display:none; }
          .vf-gallery-grid { grid-template-columns:1fr !important; }
          .vf-gallery-cell { grid-column:span 1 !important; height:260px !important; }
          .vf-features-grid { grid-template-columns:1fr !important; }
          .vf-events-grid { grid-template-columns:1fr 1fr !important; }
          .vf-join-wrap { flex-direction:column; }
          .vf-footer-cols { flex-direction:column; gap:32px !important; }
          .vf-stats-bar { gap:40px !important; padding:40px 24px !important; }
          .vf-hero-h1 { font-size:clamp(2rem,8vw,3rem) !important; }
        }
      `}</style>

      <div className="vf-root">

        {/* ── STICKY FLOATING BUTTON ─────────────────────────────── */}
        <div style={{
          position:'fixed', right:'28px', bottom:'36px', zIndex:999,
          opacity: showSticky ? 1 : 0,
          transform: showSticky ? 'translateY(0) scale(1)' : 'translateY(16px) scale(.92)',
          transition:'all .4s cubic-bezier(.16,1,.3,1)',
          pointerEvents: showSticky ? 'auto' : 'none',
        }}>
          <button
            className="vf-gold-btn vf-sticky-btn"
            style={{ padding:'13px 22px', borderRadius:'50px', fontSize:'.85rem' }}
            onClick={() => navigate('/available-dates')}
          >
            📅 Check Available Dates
          </button>
        </div>

        {/* ── NAVBAR ─────────────────────────────────────────────── */}
        <nav style={{
          position:'fixed', top:0, left:0, right:0, zIndex:100,
          height:'68px', padding:'0 48px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background: navSolid ? 'rgba(26,26,24,.96)' : 'transparent',
          backdropFilter: navSolid ? 'blur(12px)' : 'none',
          borderBottom: navSolid ? `1px solid rgba(200,169,110,.12)` : 'none',
          transition:'background .4s ease, border-color .4s ease',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{
              width:'34px', height:'34px', borderRadius:'7px', background:GOLD,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:800, fontSize:'.8rem', fontFamily:'Inter,sans-serif',
            }}>VF</div>
            <span style={{ color:'#fff', fontWeight:600, fontSize:'1.05rem', letterSpacing:'.01em' }}>Venue Flow</span>
          </div>
          <div className="vf-nav-links" style={{ display:'flex', alignItems:'center', gap:'32px' }}>
            <a className={`vf-nav-link${activeSection === 'gallery' ? ' vf-nav-active' : ''}`} href="#vf-gallery" onClick={e => { e.preventDefault(); document.getElementById('vf-gallery')?.scrollIntoView({ behavior:'smooth' }) }}>Gallery</a>
            <a className={`vf-nav-link${activeSection === 'features' ? ' vf-nav-active' : ''}`} href="#vf-features" onClick={e => { e.preventDefault(); document.getElementById('vf-features')?.scrollIntoView({ behavior:'smooth' }) }}>Features</a>
            <a className={`vf-nav-link${activeSection === 'menu' ? ' vf-nav-active' : ''}`} href="#vf-menu" onClick={e => { e.preventDefault(); document.getElementById('vf-menu')?.scrollIntoView({ behavior:'smooth' }) }}>Menu</a>
            <a className={`vf-nav-link${activeSection === 'decor' ? ' vf-nav-active' : ''}`} href="#vf-decor" onClick={e => { e.preventDefault(); document.getElementById('vf-decor')?.scrollIntoView({ behavior:'smooth' }) }}>Décor</a>
            <a className={`vf-nav-link${activeSection === 'contact' ? ' vf-nav-active' : ''}`} href="#vf-contact" onClick={e => { e.preventDefault(); document.getElementById('vf-contact')?.scrollIntoView({ behavior:'smooth' }) }}>Contact</a>
            <button
              className="vf-gold-btn"
              style={{ padding:'9px 20px', borderRadius:'8px', fontSize:'.85rem' }}
              onClick={() => navigate('/available-dates')}
            >
              Check Available Dates
            </button>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────────── */}
        <section style={{
          height:'100vh', minHeight:'680px', position:'relative',
          display:'flex', alignItems:'center', justifyContent:'center',
          textAlign:'center', overflow:'hidden',
        }}>
          <img
            src={HERO_IMG}
            alt="Grand Banquet Hall"
            style={{
              position:'absolute', inset:0, width:'100%', height:'100%',
              objectFit:'cover', objectPosition:'center',
              transform:`translateY(${scrollY * .28}px)`,
              willChange:'transform',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(to bottom, rgba(26,26,24,.55) 0%, rgba(26,26,24,.72) 60%, rgba(26,26,24,.9) 100%)',
          }} />
          {/* Gold shimmer line */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:'2px',
            background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }} />

          <div style={{ position:'relative', zIndex:2, padding:'0 24px', maxWidth:'820px', width:'100%' }}>
            <p className="vf-hero-eyebrow" style={{
              color:GOLD, fontSize:'.78rem', letterSpacing:'5px',
              textTransform:'uppercase', marginBottom:'22px',
            }}>Premium Marquee & Banquet Bookings</p>

            <h1 className="vf-hero-h1 vf-serif" style={{
              color:'#fff',
              fontSize:'clamp(2.6rem, 5.5vw, 4.8rem)',
              fontWeight:400, lineHeight:1.13, marginBottom:'26px',
            }}>
              Where Every Celebration<br />
              <em style={{ color:GOLD }}>Becomes a Memory</em>
            </h1>

            <p className="vf-hero-sub" style={{
              color:'rgba(255,255,255,.78)', fontSize:'1.1rem', fontWeight:300,
              maxWidth:'540px', margin:'0 auto 44px', lineHeight:1.8,
            }}>
              Discover breathtaking halls crafted for weddings, receptions, and every milestone that deserves to be celebrated in absolute style.
            </p>

            <div className="vf-hero-ctas" style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
              <button
                className="vf-gold-btn"
                style={{ padding:'15px 36px', borderRadius:'9px', fontSize:'1rem' }}
                onClick={() => navigate('/available-dates')}
              >
                📅 Check Available Dates
              </button>
              <button
                className="vf-outline-btn"
                style={{ padding:'15px 36px', borderRadius:'9px', fontSize:'1rem' }}
                onClick={() => document.getElementById('vf-gallery').scrollIntoView({ behavior:'smooth' })}
              >
                Explore Our Halls ↓
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
            color:'rgba(255,255,255,.35)', fontSize:'.7rem', letterSpacing:'3px',
          }}>
            <span>SCROLL</span>
            <div className="vf-scroll-line" />
          </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────────── */}
        <section className="vf-stats-bar" style={{
          background: DARK, padding:'48px 64px',
          display:'flex', justifyContent:'center', gap:'80px', flexWrap:'wrap',
        }}>
          {[
            { num:'500+', label:'Events Hosted' },
            { num:'12',   label:'Grand Halls'   },
            { num:'98%',  label:'Happy Families'},
            { num:'10+',  label:'Years of Excellence' },
          ].map(({ num, label }, i) => (
            <div key={label} className={`vf-reveal vf-reveal-d${i+1}`} style={{ textAlign:'center' }}>
              <p className="vf-stat-num">{num}</p>
              <p className="vf-stat-label">{label}</p>
            </div>
          ))}
        </section>

        {/* ── PROMISE SECTION ────────────────────────────────────── */}
        <section style={{ background:CREAM, padding:'110px 40px', textAlign:'center' }}>
          <p className="vf-reveal" style={{ color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'16px' }}>
            Our Promise
          </p>
          <h2 className="vf-reveal vf-reveal-d1 vf-serif" style={{
            color:TEXT, fontSize:'clamp(1.9rem, 3.5vw, 3.2rem)',
            fontWeight:400, lineHeight:1.25, maxWidth:'680px',
            margin:'0 auto 28px',
          }}>
            Every celebration deserves<br />a <em style={{ color:GOLD }}>perfect setting</em>
          </h2>
          <div className="vf-reveal vf-reveal-d2 vf-divider" style={{ marginBottom:'28px' }} />
          <p className="vf-reveal vf-reveal-d2" style={{
            color:MUTED, fontSize:'1.05rem', maxWidth:'540px',
            margin:'0 auto', lineHeight:1.85,
          }}>
            We believe the venue is more than just a space — it's the canvas on which your memories are painted. Our halls are designed to make you and your guests feel like royalty from the moment they arrive.
          </p>
        </section>

        {/* ── GALLERY ────────────────────────────────────────────── */}
        <section id="vf-gallery" style={{ padding:'90px 40px', background:'#fff' }}>
          <div style={{ maxWidth:'1240px', margin:'0 auto' }}>
            <p className="vf-reveal" style={{ textAlign:'center', color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'12px' }}>
              Our Halls
            </p>
            <h2 className="vf-reveal vf-reveal-d1 vf-serif" style={{
              textAlign:'center', color:TEXT,
              fontSize:'clamp(1.9rem, 3vw, 2.6rem)',
              fontWeight:400, marginBottom:'52px',
            }}>
              Venues That Leave You Breathless
            </h2>

            <div className="vf-gallery-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(12, 1fr)',
              gap:'14px',
            }}>
              {GALLERY.map(({ src, alt, span, h }, i) => (
                <div
                  key={alt}
                  className={`vf-gallery-cell vf-reveal vf-reveal-d${Math.min(i+1,5)}`}
                  style={{
                    gridColumn:`span ${span}`,
                    height:`${h}px`,
                    borderRadius:'14px',
                    overflow:'hidden',
                    cursor:'pointer',
                    background: CREAM_DARK,
                  }}
                >
                  <img className="vf-gallery-img" src={src} alt={alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DARK QUOTE SECTION ─────────────────────────────────── */}
        <section style={{
          background: DARK, padding:'110px 40px',
          textAlign:'center', position:'relative', overflow:'hidden',
        }}>
          {/* decorative giant quote mark */}
          <div aria-hidden style={{
            position:'absolute', top:'-40px', left:'50%', transform:'translateX(-50%)',
            fontSize:'18rem', color:'rgba(200,169,110,.04)',
            fontFamily:'Georgia, serif', lineHeight:1, userSelect:'none',
            pointerEvents:'none',
          }}>"</div>

          <p className="vf-reveal" style={{ color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'28px' }}>
            We Value You
          </p>
          <blockquote className="vf-reveal vf-reveal-d1 vf-serif" style={{
            color:'#fff', fontSize:'clamp(1.35rem, 2.8vw, 2.1rem)',
            fontStyle:'italic', fontWeight:400,
            maxWidth:'800px', margin:'0 auto 36px', lineHeight:1.6,
          }}>
            "You deserve a venue that matches the magnitude of your moment — and we've spent a decade building ours for exactly that."
          </blockquote>
          <div className="vf-reveal vf-reveal-d2 vf-divider" style={{ marginBottom:'28px' }} />
          <p className="vf-reveal vf-reveal-d2" style={{ color:'rgba(255,255,255,.35)', fontSize:'.9rem' }}>
            — The Venue Flow Team
          </p>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────── */}
        <section id="vf-features" style={{ padding:'100px 40px', background:CREAM }}>
          <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
            <p className="vf-reveal" style={{ textAlign:'center', color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'12px' }}>
              Why Choose Us
            </p>
            <h2 className="vf-reveal vf-reveal-d1 vf-serif" style={{
              textAlign:'center', color:TEXT,
              fontSize:'clamp(1.9rem, 3vw, 2.6rem)',
              fontWeight:400, marginBottom:'14px',
            }}>
              Everything You Need, Nothing Less
            </h2>
            <p className="vf-reveal vf-reveal-d2" style={{
              textAlign:'center', color:MUTED, fontSize:'1rem',
              maxWidth:'480px', margin:'0 auto 60px', lineHeight:1.8,
            }}>
              From the first inquiry to the final farewell, we handle every detail so you can focus on what truly matters.
            </p>

            <div className="vf-features-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
              gap:'20px',
            }}>
              {FEATURES.map(({ icon, title, desc }, i) => (
                <div key={title} className={`vf-feature-card vf-reveal vf-reveal-d${Math.min(i+1,5)}`} style={{
                  background:'#fff', borderRadius:'16px', padding:'36px 28px',
                  border:`1px solid ${BORDER}`,
                }}>
                  <div style={{
                    width:'52px', height:'52px', borderRadius:'12px',
                    background:'rgba(200,169,110,.09)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.75rem', marginBottom:'20px',
                  }}>{icon}</div>
                  <h3 className="vf-serif" style={{ color:TEXT, fontSize:'1.2rem', fontWeight:400, marginBottom:'12px' }}>{title}</h3>
                  <p style={{ color:MUTED, fontSize:'.9rem', lineHeight:1.75 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MENU ────────────────────────────────────────────────── */}
        <section id="vf-menu">
          <div style={{
            background: DARK, padding:'80px 40px 52px',
            textAlign:'center', position:'relative', overflow:'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1400&q=60"
              alt="" aria-hidden
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.14 }}
            />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <p className="vf-reveal" style={{ color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'14px', position:'relative' }}>
              Our Catering
            </p>
            <h2 className="vf-reveal vf-reveal-d1 vf-serif" style={{ color:'#fff', fontSize:'clamp(1.9rem,3.5vw,2.8rem)', fontWeight:400, marginBottom:'14px', position:'relative' }}>
              A Feast Worthy of <em style={{ color:GOLD }}>Your Celebration</em>
            </h2>
            <p className="vf-reveal vf-reveal-d2" style={{ color:'rgba(255,255,255,.58)', fontSize:'.95rem', maxWidth:'480px', margin:'0 auto', lineHeight:1.8, position:'relative' }}>
              From fragrant biryanis to decadent mithai — every dish crafted by our master chefs for your most cherished day.
            </p>
          </div>
          <MenuSection />
        </section>

        {/* ── DECOR ───────────────────────────────────────────────── */}
        <section id="vf-decor">
          <div style={{
            background: DARK, padding:'80px 40px 52px',
            textAlign:'center', position:'relative', overflow:'hidden',
          }}>
            <img
              src="https://images.unsplash.com/photo-1519225421980-b20171be9f68?w=1600&q=50"
              alt="" aria-hidden
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.13 }}
            />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <p className="vf-reveal" style={{ color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'14px', position:'relative' }}>
              Décor & Styling
            </p>
            <h2 className="vf-reveal vf-reveal-d1 vf-serif" style={{ color:'#fff', fontSize:'clamp(1.9rem,3.5vw,2.8rem)', fontWeight:400, marginBottom:'14px', position:'relative' }}>
              Spaces That Tell <em style={{ color:GOLD }}>Your Love Story</em>
            </h2>
            <p className="vf-reveal vf-reveal-d2" style={{ color:'rgba(255,255,255,.58)', fontSize:'.95rem', maxWidth:'480px', margin:'0 auto 32px', lineHeight:1.8, position:'relative' }}>
              From lush floral arches to shimmering fairy-light canopies — every detail designed to make your celebration unforgettable.
            </p>
            <button
              className="vf-gold-btn vf-reveal vf-reveal-d3"
              style={{ padding:'13px 30px', borderRadius:'9px', fontSize:'.9rem', position:'relative' }}
              onClick={() => navigate('/request-booking')}
            >
              Request a Décor Quote →
            </button>
          </div>
          <DecorSection />
        </section>

        {/* ── JOIN SECTION ───────────────────────────────────────── */}
        <section style={{ background:'#fff', padding:'100px 40px' }}>
          <div className="vf-join-wrap" style={{
            maxWidth:'1100px', margin:'0 auto',
            display:'flex', alignItems:'center',
            gap:'72px', flexWrap:'wrap',
          }}>
            {/* Text side */}
            <div className="vf-reveal" style={{ flex:'1', minWidth:'280px', maxWidth:'500px' }}>
              <p style={{ color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'18px' }}>
                Join Our Family
              </p>
              <h2 className="vf-serif" style={{
                color:TEXT, fontSize:'clamp(1.9rem, 3vw, 2.8rem)',
                fontWeight:400, lineHeight:1.25, marginBottom:'22px',
              }}>
                Hundreds of families<br />have celebrated here.<br />
                <em style={{ color:GOLD }}>Now it's your turn.</em>
              </h2>
              <p style={{ color:MUTED, fontSize:'1rem', lineHeight:1.85, marginBottom:'36px' }}>
                Every event we host is a story of love, laughter, and lifelong memories. We are deeply honored to be part of so many families' most precious milestones.
              </p>
              <button
                className="vf-gold-btn"
                style={{ padding:'14px 32px', borderRadius:'9px', fontSize:'.95rem' }}
                onClick={() => navigate('/available-dates')}
              >
                Check Available Dates →
              </button>
            </div>

            {/* Event count grid */}
            <div className="vf-events-grid vf-reveal vf-reveal-d1" style={{
              flex:'1', minWidth:'260px', maxWidth:'440px',
              display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px',
            }}>
              {EVENTS.map(({ label, count, bg }) => (
                <div key={label} style={{
                  background:bg, borderRadius:'14px', padding:'32px 20px', textAlign:'center',
                }}>
                  <p className="vf-serif" style={{ color:TEXT, fontSize:'2.2rem', fontWeight:500 }}>{count}</p>
                  <p style={{ color:MUTED, fontSize:'.82rem', marginTop:'6px', letterSpacing:'.5px' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────── */}
        <section style={{ background:CREAM, padding:'100px 40px' }}>
          <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
            <p className="vf-reveal" style={{ textAlign:'center', color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'12px' }}>
              Testimonials
            </p>
            <h2 className="vf-reveal vf-reveal-d1 vf-serif" style={{
              textAlign:'center', color:TEXT,
              fontSize:'clamp(1.9rem, 3vw, 2.6rem)',
              fontWeight:400, marginBottom:'52px',
            }}>
              Families Love Us
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'22px' }}>
              {TESTIMONIALS.map(({ name, event, text }, i) => (
                <div key={name} className={`vf-reveal vf-reveal-d${i+1}`} style={{
                  background:'#fff', borderRadius:'18px', padding:'38px 30px',
                  border:`1px solid ${BORDER}`,
                  display:'flex', flexDirection:'column',
                }}>
                  {/* Star rating */}
                  <div style={{ color:GOLD, fontSize:'1rem', marginBottom:'18px', letterSpacing:'2px' }}>★★★★★</div>
                  {/* Quote mark */}
                  <div className="vf-serif" style={{
                    fontSize:'3.5rem', color:'rgba(200,169,110,.18)',
                    lineHeight:.7, marginBottom:'16px',
                  }}>"</div>
                  <p style={{ color:'#555', fontSize:'.95rem', lineHeight:1.85, fontStyle:'italic', flexGrow:1, marginBottom:'28px' }}>
                    {text}
                  </p>
                  <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:'18px' }}>
                    <p className="vf-serif" style={{ color:TEXT, fontSize:'1rem', fontWeight:500 }}>{name}</p>
                    <p style={{ color:GOLD, fontSize:'.78rem', marginTop:'4px', letterSpacing:'.5px' }}>{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────────────────────── */}
        <section style={{
          position:'relative', height:'520px',
          display:'flex', alignItems:'center', justifyContent:'center',
          textAlign:'center', overflow:'hidden',
        }}>
          <img
            src={CTA_IMG}
            alt="Elegant banquet hall"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
            loading="lazy"
          />
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(135deg, rgba(26,26,24,.92) 0%, rgba(26,26,24,.78) 100%)',
          }} />
          <div style={{ position:'relative', zIndex:2, padding:'0 24px', maxWidth:'680px', width:'100%' }}>
            <p className="vf-reveal" style={{ color:GOLD, fontSize:'.75rem', letterSpacing:'5px', textTransform:'uppercase', marginBottom:'18px' }}>
              Start Planning Today
            </p>
            <h2 className="vf-reveal vf-reveal-d1 vf-serif" style={{
              color:'#fff', fontSize:'clamp(2rem, 4vw, 3.2rem)',
              fontWeight:400, marginBottom:'18px', lineHeight:1.2,
            }}>
              Your dream day starts with one click
            </h2>
            <p className="vf-reveal vf-reveal-d2" style={{
              color:'rgba(255,255,255,.68)', fontSize:'1rem',
              maxWidth:'460px', margin:'0 auto 40px', lineHeight:1.8,
            }}>
              Dates fill up fast — especially during wedding season. Check availability now and secure your perfect day before it's gone.
            </p>
            <button
              className="vf-gold-btn vf-reveal vf-reveal-d3"
              style={{ padding:'17px 44px', borderRadius:'9px', fontSize:'1.05rem', letterSpacing:'.02em' }}
              onClick={() => navigate('/available-dates')}
            >
              📅 Check Available Dates
            </button>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer id="vf-contact" style={{
          background:'#0f0f0e', padding:'72px 48px 32px',
          color:'rgba(255,255,255,.35)', fontFamily:'Inter,system-ui,sans-serif',
        }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <div className="vf-footer-cols" style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'48px', marginBottom:'56px' }}>

              {/* Brand */}
              <div style={{ maxWidth:'300px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
                  <div style={{
                    width:'36px', height:'36px', background:GOLD, borderRadius:'8px',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#fff', fontWeight:800, fontSize:'.85rem',
                  }}>VF</div>
                  <span style={{ color:'#fff', fontSize:'1.05rem', fontWeight:600 }}>Venue Flow</span>
                </div>
                <p style={{ fontSize:'.88rem', lineHeight:1.75 }}>
                  Premium marquee and banquet hall bookings for weddings, receptions, and every celebration worth remembering.
                </p>
                {/* Socials placeholder */}
                <div style={{ display:'flex', gap:'12px', marginTop:'24px' }}>
                  {['f', 'in', 'IG'].map(s => (
                    <div key={s} style={{
                      width:'34px', height:'34px', borderRadius:'8px',
                      border:'1px solid rgba(255,255,255,.1)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'.72rem', color:'rgba(255,255,255,.4)', cursor:'pointer',
                    }}>{s}</div>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div>
                <p style={{ color:'rgba(255,255,255,.85)', marginBottom:'18px', fontSize:'.88rem', fontWeight:600, letterSpacing:'.03em', textTransform:'uppercase' }}>
                  Quick Links
                </p>
                {['Gallery', 'Our Halls', 'Packages', 'About Us'].map(l => (
                  <p key={l} style={{ marginBottom:'12px', fontSize:'.875rem', cursor:'pointer', transition:'color .2s' }}
                    onMouseOver={e => e.currentTarget.style.color = GOLD}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,.35)'}
                  >{l}</p>
                ))}
              </div>

              {/* Services */}
              <div>
                <p style={{ color:'rgba(255,255,255,.85)', marginBottom:'18px', fontSize:'.88rem', fontWeight:600, letterSpacing:'.03em', textTransform:'uppercase' }}>
                  Services
                </p>
                {['Wedding Halls', 'Mehndi Events', 'Corporate Events', 'Birthday Parties'].map(l => (
                  <p key={l} style={{ marginBottom:'12px', fontSize:'.875rem', cursor:'pointer', transition:'color .2s' }}
                    onMouseOver={e => e.currentTarget.style.color = GOLD}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,.35)'}
                  >{l}</p>
                ))}
              </div>

              {/* Contact */}
              <div>
                <p style={{ color:'rgba(255,255,255,.85)', marginBottom:'18px', fontSize:'.88rem', fontWeight:600, letterSpacing:'.03em', textTransform:'uppercase' }}>
                  Contact Us
                </p>
                <p style={{ fontSize:'.875rem', marginBottom:'12px' }}>📞 +92 300 000 0000</p>
                <p style={{ fontSize:'.875rem', marginBottom:'12px' }}>✉️ info@venueflow.com</p>
                <p style={{ fontSize:'.875rem', marginBottom:'28px' }}>📍 Lahore, Pakistan</p>
                <button
                  className="vf-gold-btn"
                  style={{ padding:'11px 22px', borderRadius:'8px', fontSize:'.85rem', width:'100%', justifyContent:'center' }}
                  onClick={() => navigate('/available-dates')}
                >
                  📅 Check Dates
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{
              borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:'28px',
              display:'flex', justifyContent:'space-between', flexWrap:'wrap',
              gap:'12px', alignItems:'center',
              fontSize:'.78rem',
            }}>
              <p>© 2025 Venue Flow. All rights reserved.</p>
              <p>Crafted with care for unforgettable celebrations.</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
