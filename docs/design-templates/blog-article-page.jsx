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

/* ─── Audio Player ─── */
function AudioPlayer({ src = "/audio/article.mp3" }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  return (
    <div style={{
      padding: "20px 24px",
      background: "#fafafa",
      border: "1px solid #e5e5e5",
      marginBottom: "40px",
    }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          style={{
            width: "44px", height: "44px",
            borderRadius: "50%",
            background: DARK,
            border: "none",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.25s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = ACCENT)}
          onMouseLeave={(e) => (e.currentTarget.style.background = DARK)}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="1" width="3" height="12" fill="#fff" />
              <rect x="9" y="1" width="3" height="12" fill="#fff" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 1L13 7L3 13V1Z" fill="#fff" />
            </svg>
          )}
        </button>

        {/* Progress Section */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <span style={{
              fontSize: "12px", fontWeight: 500, color: DARK,
            }}>
              Audio-Zusammenfassung
            </span>
            <span style={{
              fontSize: "11px", color: "#a3a3a3",
              fontVariantNumeric: "tabular-nums",
            }}>
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div
            onClick={handleSeek}
            style={{
              height: "4px",
              background: "#e5e5e5",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div style={{
              position: "absolute",
              left: 0, top: 0, bottom: 0,
              width: `${progress}%`,
              background: ACCENT,
              transition: "width 0.1s linear",
            }} />
          </div>
        </div>

        {/* Speed Control */}
        <SpeedControl audioRef={audioRef} />
      </div>
    </div>
  );
}

/* ─── Speed Control ─── */
function SpeedControl({ audioRef }) {
  const [speed, setSpeed] = useState(1);
  const speeds = [0.75, 1, 1.25, 1.5, 2];
  
  const cycleSpeed = () => {
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <button
      onClick={cycleSpeed}
      style={{
        padding: "6px 10px",
        background: "transparent",
        border: "1px solid #e5e5e5",
        fontSize: "11px",
        fontWeight: 500,
        color: "#737373",
        cursor: "pointer",
        fontFamily: "inherit",
        fontVariantNumeric: "tabular-nums",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = DARK;
        e.currentTarget.style.color = DARK;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e5e5";
        e.currentTarget.style.color = "#737373";
      }}
    >
      {speed}×
    </button>
  );
}

/* ─── Tag Pill ─── */
function Tag({ label, href = "#" }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-block",
        padding: "6px 14px",
        fontSize: "12px",
        fontWeight: 500,
        color: hov ? "#fff" : DARK,
        background: hov ? DARK : "#f5f5f5",
        textDecoration: "none",
        transition: "all 0.25s ease",
      }}
    >
      {label}
    </a>
  );
}

/* ─── TOC Item ─── */
function TocItem({ label, href, level = 1, active = false }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        padding: "8px 0",
        paddingLeft: level === 2 ? "16px" : "0",
        fontSize: level === 2 ? "12px" : "13px",
        fontWeight: active ? 500 : 400,
        color: active ? ACCENT : (hov ? DARK : "#737373"),
        textDecoration: "none",
        borderLeft: level === 2 ? "1px solid #e5e5e5" : "none",
        transition: "color 0.2s ease",
      }}
    >
      {label}
    </a>
  );
}

/* ─── Prose Styles ─── */
const proseStyles = {
  h2: {
    fontSize: "clamp(24px, 3vw, 32px)",
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
    marginTop: "56px",
    marginBottom: "20px",
    color: DARK,
  },
  h3: {
    fontSize: "clamp(18px, 2vw, 22px)",
    fontWeight: 900,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
    marginTop: "40px",
    marginBottom: "16px",
    color: DARK,
  },
  p: {
    fontSize: "17px",
    fontWeight: 300,
    lineHeight: 1.75,
    color: "#404040",
    marginBottom: "24px",
  },
  lead: {
    fontSize: "20px",
    fontWeight: 300,
    lineHeight: 1.65,
    color: "#525252",
    marginBottom: "32px",
  },
  ul: {
    marginBottom: "24px",
    paddingLeft: "0",
    listStyle: "none",
  },
  li: {
    fontSize: "17px",
    fontWeight: 300,
    lineHeight: 1.75,
    color: "#404040",
    marginBottom: "12px",
    paddingLeft: "24px",
    position: "relative",
  },
  strong: {
    fontWeight: 500,
    color: DARK,
  },
  blockquote: {
    borderLeft: `3px solid ${ACCENT}`,
    paddingLeft: "24px",
    margin: "32px 0",
    fontStyle: "italic",
    color: "#525252",
  },
};

