import { useState } from 'react'

const GOLD       = '#C8A96E'
const DARK       = '#1A1A18'
const CREAM      = '#F5F4EF'
const CREAM_DARK = '#EDEAE0'
const BORDER     = '#E8E5DC'
const TEXT       = '#1C1C1A'
const MUTED      = '#6B7280'

const TABS = [
  { key: 'floral',      label: 'Floral & Botanical' },
  { key: 'lights',      label: 'Lights & Draping' },
  { key: 'traditional', label: 'Traditional Desi' },
  { key: 'modern',      label: 'Modern Luxe' },
]

const DECOR = {
  floral: {
    eyebrow: "Nature's Finest",
    heading: 'Floral & Botanical',
    desc: 'Fresh blooms, lush greenery, and hand-crafted arrangements that breathe life and romance into every corner of your venue.',
    items: [
      {
        img: 'https://images.unsplash.com/photo-1519225421980-b20171be9f68?w=700&q=75',
        alt: 'Rose Arch',
        badge: 'Bestseller', badgeType: 'gold',
        name: 'Grand Rose Arch',
        desc: "A sweeping ceremony arch wrapped in thousands of fresh roses — blush, ivory, and champagne — framed by hanging eucalyptus and baby's breath.",
        tag: 'Ceremony',
      },
      {
        img: 'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=700&q=75',
        alt: 'Table Centrepieces',
        badge: 'Signature', badgeType: 'gold',
        name: 'Tall Floral Centrepieces',
        desc: 'Dramatic gold-stand arrangements with cascading orchids, garden roses, and tropical foliage. Makes every dining table a showpiece.',
        tag: 'Reception',
      },
      {
        img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&q=75',
        alt: 'Floral Ceiling',
        badge: 'Premium', badgeType: 'gold',
        name: 'Suspended Floral Ceiling',
        desc: 'An overhead canopy of hanging florals — peonies, hydrangeas, and vines — that transforms the ceiling into a living garden.',
        tag: 'Grand Hall',
      },
      {
        img: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=700&q=75',
        alt: 'Aisle Decor',
        badge: null,
        name: 'Petal Aisle & Pedestals',
        desc: 'Rose-petal-lined aisle with matching floral pedestals and glass globe lanterns. Creates a dreamy path to your forever.',
        tag: 'Ceremony',
      },
      {
        img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=75',
        alt: 'Mehndi Flowers',
        badge: 'Popular', badgeType: 'gold',
        name: 'Mehndi Flower Walls',
        desc: 'Vibrant marigold and genda phool walls paired with colourful rangoli — the perfect Mehndi backdrop radiating festive joy.',
        tag: 'Mehndi',
      },
      {
        img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=75',
        alt: 'Bridal Stage Flowers',
        badge: null,
        name: 'Bridal Stage Florals',
        desc: 'A fully floral-dressed bridal stage with fresh backdrop, floral steps, and cascading side arrangements in your chosen palette.',
        tag: 'Stage',
      },
    ],
  },

  lights: {
    eyebrow: 'Glow & Ambience',
    heading: 'Lights & Draping',
    desc: 'Thousands of twinkling fairy lights, soft canopy drapes, and warm chandeliers that turn any hall into an enchanted evening.',
    items: [
      {
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=75',
        alt: 'Fairy Light Canopy',
        badge: 'Most Loved', badgeType: 'gold',
        name: 'Fairy Light Canopy',
        desc: 'Thousands of warm Edison bulbs cascading from the ceiling in a gentle wave, giving the entire hall a magical starlit glow.',
        tag: 'Full Hall',
      },
      {
        img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=75',
        alt: 'Crystal Chandelier',
        badge: 'Luxury', badgeType: 'gold',
        name: 'Crystal Chandelier Setup',
        desc: 'Hand-selected crystal chandeliers hung at staggered heights over the dining area. Casts dazzling light across every table.',
        tag: 'Dining',
      },
      {
        img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=75',
        alt: 'Silk Draping',
        badge: 'Signature', badgeType: 'gold',
        name: 'Silk Ceiling Draping',
        desc: "Flowing ivory or champagne silk gathered from a central focal point and draped outward. Instantly elevates any hall's grandeur.",
        tag: 'Full Hall',
      },
      {
        img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&q=75',
        alt: 'Uplighting',
        badge: null,
        name: 'Uplighting & Wash',
        desc: 'Programmable LED uplights placed around the perimeter to bathe walls in your chosen colour — soft gold, blush pink, or royal blue.',
        tag: 'Ambience',
      },
      {
        img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&q=75',
        alt: 'Neon Sign',
        badge: 'Trendy', badgeType: 'gold',
        name: 'Custom Neon Sign',
        desc: 'Bespoke neon sign with your names or a phrase of your choice — a modern, Instagram-worthy centrepiece for your bridal stage.',
        tag: 'Stage',
      },
      {
        img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&q=75',
        alt: 'Lantern Pathway',
        badge: null,
        name: 'Lantern Pathway',
        desc: 'Glass lanterns with pillar candles lining the entrance pathway and hallways. Creates a warm, welcoming glow for arriving guests.',
        tag: 'Entrance',
      },
    ],
  },

  traditional: {
    eyebrow: 'Heritage & Warmth',
    heading: 'Traditional Desi',
    desc: 'Rich fabrics, vibrant marigolds, and time-honoured motifs that celebrate the depth and beauty of South Asian wedding traditions.',
    items: [
      {
        img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=75',
        alt: 'Phool Patti Stage',
        badge: 'Iconic', badgeType: 'gold',
        name: 'Phool Patti Bridal Stage',
        desc: 'A traditional bridal stage framed with marigold garlands, jasmine strings, and rose petal curtains — the quintessential Desi wedding backdrop.',
        tag: 'Stage',
      },
      {
        img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&q=75',
        alt: 'Mehndi Decor',
        badge: 'Festive', badgeType: 'gold',
        name: 'Mehndi Jhoola & Decor',
        desc: 'Vibrant floral jhoola (swing) draped in marigolds and carnations, paired with colourful cushion seating and rangoli patterns.',
        tag: 'Mehndi',
      },
      {
        img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=75',
        alt: 'Tent Shamiana',
        badge: 'Grand', badgeType: 'gold',
        name: 'Embroidered Shamiana',
        desc: 'A richly embroidered ceiling shamiana in deep red and gold with tasseled edges. Instantly evokes the grandeur of a royal baraat.',
        tag: 'Full Hall',
      },
      {
        img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&q=75',
        alt: 'Brass Decor',
        badge: null,
        name: 'Brass & Copper Accents',
        desc: 'Antique brass urns, copper lanterns, and diya clusters at entrance, table centres, and aisle — warmth meets old-world elegance.',
        tag: 'Accents',
      },
      {
        img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=700&q=75',
        alt: 'Dastarkhwan Setup',
        badge: 'Traditional', badgeType: 'gold',
        name: 'Floor Dastarkhwan Setup',
        desc: 'Authentic dastarkhwan-style dining with embroidered floor spreads, bolster cushions, and low brass tableware. A truly regal feast experience.',
        tag: 'Dining',
      },
      {
        img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=700&q=75',
        alt: 'Doli Exit',
        badge: null,
        name: 'Doli & Exit Decor',
        desc: 'A beautifully decorated doli carriage flanked by flower-strewn pathways and rose-petal cannons for an unforgettable rukhsati moment.',
        tag: 'Exit',
      },
    ],
  },

  modern: {
    eyebrow: 'Contemporary Elegance',
    heading: 'Modern Luxe',
    desc: 'Clean lines, metallic accents, and architectural floral installations — for the couple who wants sophistication with a dramatic edge.',
    items: [
      {
        img: 'https://images.unsplash.com/photo-1519225421980-b20171be9f68?w=700&q=75',
        alt: 'Geometric Arch',
        badge: 'Trending', badgeType: 'gold',
        name: 'Gold Geometric Arch',
        desc: 'A hexagonal or circular gold metal arch adorned with minimal white blooms and trailing greenery. Sleek, modern, and utterly photogenic.',
        tag: 'Ceremony',
      },
      {
        img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700&q=75',
        alt: 'Acrylic Seating Chart',
        badge: null,
        name: 'Acrylic Seating Chart & Signage',
        desc: 'Custom laser-cut acrylic seating charts, welcome signs, and table numbers with elegant calligraphy and gold leafing.',
        tag: 'Stationery',
      },
      {
        img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&q=75',
        alt: 'Minimalist Stage',
        badge: 'Signature', badgeType: 'gold',
        name: 'Minimalist Floating Stage',
        desc: 'A raised floating stage in matte white with flush LED strip lighting, flanked by two sculptural floral columns. Understated luxury.',
        tag: 'Stage',
      },
      {
        img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=700&q=75',
        alt: 'Mirror Ball',
        badge: 'Statement', badgeType: 'gold',
        name: 'Giant Mirror Ball & Disco',
        desc: 'An oversized mirror ball with DJ truss lighting for the dance floor — transforms any reception into a glamorous late-night party.',
        tag: 'Dance Floor',
      },
      {
        img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&q=75',
        alt: 'Floral Installation',
        badge: 'Art Piece', badgeType: 'gold',
        name: 'Sculptural Floral Installation',
        desc: "A large-scale art-like floral sculpture — think blooms cascading from an asymmetric structure — that doubles as the room's focal point.",
        tag: 'Statement',
      },
      {
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=75',
        alt: 'Ghost Chairs',
        badge: null,
        name: 'Ghost Chairs & Velvet Linens',
        desc: 'Transparent polycarbonate ghost chairs paired with deep velvet tablecloths in emerald, navy, or burgundy. Modern drama at the dining table.',
        tag: 'Furniture',
      },
    ],
  },
}

