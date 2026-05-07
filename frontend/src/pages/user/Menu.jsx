import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GOLD = "#C8A96E";
const DARK = "#1A1A18";
const CREAM = "#F5F4EF";
const CREAM_DARK = "#EDEAE0";
const BORDER = "#E8E5DC";
const TEXT = "#1C1C1A";
const MUTED = "#6B7280";

const TABS = [
  { key: "starters", label: "Starters & Salads" },
  { key: "mains", label: "Main Course" },
  { key: "rice", label: "Rice & Breads" },
  { key: "desserts", label: "Desserts & Drinks" },
];

const MENU = {
  starters: {
    eyebrow: "To Begin",
    heading: "Starters & Salads",
    items: [
      {
        img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=75",
        alt: "Seekh Kebab",
        badge: "Spicy",
        badgeType: "spicy",
        name: "Seekh Kebab",
        desc: "Minced beef and aromatic spices hand-rolled on skewers and char-grilled to smoky perfection. Served with mint chutney.",
        price: "Rs 850",
        unit: "/ dozen",
        tag: "Beef",
      },
      {
        img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=75",
        alt: "Chicken Tikka",
        badge: "Signature",
        badgeType: "gold",
        name: "Chicken Tikka",
        desc: "Tender chicken marinated overnight in yoghurt and spices, then slow-cooked in a traditional clay tandoor.",
        price: "Rs 1,100",
        unit: "/ platter",
        tag: "Chicken",
      },
      {
        img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=75",
        alt: "Dahi Bhalle",
        badge: "Veg",
        badgeType: "veg",
        name: "Dahi Bhalle",
        desc: "Soft lentil dumplings soaked in chilled sweetened yoghurt, drizzled with tamarind chutney and roasted cumin.",
        price: "Rs 600",
        unit: "/ serving",
        tag: "Vegetarian",
      },
      {
        img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=75",
        alt: "Chaat Station",
        badge: null,
        name: "Chaat Station",
        desc: "Live chaat counter featuring papri chaat, dahi puri, and aloo tikki — an interactive crowd favourite at every shaadi.",
        price: "Rs 950",
        unit: "/ person",
        tag: "Live Station",
      },
    ],
  },
  mains: {
    eyebrow: "The Heart of the Dastarkhwan",
    heading: "Main Course",
    items: [
      {
        img: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=75",
        alt: "Nihari",
        badge: "Bestseller",
        badgeType: "gold",
        name: "Nihari",
        desc: "Slow-simmered beef shank in a rich, aromatic broth with saffron, dried ginger, and a blend of 18 whole spices. A Lahori staple.",
        price: "Rs 1,400",
        unit: "/ deg",
        tag: "Beef",
      },
      {
        img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=75",
        alt: "Chicken Karahi",
        badge: "Chef's Pick",
        badgeType: "gold",
        name: "Chicken Karahi",
        desc: "Farm-fresh chicken sautéed in an iron wok with ripe tomatoes, fresh ginger, green chillies, and hand-ground spices.",
        price: "Rs 2,200",
        unit: "/ karahi",
        tag: "Chicken",
      },
      {
        img: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=600&q=75",
        alt: "Mutton Raan",
        badge: "Spicy",
        badgeType: "spicy",
        name: "Mutton Raan",
        desc: "Whole leg of mutton marinated for 24 hours and slow-roasted to fall-off-the-bone tenderness. The crown jewel of any wedding spread.",
        price: "Rs 8,500",
        unit: "/ raan",
        tag: "Mutton",
      },
      {
        img: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=75",
        alt: "Palak Paneer",
        badge: null,
        name: "Palak Paneer",
        desc: "Creamy spinach gravy slow-cooked with cottage cheese cubes, fenugreek, and a hint of cream. A beloved vegetarian centrepiece.",
        price: "Rs 1,100",
        unit: "/ serving",
        tag: "Vegetarian",
        tagVeg: true,
      },
      {
        img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=75",
        alt: "Dal Makhani",
        badge: "Traditional",
        badgeType: "gold",
        name: "Dal Makhani",
        desc: "Black lentils slow-cooked overnight with butter, cream, and a medley of aromatic spices. Silky, rich, and utterly comforting.",
        price: "Rs 800",
        unit: "/ serving",
        tag: "Vegetarian",
        tagVeg: true,
      },
      {
        img: "https://images.unsplash.com/photo-1584278860047-22db9ff82bed?w=600&q=75",
        alt: "Beef Kofta Curry",
        badge: "Favourite",
        badgeType: "gold",
        name: "Beef Kofta Curry",
        desc: "Hand-rolled spiced meatballs simmered in a luscious onion-tomato gravy. A timeless classic at every valima and reception.",
        price: "Rs 1,200",
        unit: "/ serving",
        tag: "Beef",
      },
    ],
  },
  rice: {
    eyebrow: "Staples of the Spread",
    heading: "Rice & Breads",
    items: [
      {
        img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=75",
        alt: "Mutton Biryani",
        badge: "Showstopper",
        badgeType: "gold",
        name: "Mutton Biryani",
        desc: "Dum-cooked layers of aged basmati rice, slow-cooked mutton, caramelised onions, saffron milk, and whole spices. The crown of any Pakistani spread.",
        price: "Rs 3,500",
        unit: "/ deg",
        tag: "Mutton",
      },
      {
        img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=75",
        alt: "Chicken Pulao",
        badge: null,
        name: "Chicken Yakhni Pulao",
        desc: "Fragrant long-grain rice cooked in a rich bone broth with whole spices and tender chicken pieces. Subtle, aromatic, and deeply satisfying.",
        price: "Rs 2,800",
        unit: "/ deg",
        tag: "Chicken",
      },
      {
        img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=75",
        alt: "Naan Basket",
        badge: "Veg",
        badgeType: "veg",
        name: "Tandoori Naan Basket",
        desc: "Freshly baked soft naan from a live clay tandoor. Includes butter naan, garlic naan, and roghni naan brushed with sesame and butter.",
        price: "Rs 80",
        unit: "/ piece",
        tag: "Bread",
      },
      {
        img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=75",
        alt: "Zeera Chawal",
        badge: "Classic",
        badgeType: "gold",
        name: "Zeera Chawal",
        desc: "Steamed basmati tempered with cumin seeds, green cardamom, and a touch of ghee. The perfect companion to any rich curry.",
        price: "Rs 900",
        unit: "/ deg",
        tag: "Vegetarian",
        tagVeg: true,
      },
    ],
  },
  desserts: {
    eyebrow: "A Sweet Farewell",
    heading: "Desserts & Drinks",
    items: [
      {
        img: "https://images.unsplash.com/photo-1549082984-1323b94df9a6?w=600&q=75",
        alt: "Gulab Jamun",
        badge: "Must Have",
        badgeType: "gold",
        name: "Gulab Jamun",
        desc: "Soft khoya dumplings fried golden and soaked in rose-cardamom sugar syrup. Served warm — the undisputed king of desi mithai.",
        price: "Rs 500",
        unit: "/ dozen",
        tag: "Mithai",
      },
      {
        img: "https://images.unsplash.com/photo-1605197161470-5de4fb6f294c?w=600&q=75",
        alt: "Shahi Kheer",
        badge: "Signature",
        badgeType: "gold",
        name: "Shahi Kheer",
        desc: "Slow-simmered rice pudding made with full-fat milk, sugar, saffron strands, and topped with crushed pistachios and silver leaf.",
        price: "Rs 650",
        unit: "/ serving",
        tag: "Dessert",
      },
      {
        img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=75",
        alt: "Firni",
        badge: "Crowd Favourite",
        badgeType: "gold",
        name: "Firni",
        desc: "Chilled ground rice pudding set in traditional clay pots, perfumed with kewra water and rose, garnished with crushed nuts.",
        price: "Rs 580",
        unit: "/ pot",
        tag: "Dessert",
      },
      {
        img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=75",
        alt: "Kashmiri Chai",
        badge: null,
        name: "Kashmiri Pink Chai",
        desc: "Dreamy rose-pink salted tea brewed with green tea, milk, and baking soda, topped with a swirl of cream and crushed pistachios.",
        price: "Rs 280",
        unit: "/ cup",
        tag: "Beverage",
      },
      {
        img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=75",
        alt: "Rooh Afza Sharbat",
        badge: "Refreshing",
        badgeType: "gold",
        name: "Rooh Afza Sharbat",
        desc: "A classic Pakistani wedding staple — chilled Rooh Afza blended with milk, basil seeds, and a squeeze of lemon. Served in tall glasses.",
        price: "Rs 220",
        unit: "/ glass",
        tag: "Beverage",
      },
    ],
  },
};