export default function BlogArticlePage() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const [activeSection, setActiveSection] = useState("");

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

  // Simple active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let current = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          current = section.getAttribute("data-section");
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const article = {
    date: "Mai 2025",
    category: "Takes",
    categoryIcon: "◆",
    title: "KI-Governance, die wirklich funktioniert",
    subtitle: "Warum Unternehmen einen dualen Ansatz brauchen",
    readTime: "6 min",
    tags: ["KI-Governance", "Compliance", "Change Management", "Innovation"],
  };

  const toc = [
    { id: "problem", label: "Das Problem", level: 1 },
    { id: "strategie", label: "Die Zwei-Säulen-Strategie", level: 1 },
    { id: "compliance", label: "Säule 1: Compliance-Richtlinie", level: 2 },
    { id: "handbuch", label: "Säule 2: Anwenderhandbuch", level: 2 },
    { id: "warum", label: "Warum die Trennung funktioniert", level: 1 },
    { id: "fazit", label: "Fazit", level: 1 },
  ];

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
              ARTICLE HEADER
              ═══════════════════════════════════════════════ */}
          <header style={{
            paddingTop: "140px",
            padding: "140px 36px 60px",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 200px) 1fr minmax(200px, 280px)",
              gap: "48px", alignItems: "start",
            }}>
              {/* Left: Meta */}
              <Reveal>
                <div style={{ position: "sticky", top: `${FRAME + 100}px` }}>
                  <p style={{
                    fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    marginBottom: "8px",
                  }}>
                    {article.date}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                    <span style={{ fontSize: "10px", color: ACCENT }}>{article.categoryIcon}</span>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#737373" }}>
                      {article.category}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#a3a3a3" }}>
                    {article.readTime} Lesezeit
                  </p>
                </div>
              </Reveal>

              {/* Center: Title */}
              <div>
                <h1 style={{
                  fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900,
                  lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "16px",
                }}>
                  <HeroLine delay={0.1}>{article.title}<Dot /></HeroLine>
                </h1>
                <Reveal delay={0.3}>
                  <p style={{
                    fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 300,
                    lineHeight: 1.4, color: "#525252",
                  }}>
                    {article.subtitle}
                  </p>
                </Reveal>
              </div>

              {/* Right: Empty for alignment */}
              <div />
            </div>
          </header>

          {/* ═══════════════════════════════════════════════
              ARTICLE BODY + TOC
              ═══════════════════════════════════════════════ */}
          <article style={{ padding: "40px 36px 100px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 200px) minmax(400px, 720px) minmax(200px, 280px)",
              gap: "48px", alignItems: "start",
            }}>
              {/* Left: Spacer */}
              <div />

              {/* Center: Article Content */}
              <div>
                <Reveal>
                  <p style={proseStyles.lead}>
                    Die Einführung von KI-Tools in Unternehmen ist längst kein Zukunftsszenario 
                    mehr, sondern gelebte Realität. Doch mit der rasanten Verbreitung stehen 
                    Entscheider vor einer kniffligen Aufgabe: Wie schafft man einen Rahmen, 
                    der einerseits klare Grenzen setzt, gleichzeitig aber Innovation nicht 
                    im Keim erstickt?
                  </p>
                </Reveal>

                <Reveal delay={0.1}>
                  <AudioPlayer src="/audio/ki-governance.mp3" />
                </Reveal>

                <Reveal>
                  <h2 id="problem" data-section="problem" style={proseStyles.h2}>
                    Das Problem bisheriger KI-Richtlinien
                  </h2>
                  <p style={proseStyles.p}>
                    Vielleicht kennen Sie das Dilemma: Zu strenge Richtlinien werden umgangen, 
                    zu vage bieten keine Orientierung. Die Folge sind typische Problemszenarien:
                  </p>
                  <ul style={proseStyles.ul}>
                    {[
                      "Unklare Grenzen führen zu unbedachter Eingabe sensibler Daten",
                      "Übervorsichtige Regeln verhindern selbst unkritische Experimente",
                      "Fehlende praktische Beispiele lassen Mitarbeitende im Unklaren",
                      "Umfangreiche Policy-Dokumente werden schlicht nicht gelesen",
                    ].map((item, i) => (
                      <li key={i} style={proseStyles.li}>
                        <span style={{
                          position: "absolute", left: "0", top: "0",
                          color: ACCENT, fontWeight: 500,
                        }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p style={proseStyles.p}>
                    Ich beobachte einen grundlegenden Konstruktionsfehler: Man versucht, 
                    rechtliche Compliance und praktische Anwendungshilfe in ein einziges 
                    Dokument zu packen. Das funktioniert selten – denn diese Inhalte folgen 
                    völlig unterschiedlichen Logiken.
                  </p>
                </Reveal>

                <Reveal>
                  <h2 id="strategie" data-section="strategie" style={proseStyles.h2}>
                    Die Zwei-Säulen-Strategie
                  </h2>
                  <p style={proseStyles.p}>
                    Der effektivere Ansatz ist eine bewusste Trennung in zwei aufeinander 
                    abgestimmte, aber unterschiedlich gestaltete Dokumente:
                  </p>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px",
                    marginBottom: "32px",
                  }}>
                    {[
                      { num: "1", title: "Compliance-Richtlinie", desc: "Kurz, präzise, rechtssicher" },
                      { num: "2", title: "Anwenderhandbuch", desc: "Praxisnah, beispielreich, dynamisch" },
                    ].map((item) => (
                      <div key={item.num} style={{
                        borderTop: `2px solid ${item.num === "1" ? ACCENT : "#e5e5e5"}`,
                        paddingTop: "16px",
                      }}>
                        <span style={{
                          fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                          display: "block", marginBottom: "4px",
                        }}>Säule {item.num}</span>
                        <h4 style={{
                          fontSize: "18px", fontWeight: 900, marginBottom: "4px",
                        }}>{item.title}</h4>
                        <p style={{
                          fontSize: "14px", fontWeight: 300, color: "#737373",
                        }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <h3 id="compliance" data-section="compliance" style={proseStyles.h3}>
                    Säule 1: Die schlanke Compliance-Richtlinie
                  </h3>
                  <p style={proseStyles.p}>
                    Die erste Säule bildet das rechtliche Fundament Ihrer KI-Governance – 
                    schlank, aber robust. <span style={proseStyles.strong}>Entscheidend ist:</span> Begrenzung 
                    auf wenige Seiten, die tatsächlich gelesen werden können. Klare Klassifikation 
                    von Tools und Daten. Formale Verabschiedung durch die Geschäftsleitung.
                  </p>
                  <p style={proseStyles.p}>
                    Was in diesem Dokument nicht stehen sollte: ausschweifende Erklärungen, 
                    zahlreiche Beispiele oder detaillierte Anleitungen. Die Richtlinie definiert 
                    den verbindlichen Rahmen – nicht mehr, aber auch nicht weniger.
                  </p>

                  <h3 id="handbuch" data-section="handbuch" style={proseStyles.h3}>
                    Säule 2: Das lebendige Anwenderhandbuch
                  </h3>
                  <p style={proseStyles.p}>
                    Die zweite Säule ist das Herzstück Ihrer praktischen KI-Strategie – 
                    hier findet Innovation statt. Konkrete Anwendungsbeispiele, Sammlung 
                    bewährter Prompts, Tipps zur Qualitätskontrolle, praktische Workflows.
                  </p>
                  <p style={proseStyles.p}>
                    Dieses Dokument funktioniert am besten als digitale Ressource im Wiki-Stil, 
                    die kontinuierlich wachsen kann und eine Plattform für den Wissensaustausch bietet.
                  </p>
                </Reveal>

                <Reveal>
                  <h2 id="warum" data-section="warum" style={proseStyles.h2}>
                    Warum die Trennung funktioniert
                  </h2>
                  <p style={proseStyles.p}>
                    Compliance-Richtlinien und Anwendungsanleitungen haben grundlegend verschiedene 
                    Funktionen: <span style={proseStyles.strong}>Richtlinien</span> müssen rechtssicher 
                    und verbindlich sein. <span style={proseStyles.strong}>Anwenderhandbücher</span> sollen 
                    inspirieren und praktisch helfen.
                  </p>
                  <div style={proseStyles.blockquote}>
                    <p style={{ ...proseStyles.p, marginBottom: 0 }}>
                      Die Trennung ermöglicht eine agilere Weiterentwicklung des Praxisteils, 
                      ohne das Compliance-Regelwerk ständig neu genehmigen zu müssen.
                    </p>
                  </div>
                  <p style={proseStyles.p}>
                    Ein weiterer praktischer Vorteil: Die Dokumente folgen unterschiedlichen 
                    Aktualisierungsrhythmen. Compliance-Richtlinien ändern sich primär bei neuen 
                    rechtlichen Anforderungen – eher selten. Anwenderhandbücher sollten ständig 
                    mit neuen Beispielen angereichert werden.
                  </p>
                </Reveal>

                <Reveal>
                  <h2 id="fazit" data-section="fazit" style={proseStyles.h2}>
                    Fazit: Das Beste aus beiden Welten
                  </h2>
                  <p style={proseStyles.p}>
                    Die Zwei-Säulen-Strategie vereint das Beste aus beiden Welten: Rechtssicherheit 
                    und Compliance auf der einen Seite, praxisnahe Innovation und kontinuierliches 
                    Lernen auf der anderen.
                  </p>
                  <p style={proseStyles.p}>
                    Die vielleicht wichtigste Erkenntnis aus meinen Projekten: KI-Governance ist 
                    kein einmaliges Projekt, sondern ein kontinuierlicher Prozess. Mit der 
                    Zwei-Säulen-Strategie schaffen Sie die Grundlage für eine lernende Organisation, 
                    die KI verantwortungsvoll und wertschöpfend einsetzt.
                  </p>
                </Reveal>

                {/* Tags */}
                <Reveal>
                  <div style={{
                    marginTop: "64px", paddingTop: "32px",
                    borderTop: "1px solid #e5e5e5",
                  }}>
                    <p style={{
                      fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      marginBottom: "16px",
                    }}>Tags</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {article.tags.map((tag) => (
                        <Tag key={tag} label={tag} />
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Author */}
                <Reveal>
                  <div style={{
                    marginTop: "48px", padding: "32px",
                    background: "#fafafa", border: "1px solid #e5e5e5",
                  }}>
                    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                      <div style={{
                        width: "64px", height: "64px", borderRadius: "50%",
                        background: "#e5e5e5", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px", fontWeight: 900, color: "#a3a3a3",
                      }}>R</div>
                      <div>
                        <h4 style={{
                          fontSize: "16px", fontWeight: 900, marginBottom: "4px",
                        }}>Rico Loschke</h4>
                        <p style={{
                          fontSize: "13px", fontWeight: 500, color: ACCENT,
                          marginBottom: "12px",
                        }}>AI Transformation Consultant</p>
                        <p style={{
                          fontSize: "14px", fontWeight: 300, lineHeight: 1.6,
                          color: "#525252",
                        }}>
                          Ich begleite Unternehmen auf dem Weg der KI-Transformation. 
                          Dabei verbinde ich technisches Know-how mit strategischem Denken.
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Back link */}
                <Reveal>
                  <div style={{ marginTop: "48px" }}>
                    <a href="/blog" style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      fontSize: "14px", fontWeight: 500, color: DARK,
                      textDecoration: "none",
                      transition: "color 0.25s ease",
                    }}
                      onMouseEnter={(e) => (e.target.style.color = ACCENT)}
                      onMouseLeave={(e) => (e.target.style.color = DARK)}
                    >
                      ← Zurück zum Blog
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Right: TOC */}
              <div style={{
                position: "sticky", top: `${FRAME + 100}px`,
              }}>
                <Reveal>
                  <p style={{
                    fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    marginBottom: "16px",
                  }}>Inhalt</p>
                  <div>
                    {toc.map((item) => (
                      <TocItem
                        key={item.id}
                        label={item.label}
                        href={`#${item.id}`}
                        level={item.level}
                        active={activeSection === item.id}
                      />
                    ))}
                  </div>
                </Reveal>

                {/* Share */}
                <Reveal delay={0.1}>
                  <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #e5e5e5" }}>
                    <p style={{
                      fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      marginBottom: "12px",
                    }}>Teilen</p>
                    <div style={{ display: "flex", gap: "16px" }}>
                      {["LinkedIn", "Twitter", "Copy"].map((platform) => (
                        <button
                          key={platform}
                          style={{
                            fontSize: "12px", fontWeight: 500, color: "#737373",
                            background: "none", border: "none", padding: 0,
                            cursor: "pointer", transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => (e.target.style.color = ACCENT)}
                          onMouseLeave={(e) => (e.target.style.color = "#737373")}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </article>

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