const PACKAGES = [
  {
    name: 'Silver',
    sub: 'Intimate Ceremonies',
    price: 'Rs 85,000',
    per: 'full setup · halls up to 300 guests',
    featured: false,
    items: [
      'Bridal stage with floral backdrop',
      'Entrance floral arrangement',
      '10 table centrepieces',
      'Fairy light string canopy',
      'Colour-coordinated draping',
      'Basic uplighting (4 colours)',
      'Setup & breakdown crew',
    ],
  },
  {
    name: 'Gold',
    sub: 'Classic Wedding Package',
    price: 'Rs 1,60,000',
    per: 'full setup · halls up to 500 guests',
    featured: true,
    items: [
      'Grand floral arch or jhoola',
      'Luxury bridal stage (full floral)',
      'Suspended floral or light canopy',
      '20 premium centrepieces',
      'Silk ceiling & wall draping',
      'Full perimeter uplighting',
      'Custom neon or acrylic sign',
      'Aisle décor & petal runner',
      'Dedicated décor coordinator',
    ],
  },
  {
    name: 'Platinum',
    sub: 'Grand Baraat Banquet',
    price: 'Rs 3,00,000',
    per: 'full setup · unlimited capacity',
    featured: false,
    items: [
      'Everything in Gold',
      'Full floral ceiling installation',
      'Crystal chandelier cluster',
      'Custom shamiana or canopy',
      'Entrance gate full floral',
      'Photo wall & selfie booth',
      'Mirror ball & dance-floor lighting',
      'Doli exit décor',
      '2 on-site décor stylists',
    ],
  },
]