const PACKAGES = [
  {
    name: "Silver",
    sub: "Intimate Gatherings",
    price: "Rs 2,500",
    per: "per head · min 200 guests",
    featured: false,
    items: [
      "2 Starters",
      "3 Main Courses",
      "Biryani or Pulao",
      "Naan Basket",
      "1 Dessert",
      "Chai & Sharbat",
    ],
  },
  {
    name: "Gold",
    sub: "Classic Wedding Spread",
    price: "Rs 3,800",
    per: "per head · min 300 guests",
    featured: true,
    items: [
      "Live Chaat Station",
      "4 Starters incl. Tikka",
      "5 Main Courses",
      "Mutton Biryani",
      "Naan & Zeera Chawal",
      "2 Desserts + Firni",
      "Kashmiri Chai & Sharbat",
    ],
  },
  {
    name: "Platinum",
    sub: "Grand Baraat Banquet",
    price: "Rs 5,500",
    per: "per head · min 400 guests",
    featured: false,
    items: [
      "2 Live Stations",
      "6 Premium Starters",
      "Mutton Raan",
      "7 Main Courses",
      "Biryani + Pulao + Naan",
      "Full Mithai Counter",
      "Unlimited Beverages",
    ],
  },
];

function getBadgeStyle(type) {
  if (type === "veg") return { background: "#2d7a3a", color: "#fff" };
  if (type === "spicy") return { background: "#b33a1a", color: "#fff" };
  return { background: GOLD, color: "#fff" };
}

