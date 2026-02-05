import { useState, useEffect, useRef } from "react";

const ACCENT = "#FC2D01";
const DARK = "#151416";
const FRAME = 18;

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, style: extra = {} }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div ref={ref} style={{
      ...extra,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function HeroLine({ children, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span style={{ display: "block", overflow: "hidden" }}>
      <span style={{
        display: "block",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(100%)",
        transition: "opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {children}
      </span>
    </span>
  );
}

function Dot({ color = ACCENT }) {
  return <span style={{ color }}>.</span>;
}

/* ─── Category Filter Pill ─── */
function CategoryPill({ icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "10px 18px",
        background: active ? DARK : (hov ? "#f5f5f5" : "transparent"),
        color: active ? "#fff" : DARK,
        border: "1px solid",
        borderColor: active ? DARK : "#e5e5e5",
        fontSize: "13px", fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.25s ease",
        fontFamily: "inherit",
      }}
    >
      <span style={{ 
        fontSize: "10px", 
        color: active ? ACCENT : (hov ? ACCENT : "#a3a3a3"),
        transition: "color 0.25s ease",
      }}>{icon}</span>
      {label}
    </button>
  );
}

/* ─── Blog Article Card ─── */
function ArticleCard({ date, category, categoryIcon, title, desc, readTime, featured = false, delay = 0 }) {
  const [hov, setHov] = useState(false);
  
  if (featured) {
    return (
      <Reveal delay={delay}>
        <a
          href="#"
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            padding: "48px 0",
            borderTop: `2px solid ${ACCENT}`,
            transition: "padding-left 0.4s cubic-bezier(0.16,1,0.3,1)",
            paddingLeft: hov ? "16px" : "0",
          }}
        >
          <div style={{ 
            display: "flex", gap: "12px", alignItems: "center",
            marginBottom: "16px",
          }}>
            <span style={{
              fontSize: "10px", color: ACCENT, letterSpacing: "0.05em",
            }}>{categoryIcon}</span>
            <span style={{
              fontSize: "11px", fontWeight: 500, color: ACCENT,
              letterSpacing: "0.02em", textTransform: "uppercase",
            }}>Featured</span>
            <span style={{ fontSize: "11px", color: "#a3a3a3" }}>·</span>
            <span style={{
              fontSize: "11px", color: "#a3a3a3",
              fontVariantNumeric: "tabular-nums",
            }}>{date}</span>
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900,
            letterSpacing: "-0.02em", lineHeight: 1.1,
            marginBottom: "16px", maxWidth: "720px",
            color: hov ? ACCENT : DARK,
            transition: "color 0.3s ease",
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: "17px", fontWeight: 300, lineHeight: 1.6,
            color: "#525252", maxWidth: "600px", marginBottom: "20px",
          }}>
            {desc}
          </p>
          <span style={{
            fontSize: "12px", color: "#a3a3a3",
          }}>{readTime} Lesezeit</span>
        </a>
      </Reveal>
    );
  }

  return (
    <Reveal delay={delay}>
      <a
        href="#"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          padding: "32px 0",
          borderTop: "1px solid #e5e5e5",
          transition: "padding-left 0.4s cubic-bezier(0.16,1,0.3,1)",
          paddingLeft: hov ? "12px" : "0",
        }}
      >
        <div style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
          <div style={{
            flexShrink: 0, width: "90px",
            fontSize: "12px", color: "#a3a3a3",
            fontVariantNumeric: "tabular-nums",
          }}>
            {date}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: "flex", gap: "8px", alignItems: "center",
              marginBottom: "8px",
            }}>
              <span style={{ fontSize: "10px", color: ACCENT }}>{categoryIcon}</span>
              <span style={{
                fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                letterSpacing: "0.01em",
              }}>{category}</span>
            </div>
            <h3 style={{
              fontSize: "20px", fontWeight: 900, letterSpacing: "-0.01em",
              marginBottom: "6px", maxWidth: "560px",
              color: hov ? ACCENT : DARK,
              transition: "color 0.3s ease",
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: "15px", fontWeight: 300, lineHeight: 1.5,
              color: "#525252", maxWidth: "520px",
            }}>
              {desc}
            </p>
          </div>
          <div style={{
            flexShrink: 0,
            fontSize: "12px", color: "#a3a3a3",
          }}>
            {readTime}
          </div>
        </div>
      </a>
    </Reveal>
  );
}