const STYLES = [
  { label: 'Floral Romance',  img: 'https://images.unsplash.com/photo-1519225421980-b20171be9f68?w=600&q=75', palette: ['#f9c6c6','#fde8d0','#fff5f5'] },
  { label: 'Golden Glam',     img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=75', palette: ['#f5e6c8','#e8c97a','#1A1A18'] },
  { label: 'Rustic Desi',     img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=75', palette: ['#f5a623','#e05c00','#2d1a00'] },
  { label: 'Midnight Luxe',   img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=75', palette: ['#1e1b4b','#312e81','#C8A96E'] },
]

function getBadgeStyle(type) {
  if (type === 'spicy') return { background: '#b33a1a', color: '#fff' }
  return { background: GOLD, color: '#fff' }
}

export default function DecorSection() {
  const [activeTab, setActiveTab]   = useState('floral')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredPkg, setHoveredPkg]   = useState(null)

  const section = DECOR[activeTab]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;700&display=swap');

        .dcr-root { font-family:'Lato',system-ui,sans-serif; color:${TEXT}; background:${CREAM}; }
        .dcr-root * { box-sizing:border-box; margin:0; padding:0; }
        .dcr-serif { font-family:'Playfair Display',Georgia,serif; }

        .dcr-tabs-wrap::-webkit-scrollbar { display:none; }

        .dcr-card-img {
          width:100%; height:200px; object-fit:cover; display:block;
          transition:transform .6s cubic-bezier(.16,1,.3,1);
        }
        .dcr-card-img-zoomed { transform:scale(1.06); }

        .dcr-tab {
          padding:18px 22px;
          font-size:.82rem; font-weight:700;
          letter-spacing:.08em; text-transform:uppercase;
          color:${MUTED};
          cursor:pointer; border:none; background:transparent;
          border-bottom:2.5px solid transparent;
          white-space:nowrap;
          transition:color .2s, border-color .2s;
          font-family:'Lato',sans-serif;
        }
        .dcr-tab:hover { color:${TEXT}; }
        .dcr-tab-active { color:${TEXT} !important; border-bottom-color:${GOLD} !important; }

        .dcr-gold-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,#d4b47a,${GOLD},#b8935a);
          background-size:200% auto;
          color:#fff; border:none; cursor:pointer;
          font-family:'Lato',system-ui,sans-serif; font-weight:700;
          transition:background-position .5s ease,transform .2s ease,box-shadow .2s ease;
        }
        .dcr-gold-btn:hover {
          background-position:right center;
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(200,169,110,.38);
        }

        .dcr-nav-link {
          color:rgba(255,255,255,.6); font-size:.88rem; font-weight:500;
          text-decoration:none; cursor:pointer;
          transition:color .2s;
          background:none; border:none; font-family:'Lato',sans-serif;
        }
        .dcr-nav-link:hover { color:${GOLD}; }

        .dcr-pkg-btn {
          width:100%; padding:11px;
          border-radius:8px;
          border:1.5px solid rgba(200,169,110,.4);
          background:transparent;
          color:${GOLD};
          font-family:'Lato',sans-serif;
          font-size:.83rem; font-weight:700;
          letter-spacing:.05em; text-transform:uppercase;
          cursor:pointer;
          transition:background .2s,border-color .2s,color .2s;
        }
        .dcr-pkg-btn:hover {
          background:${GOLD};
          border-color:${GOLD};
          color:#fff;
        }

        .dcr-style-card {
          border-radius:14px; overflow:hidden; position:relative; cursor:pointer;
          transition:transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
        }
        .dcr-style-card:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(0,0,0,.18); }

        @media(max-width:768px){
          .dcr-pkg-grid  { grid-template-columns:1fr !important; }
          .dcr-menu-grid { grid-template-columns:1fr !important; }
          .dcr-style-grid { grid-template-columns:1fr 1fr !important; }
          .dcr-nav-links  { display:none !important; }
        }
      `}</style>

      <div className="dcr-root">

        {/* ── STYLE INSPIRATION ─────────────────────────────────────── */}
        <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{ color: GOLD, fontSize: '.7rem', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '10px' }}>
              Find Your Aesthetic
            </p>
            <h2 className="dcr-serif" style={{ color: TEXT, fontSize: 'clamp(1.5rem,3vw,2.1rem)', fontWeight: 400 }}>
              Signature Style Themes
            </h2>
            <div style={{ width: '48px', height: '2px', background: `linear-gradient(90deg,${GOLD},rgba(200,169,110,.15))`, margin: '14px auto 0' }} />
          </div>

          <div
            className="dcr-style-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: '16px',
            }}
          >
            {STYLES.map((s) => (
              <div key={s.label} className="dcr-style-card">
                <img
                  src={s.img} alt={s.label}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                />
                {/* Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(26,26,24,.82) 0%, transparent 55%)',
                }} />
                {/* Palette swatches */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  display: 'flex', gap: '4px',
                }}>
                  {s.palette.map((c, i) => (
                    <div key={i} style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: c, border: '1.5px solid rgba(255,255,255,.4)',
                    }} />
                  ))}
                </div>
                <p style={{
                  position: 'absolute', bottom: '16px', left: '16px',
                  color: '#fff', fontWeight: 700, fontSize: '.88rem',
                  fontFamily: 'Lato,sans-serif', letterSpacing: '.03em',
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TABS ─────────────────────────────────────────────────── */}
        <div
          className="dcr-tabs-wrap"
          style={{
            background: '#fff', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
            padding: '0 40px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
          }}
        >
          {TABS.map(t => (
            <button
              key={t.key}
              className={`dcr-tab${activeTab === t.key ? ' dcr-tab-active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── DECOR ITEMS ──────────────────────────────────────────── */}
        <div style={{ background: CREAM }}>
          <div style={{ textAlign: 'center', padding: '52px 40px 0' }}>
            <p style={{ color: GOLD, fontSize: '.7rem', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '10px' }}>
              {section.eyebrow}
            </p>
            <h2 className="dcr-serif" style={{ color: TEXT, fontSize: 'clamp(1.5rem,3vw,2.1rem)', fontWeight: 400, marginBottom: '10px' }}>
              {section.heading}
            </h2>
            <p style={{ color: MUTED, fontSize: '.9rem', maxWidth: '500px', margin: '10px auto 0', lineHeight: 1.8 }}>
              {section.desc}
            </p>
            <div style={{ width: '48px', height: '2px', background: `linear-gradient(90deg,${GOLD},rgba(200,169,110,.15))`, margin: '18px auto 0' }} />
          </div>

          <div
            className="dcr-menu-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))',
              gap: '20px', padding: '36px 40px 60px',
              maxWidth: '1200px', margin: '0 auto',
            }}
          >
            {section.items.map((item, i) => (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredCard(`${activeTab}-${i}`)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: '#fff', borderRadius: '16px',
                  border: `1px solid ${BORDER}`, overflow: 'hidden',
                  cursor: 'default', position: 'relative',
                  transform: hoveredCard === `${activeTab}-${i}` ? 'translateY(-5px)' : 'none',
                  boxShadow: hoveredCard === `${activeTab}-${i}` ? '0 20px 48px rgba(0,0,0,.09)' : 'none',
                  transition: 'transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease',
                }}
              >
                {/* Badge */}
                {item.badge && (
                  <span style={{
                    position: 'absolute', top: '12px', right: '12px', zIndex: 2,
                    fontSize: '.68rem', fontWeight: 700, letterSpacing: '.06em',
                    textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px',
                    ...getBadgeStyle(item.badgeType),
                  }}>
                    {item.badge}
                  </span>
                )}

                {/* Image */}
                <div style={{ overflow: 'hidden' }}>
                  <img
                    className={`dcr-card-img${hoveredCard === `${activeTab}-${i}` ? ' dcr-card-img-zoomed' : ''}`}
                    src={item.img} alt={item.alt} loading="lazy"
                  />
                </div>

                {/* Body */}
                <div style={{ padding: '20px 20px 18px' }}>
                  <h3 className="dcr-serif" style={{ color: TEXT, fontSize: '1.1rem', fontWeight: 500, marginBottom: '6px' }}>
                    {item.name}
                  </h3>
                  <p style={{ color: MUTED, fontSize: '.82rem', lineHeight: 1.7, marginBottom: '14px' }}>
                    {item.desc}
                  </p>
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '14px' }}>
                    <span style={{
                      fontSize: '.7rem', fontWeight: 700, letterSpacing: '.05em',
                      textTransform: 'uppercase', color: MUTED,
                      background: CREAM_DARK, padding: '4px 10px', borderRadius: '20px',
                    }}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PACKAGES ─────────────────────────────────────────────── */}
        <section style={{ background: DARK, padding: '72px 40px', textAlign: 'center' }}>
          <p style={{ color: GOLD, fontSize: '.7rem', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '14px' }}>
            All-Inclusive
          </p>
          <h2 className="dcr-serif" style={{ color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.3rem)', fontWeight: 400, marginBottom: '10px' }}>
            Décor Packages
          </h2>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem', maxWidth: '420px', margin: '0 auto 44px', lineHeight: 1.8 }}>
            Comprehensive décor packages so you can focus on celebrating — we handle every pin, petal, and light.
          </p>

          <div
            className="dcr-pkg-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: '16px', maxWidth: '1000px', margin: '0 auto',
            }}
          >
            {PACKAGES.map(pkg => (
              <div
                key={pkg.name}
                onMouseEnter={() => setHoveredPkg(pkg.name)}
                onMouseLeave={() => setHoveredPkg(null)}
                style={{
                  background: pkg.featured || hoveredPkg === pkg.name
                    ? 'rgba(200,169,110,.07)' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${pkg.featured || hoveredPkg === pkg.name ? GOLD : 'rgba(200,169,110,.18)'}`,
                  borderRadius: '16px', padding: '32px 24px',
                  textAlign: 'left', position: 'relative',
                  transition: 'border-color .25s, background .25s',
                }}
              >
                {pkg.featured && (
                  <div style={{
                    position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)',
                    background: GOLD, color: '#fff', fontSize: '.68rem', fontWeight: 700,
                    letterSpacing: '.06em', textTransform: 'uppercase',
                    padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap',
                  }}>
                    Most Popular
                  </div>
                )}

                <p className="dcr-serif" style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 500, marginBottom: '4px' }}>
                  {pkg.name}
                </p>
                <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.78rem', marginBottom: '20px' }}>
                  {pkg.sub}
                </p>
                <p className="dcr-serif" style={{ color: GOLD, fontSize: '1.9rem', marginBottom: '4px' }}>
                  {pkg.price}
                </p>
                <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem', marginBottom: '20px' }}>
                  {pkg.per}
                </p>

                <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                  {pkg.items.map(itm => (
                    <li key={itm} style={{
                      color: 'rgba(255,255,255,.6)', fontSize: '.82rem',
                      padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.05)',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <span style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        background: GOLD, flexShrink: 0, display: 'inline-block',
                      }} />
                      {itm}
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>
        </section>


      </div>
    </>
  )
}