export default function MenuSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("starters");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredPkg, setHoveredPkg] = useState(null);

  const section = MENU[activeTab];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;700&display=swap');

        .mnu-root { font-family:'Lato',system-ui,sans-serif; color:${TEXT}; }
        .mnu-root * { box-sizing:border-box; margin:0; padding:0; }
        .mnu-serif { font-family:'Playfair Display',Georgia,serif; }

        .mnu-tabs-wrap::-webkit-scrollbar { display:none; }

        .mnu-card-img {
          width:100%; height:190px; object-fit:cover; display:block;
          transition:transform .6s cubic-bezier(.16,1,.3,1);
        }
        .mnu-card-img-zoomed { transform:scale(1.05); }

        .mnu-gold-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,#d4b47a,${GOLD},#b8935a);
          background-size:200% auto;
          color:#fff; border:none; cursor:pointer;
          font-family:'Lato',system-ui,sans-serif; font-weight:700;
          transition:background-position .5s ease,transform .2s ease,box-shadow .2s ease;
        }
        .mnu-gold-btn:hover {
          background-position:right center;
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(200,169,110,.38);
        }

        .mnu-pkg-btn {
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
        .mnu-pkg-btn:hover, .mnu-pkg-btn-featured {
          background:${GOLD} !important;
          border-color:${GOLD} !important;
          color:#fff !important;
        }

        .mnu-tab {
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
        .mnu-tab:hover { color:${TEXT}; }
        .mnu-tab-active { color:${TEXT} !important; border-bottom-color:${GOLD} !important; }

        @media(max-width:768px){
          .mnu-pkg-grid { grid-template-columns:1fr !important; }
          .mnu-menu-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="mnu-root">
        {/* ── TABS ─────────────────────────────────────────────── */}
        <div
          className="mnu-tabs-wrap"
          style={{
            background: CREAM,
            borderBottom: `1px solid ${BORDER}`,
            padding: "0 40px",
            display: "flex",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`mnu-tab${activeTab === t.key ? " mnu-tab-active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── MENU SECTION ─────────────────────────────────────── */}
        <div style={{ background: CREAM }}>
          {/* Section heading */}
          <div style={{ textAlign: "center", padding: "52px 40px 0" }}>
            <p
              style={{
                color: GOLD,
                fontSize: ".7rem",
                letterSpacing: "5px",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              {section.eyebrow}
            </p>
            <h2
              className="mnu-serif"
              style={{
                color: TEXT,
                fontSize: "clamp(1.5rem,3vw,2.1rem)",
                fontWeight: 400,
                marginBottom: "10px",
              }}
            >
              {section.heading}
            </h2>
            <div
              style={{
                width: "48px",
                height: "2px",
                background: `linear-gradient(90deg,${GOLD},rgba(200,169,110,.15))`,
                margin: "14px auto 0",
              }}
            />
          </div>

          {/* Cards grid */}
          <div
            className="mnu-menu-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
              gap: "20px",
              padding: "36px 40px 56px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {section.items.map((item, i) => (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredCard(`${activeTab}-${i}`)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: `1px solid ${BORDER}`,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  transform:
                    hoveredCard === `${activeTab}-${i}`
                      ? "translateY(-5px)"
                      : "none",
                  boxShadow:
                    hoveredCard === `${activeTab}-${i}`
                      ? "0 20px 48px rgba(0,0,0,.09)"
                      : "none",
                  transition:
                    "transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease",
                }}
              >
                {/* Badge */}
                {item.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      zIndex: 2,
                      fontSize: ".68rem",
                      fontWeight: 700,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      ...getBadgeStyle(item.badgeType),
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Image */}
                <div style={{ overflow: "hidden" }}>
                  <img
                    className={`mnu-card-img${hoveredCard === `${activeTab}-${i}` ? " mnu-card-img-zoomed" : ""}`}
                    src={item.img}
                    alt={item.alt}
                    loading="lazy"
                  />
                </div>

                {/* Body */}
                <div style={{ padding: "20px 20px 18px" }}>
                  <h3
                    className="mnu-serif"
                    style={{
                      color: TEXT,
                      fontSize: "1.12rem",
                      fontWeight: 500,
                      marginBottom: "6px",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      color: MUTED,
                      fontSize: ".82rem",
                      lineHeight: 1.7,
                      marginBottom: "14px",
                    }}
                  >
                    {item.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: `1px solid ${BORDER}`,
                      paddingTop: "14px",
                    }}
                  >
                    <span
                      className="mnu-serif"
                      style={{
                        color: GOLD,
                        fontSize: "1.15rem",
                        fontWeight: 500,
                      }}
                    >
                      {item.price}{" "}
                      <span
                        style={{
                          fontSize: ".75rem",
                          color: MUTED,
                          fontFamily: "Lato,sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {item.unit}
                      </span>
                    </span>
                    <span
                      style={{
                        fontSize: ".7rem",
                        fontWeight: 700,
                        letterSpacing: ".05em",
                        textTransform: "uppercase",
                        color: item.tagVeg ? "#2d7a3a" : MUTED,
                        background: CREAM_DARK,
                        padding: "4px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PACKAGES ─────────────────────────────────────────── */}
        <section
          style={{
            background: DARK,
            padding: "72px 40px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: GOLD,
              fontSize: ".7rem",
              letterSpacing: "5px",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            Curated for You
          </p>
          <h2
            className="mnu-serif"
            style={{
              color: "#fff",
              fontSize: "clamp(1.6rem,3vw,2.3rem)",
              fontWeight: 400,
              marginBottom: "10px",
            }}
          >
            Catering Packages
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,.5)",
              fontSize: ".9rem",
              maxWidth: "420px",
              margin: "0 auto 44px",
              lineHeight: 1.8,
            }}
          >
            All-inclusive packages designed for every scale of celebration —
            from intimate nikahs to grand baraats.
          </p>

          <div
            className="mnu-pkg-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "16px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                onMouseEnter={() => setHoveredPkg(pkg.name)}
                onMouseLeave={() => setHoveredPkg(null)}
                style={{
                  background:
                    pkg.featured || hoveredPkg === pkg.name
                      ? "rgba(200,169,110,.07)"
                      : "rgba(255,255,255,.04)",
                  border: `1px solid ${pkg.featured || hoveredPkg === pkg.name ? GOLD : "rgba(200,169,110,.18)"}`,
                  borderRadius: "16px",
                  padding: "32px 24px",
                  textAlign: "left",
                  position: "relative",
                  transition: "border-color .25s, background .25s",
                }}
              >
                {/* Most popular tag */}
                {pkg.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-11px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: GOLD,
                      color: "#fff",
                      fontSize: ".68rem",
                      fontWeight: 700,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      padding: "4px 14px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <p
                  className="mnu-serif"
                  style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  {pkg.name}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,.35)",
                    fontSize: ".78rem",
                    marginBottom: "20px",
                  }}
                >
                  {pkg.sub}
                </p>
                <p
                  className="mnu-serif"
                  style={{
                    color: GOLD,
                    fontSize: "1.9rem",
                    marginBottom: "4px",
                  }}
                >
                  {pkg.price}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,.3)",
                    fontSize: ".75rem",
                    marginBottom: "20px",
                  }}
                >
                  {pkg.per}
                </p>

                <ul style={{ listStyle: "none", marginBottom: "24px" }}>
                  {pkg.items.map((itm) => (
                    <li
                      key={itm}
                      style={{
                        color: "rgba(255,255,255,.6)",
                        fontSize: ".82rem",
                        padding: "5px 0",
                        borderBottom: "1px solid rgba(255,255,255,.05)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: GOLD,
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      />
                      {itm}
                    </li>
                  ))}
                </ul>

                <button
                  className={`mnu-pkg-btn${pkg.featured ? " mnu-pkg-btn-featured" : ""}`}
                  style={
                    pkg.featured
                      ? { background: GOLD, borderColor: GOLD, color: "#fff" }
                      : {}
                  }
                  onClick={() => navigate('/request-booking')}
                >
                  Inquire Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BAR ──────────────────────────────────────────── */}
        <section
          style={{
            background: CREAM,
            padding: "56px 40px",
            textAlign: "center",
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <h2
            className="mnu-serif"
            style={{
              color: TEXT,
              fontSize: "clamp(1.5rem,3vw,2rem)",
              fontWeight: 400,
              marginBottom: "10px",
            }}
          >
            Ready to plan your <em style={{ color: GOLD }}>dream menu?</em>
          </h2>
          <p
            style={{
              color: MUTED,
              fontSize: ".9rem",
              maxWidth: "400px",
              margin: "0 auto 28px",
              lineHeight: 1.8,
            }}
          >
            Our catering team will craft a bespoke menu tailored to your
            family's traditions and preferences.
          </p>
          <button
            className="mnu-gold-btn"
            style={{
              padding: "14px 32px",
              borderRadius: "9px",
              fontSize: ".9rem",
              letterSpacing: ".04em",
            }}
            onClick={() => navigate('/request-booking')}
          >
            Talk to Our Chef Team →
          </button>
        </section>
      </div>
    </>
  );
}