export default function BlogPage() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("de-DE", {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
      }));
    };
    update();
    const i = setInterval(update, 30000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = [
    { id: "all", icon: "✦", label: "Alle" },
    { id: "vision", icon: "◎", label: "Visionen" },
    { id: "takes", icon: "◆", label: "Takes" },
    { id: "experiments", icon: "▲", label: "Experimente" },
    { id: "building", icon: "◻", label: "Building" },
    { id: "personal", icon: "●", label: "Persönlich" },
  ];

  const articles = [
    {
      date: "Jun 2025",
      category: "Experimente",
      categoryIcon: "▲",
      title: "Vibe Coding: Zwischen Hype und Realität",
      desc: "Warum der Ansatz besser ist als sein Ruf — aber auch gefährlicher. Ein Selbstversuch mit ehrlichem Fazit.",
      readTime: "8 min",
      featured: true,
      categoryId: "experiments",
    },
    {
      date: "Mai 2025",
      category: "Experimente",
      categoryIcon: "▲",
      title: "Von No-Code zu Code-First: Agent Frameworks im Vergleich",
      desc: "Make, n8n, PydanticAI — ein ehrlicher Vergleich aus der Praxis.",
      readTime: "12 min",
      categoryId: "experiments",
    },
    {
      date: "Mai 2025",
      category: "Takes",
      categoryIcon: "◆",
      title: "KI-Governance, die wirklich funktioniert",
      desc: "Duale Strategie: Compliance für die Rechtsabteilung, Handbook für den Alltag.",
      readTime: "6 min",
      categoryId: "takes",
    },
    {
      date: "Apr 2025",
      category: "Visionen",
      categoryIcon: "◎",
      title: "Follow schlägt Search",
      desc: "Warum persönliche Marken in der AI-Ära wichtiger werden als SEO.",
      readTime: "5 min",
      categoryId: "vision",
    },
    {
      date: "Apr 2025",
      category: "Building",
      categoryIcon: "◻",
      title: "Wie ich meine drei Websites aufbaue",
      desc: "loschke.ai, unlearn.how, lernen.diy — Tech-Stack, Entscheidungen, Learnings.",
      readTime: "10 min",
      categoryId: "building",
    },
    {
      date: "Mär 2025",
      category: "Takes",
      categoryIcon: "◆",
      title: "Warum ich keine Prompt-Sammlungen verkaufe",
      desc: "Prinzipien vor Tricks. Und warum das kein Marketing-Slogan ist.",
      readTime: "4 min",
      categoryId: "takes",
    },
    {
      date: "Mär 2025",
      category: "Persönlich",
      categoryIcon: "●",
      title: "Von der Agentur in die Selbständigkeit",
      desc: "Was ich nach 15 Jahren Festanstellung über den Sprung gelernt habe.",
      readTime: "7 min",
      categoryId: "personal",
    },
    {
      date: "Feb 2025",
      category: "Visionen",
      categoryIcon: "◎",
      title: "State of AI 2025: Was wirklich zählt",
      desc: "Meine Einschätzung jenseits der Hype-Zyklen.",
      readTime: "15 min",
      categoryId: "vision",
    },
  ];

  const filteredArticles = activeCategory === "all" 
    ? articles 
    : articles.filter(a => a.categoryId === activeCategory);

  const featuredArticle = filteredArticles.find(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  const navLinks = [
    { label: "Blog", href: "/blog", active: true },
    { label: "Manifest", href: "/manifest" },
    { label: "Speaking", href: "/speaking" },
    { label: "Über mich", href: "/about" },
  ];

  return (
    <div style={{ fontFamily: '"Noto Sans", system-ui, sans-serif', color: DARK, background: "#fff" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;900&display=swap" rel="stylesheet" />

      {/* ─── FIXED FRAME ─── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
        borderWidth: `${FRAME}px`, borderStyle: "solid", borderColor: ACCENT,
        boxSizing: "border-box",
      }} />

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div style={{ padding: `${FRAME}px` }}>
        <div style={{ background: "#fff", minHeight: `calc(100vh - ${FRAME * 2}px)` }}>

          {/* ─── NAV ─── */}
          <nav style={{
            position: "fixed", top: FRAME, left: FRAME, right: FRAME,
            zIndex: 100, padding: "0 36px", height: "72px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? "1px solid #e5e5e5" : "1px solid transparent",
            transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
          }}>
            <a href="/" style={{
              fontSize: "15px", fontWeight: 900, color: DARK,
              textDecoration: "none", letterSpacing: "-0.02em",
            }}>
              loschke<span style={{ color: ACCENT }}>.ai</span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} style={{
                  fontSize: "13px", fontWeight: link.active ? 500 : 400,
                  color: link.active ? ACCENT : DARK,
                  textDecoration: "none",
                  transition: "color 0.25s ease",
                }}>{link.label}</a>
              ))}
              <span style={{
                fontSize: "11px", color: "#a3a3a3", fontVariantNumeric: "tabular-nums",
              }}>
                Dresden {time}
              </span>
            </div>
          </nav>

          {/* ═══════════════════════════════════════════════
              HERO
              ═══════════════════════════════════════════════ */}
          <header style={{
            minHeight: "50vh",
            display: "flex", alignItems: "flex-end",
            padding: "0 36px 60px",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "end", width: "100%",
            }}>
              <div style={{
                fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                letterSpacing: "0.1em", textTransform: "uppercase",
                paddingBottom: "12px",
              }}>
                Blog
              </div>
              <div>
                <h1 style={{
                  fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 900,
                  lineHeight: 0.92, letterSpacing: "-0.035em", marginBottom: "24px",
                }}>
                  <HeroLine delay={0.1}>Gedanken</HeroLine>
                  <HeroLine delay={0.2}>& Experimente<Dot /></HeroLine>
                </h1>
                <Reveal delay={0.5}>
                  <p style={{
                    fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 300,
                    lineHeight: 1.6, color: "#525252", maxWidth: "480px",
                  }}>
                    Über KI, Arbeit und was sich verändert. 
                    Keine Tutorials — Perspektiven.
                  </p>
                </Reveal>
              </div>
            </div>
          </header>

          {/* ═══════════════════════════════════════════════
              CATEGORY FILTER
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "0 36px 40px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "center", paddingTop: "32px",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>Filter</p>
              </Reveal>
              <Reveal delay={0.1}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {categories.map((cat) => (
                    <CategoryPill
                      key={cat.id}
                      icon={cat.icon}
                      label={cat.label}
                      active={activeCategory === cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                    />
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              FEATURED ARTICLE
              ═══════════════════════════════════════════════ */}
          {featuredArticle && (
            <section style={{ padding: "0 36px" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
                gap: "60px", alignItems: "start",
              }}>
                <div />
                <ArticleCard {...featuredArticle} delay={0} />
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════
              ARTICLE LIST
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "20px 36px 100px" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>
                  {filteredArticles.length} Artikel
                </p>
              </Reveal>
              <div>
                {regularArticles.map((article, i) => (
                  <ArticleCard
                    key={article.title}
                    {...article}
                    delay={i * 0.05}
                  />
                ))}
                <div style={{ borderTop: "1px solid #e5e5e5" }} />
                
                {/* Empty state */}
                {regularArticles.length === 0 && !featuredArticle && (
                  <Reveal>
                    <div style={{ padding: "60px 0", textAlign: "center" }}>
                      <p style={{ fontSize: "15px", color: "#a3a3a3" }}>
                        Keine Artikel in dieser Kategorie.
                      </p>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              NEWSLETTER CTA
              ═══════════════════════════════════════════════ */}
          <section style={{
            padding: "100px 36px", borderTop: "1px solid #e5e5e5",
            background: "#fafafa",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>Newsletter</p>
              </Reveal>
              <div style={{ maxWidth: "560px" }}>
                <Reveal>
                  <h2 style={{
                    fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900,
                    lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "20px",
                  }}>
                    Nichts verpassen<Dot />
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p style={{
                    fontSize: "16px", fontWeight: 300, lineHeight: 1.6,
                    color: "#525252", marginBottom: "28px",
                  }}>
                    Neue Artikel direkt ins Postfach. Kein Spam, keine Werbung. 
                    Etwa 2× im Monat.
                  </p>
                </Reveal>
                <Reveal delay={0.15}>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <input
                      type="email"
                      placeholder="E-Mail-Adresse"
                      style={{
                        flex: "1 1 240px",
                        padding: "14px 18px",
                        fontSize: "14px",
                        border: "1px solid #e5e5e5",
                        background: "#fff",
                        fontFamily: "inherit",
                        outline: "none",
                      }}
                    />
                    <button style={{
                      padding: "14px 28px",
                      background: DARK,
                      color: "#fff",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.3s ease",
                    }}
                      onMouseEnter={(e) => (e.target.style.background = ACCENT)}
                      onMouseLeave={(e) => (e.target.style.background = DARK)}
                    >
                      Abonnieren
                    </button>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ─── FOOTER ─── */}
          <footer style={{
            borderTop: "1px solid #e5e5e5", padding: "32px 36px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: "12px",
          }}>
            <span style={{ fontSize: "12px", color: "#a3a3a3" }}>© 2026 Rico Loschke</span>
            <div style={{ display: "flex", gap: "24px" }}>
              {["LinkedIn", "Impressum", "Datenschutz"].map((l) => (
                <a key={l} href="#" style={{
                  fontSize: "12px", color: "#a3a3a3", textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                  onMouseEnter={(e) => (e.target.style.color = ACCENT)}
                  onMouseLeave={(e) => (e.target.style.color = "#a3a3a3")}
                >{l}</a>
              ))}
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
