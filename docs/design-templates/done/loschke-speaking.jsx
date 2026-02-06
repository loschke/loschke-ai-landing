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

/* ─── Speaking Topic Card ─── */
function TopicCard({ num, title, level, narrative, forWhom, formats, delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: "36px 0",
          borderTop: "1px solid #e5e5e5",
          cursor: "default",
          transition: "padding-left 0.4s cubic-bezier(0.16,1,0.3,1)",
          paddingLeft: hov ? "12px" : "0",
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "baseline" }}>
          <span style={{
            fontSize: "11px", fontWeight: 500, color: hov ? ACCENT : "#a3a3a3",
            fontVariantNumeric: "tabular-nums", transition: "color 0.3s ease",
            flexShrink: 0, width: "24px",
          }}>{num}</span>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: "8px",
            }}>{level}</p>
            <h3 style={{
              fontSize: "22px", fontWeight: 900, letterSpacing: "-0.01em",
              marginBottom: "12px", color: hov ? ACCENT : DARK,
              transition: "color 0.3s ease", lineHeight: 1.2,
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: "15px", fontWeight: 300, lineHeight: 1.7,
              color: "#525252", maxWidth: "560px", marginBottom: "16px",
            }}>{narrative}</p>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "baseline" }}>
              <p style={{
                fontSize: "13px", fontWeight: 400, color: "#737373",
              }}>
                <span style={{ fontWeight: 500, color: DARK }}>Für:</span> {forWhom}
              </p>
              <p style={{
                fontSize: "13px", fontWeight: 400, color: "#737373",
              }}>
                <span style={{ fontWeight: 500, color: DARK }}>Format:</span> {formats}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function SpeakingPage() {
  const [hovered, setHovered] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Manifest", href: "/manifest" },
    { label: "Speaking", href: "/speaking", active: true },
    { label: "Über mich", href: "/about" },
  ];

  const topics = [
    {
      num: "01",
      level: "Die große Einordnung",
      title: "Generative KI verstehen: Ein ehrlicher Blick",
      narrative: "Eine nüchterne Bestandsaufnahme. Was kann KI wirklich, was nicht? Wo sind die echten Potenziale, wo der Hype? Keine Versprechen, keine Panikmache — sondern eine fundierte Basis für eigene Entscheidungen. Aus vier Jahren täglicher Arbeit mit generativer KI.",
      forWhom: "Führungskräfte, Entscheider, Teams",
      formats: "Keynote, Impulsvortrag · 30–60 Min",
    },
    {
      num: "02",
      level: "Die große Einordnung",
      title: "KI-Transformation ohne Illusionen",
      narrative: "Das zentrale Paradoxon: Warum scheitern KI-Initiativen sowohl bei zu viel als auch bei zu wenig Erwartung? Warum führen unterschiedliche Formen der Überforderung zu ähnlichen Blockaden? Und was hilft wirklich? Konkrete Muster aus der Praxis — was funktioniert, was nicht.",
      forWhom: "C-Level, Führungskräfte",
      formats: "Keynote, Impulsvortrag · 30–45 Min",
    },
    {
      num: "03",
      level: "Was sich verändert",
      title: "Das neue Internet: Suche, Content, Interaktion",
      narrative: "Wenn KI die erste Anlaufstelle wird, verändert sich alles. Das ist größer als SEO vs. AI Overviews — es geht um eine fundamentale Verschiebung in der Art, wie wir mit Information interagieren. Und warum Personal Brands wichtiger werden als Suchmaschinenoptimierung.",
      forWhom: "Marketing, Kommunikation, Digital",
      formats: "Keynote, Impulsvortrag · 30–45 Min",
    },
    {
      num: "04",
      level: "Was sich verändert",
      title: "Das Ende der Spezialisten? Skills im KI-Zeitalter",
      narrative: "KI senkt die Kosten für Kompetenz. Ein Texter kann Code schreiben. Ein Stratege baut Prototypen. Aber was bedeutet das für Karrieren, für Teams, für Organisationen? Welche Skills werden wertvoller — und warum Empathie, Urteilsvermögen und Geschmack keine Soft Skills mehr sind.",
      forWhom: "HR, Führungskräfte, Teams",
      formats: "Keynote, Impulsvortrag · 30–45 Min",
    },
    {
      num: "05",
      level: "Was sich verändert",
      title: "Führen im KI-Zeitalter: Verstehen, um zu entscheiden",
      narrative: "KI-Kompetenz lässt sich nicht an eine Taskforce auslagern. Wer führt, muss genug verstehen, um gute Fragen zu stellen, Bullshit zu erkennen und Veränderung glaubwürdig zu gestalten. Kein Coding-Kurs — aber ein notwendiger Mindset-Shift.",
      forWhom: "C-Level, Management",
      formats: "Keynote, Impulsvortrag · 30–45 Min",
    },
    {
      num: "06",
      level: "Wie wir damit umgehen",
      title: "Lernen als Job: Anpassungsfähigkeit als Kernkompetenz",
      narrative: "Das Tool von heute ist morgen veraltet. Die einzige sinnvolle Antwort auf permanente Veränderung ist permanente Anpassungsfähigkeit. Wie lernt man richtig in einer Welt, in der Wissen schneller obsolet wird als man es aufbauen kann? Und warum drei Versuche drei Monate Planung schlagen.",
      forWhom: "Fachkräfte, Teams, Führungskräfte",
      formats: "Keynote, Impulsvortrag · 30–45 Min",
    },
  ];

  const credentials = [
    { name: "IHK", type: "Honorardozent" },
    { name: "Haufe Akademie", type: "Trainer" },
    { name: "Bitkom", type: "Referent" },
    { name: "MVFP Akademie", type: "Experte" },
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
            position: "sticky", top: FRAME, zIndex: 100,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "24px 36px",
            background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            transition: "background 0.4s ease",
          }}>
            <a href="/" style={{
              fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em",
              textDecoration: "none", color: DARK,
            }}>
              RL<Dot />
            </a>
            <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
              {navLinks.map((l) => (
                <a key={l.label} href={l.href}
                  onMouseEnter={() => setHovered(l.label)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    fontSize: "13px", fontWeight: 500, textDecoration: "none",
                    color: l.active ? ACCENT : (hovered === l.label ? ACCENT : "#525252"),
                    transition: "color 0.2s ease",
                  }}
                >{l.label}</a>
              ))}
            </div>
          </nav>

          {/* ═══════════════════════════════════════════════
              HERO
              ═══════════════════════════════════════════════ */}
          <section style={{
            minHeight: `calc(70vh - ${FRAME * 2}px)`,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 36px 60px",
          }}>
            <div style={{ maxWidth: "900px" }}>
              <HeroLine delay={0.15}>
                <p style={{
                  fontSize: "12px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "28px",
                }}>
                  Keynotes & Impulsvorträge
                </p>
              </HeroLine>

              <h1 style={{
                fontSize: "clamp(40px, 6.5vw, 88px)",
                fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.035em",
                margin: "0 0 40px 0",
              }}>
                <HeroLine delay={0.25}>Perspektiven,</HeroLine>
                <HeroLine delay={0.38}>keine Versprechen<Dot /></HeroLine>
              </h1>

              <HeroLine delay={0.6}>
                <p style={{
                  fontSize: "18px", fontWeight: 300, lineHeight: 1.7,
                  color: "#525252", maxWidth: "520px",
                }}>
                  Ich halte Vorträge für Menschen, die verstehen wollen,
                  was KI für sie bedeutet — nicht für Menschen, die
                  Buzzwords hören wollen. Ehrliche Einordnung statt Hype.
                  Erfahrung aus der Praxis statt Folien aus dem Internet.
                </p>
              </HeroLine>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              CREDENTIALS — kurz, glaubwürdig
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "60px 36px 80px", borderTop: "1px solid #e5e5e5" }}>
            <Reveal>
              <div style={{
                display: "flex", gap: "48px", flexWrap: "wrap",
                alignItems: "center", justifyContent: "flex-start",
              }}>
                <p style={{
                  fontSize: "13px", fontWeight: 400, color: "#737373",
                  marginRight: "12px",
                }}>
                  Als Trainer und Referent für:
                </p>
                {credentials.map((c, i) => (
                  <div key={c.name} style={{
                    display: "flex", flexDirection: "column", gap: "2px",
                  }}>
                    <span style={{
                      fontSize: "15px", fontWeight: 900, color: DARK,
                      letterSpacing: "-0.01em",
                    }}>{c.name}</span>
                    <span style={{
                      fontSize: "11px", fontWeight: 400, color: "#a3a3a3",
                    }}>{c.type}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ═══════════════════════════════════════════════
              ABOUT — kurzer Kontext
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "80px 36px", borderTop: "1px solid #e5e5e5", background: "#fafafa" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Hintergrund</p>
              </Reveal>
              <div style={{ maxWidth: "640px" }}>
                <Reveal>
                  <p style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 300,
                    lineHeight: 1.55, marginBottom: "20px",
                  }}>
                    Vier Jahre als Director Automation & AI.
                    Seit 2026 selbständig. Was mich antreibt:
                    die Lücke zwischen dem, was KI kann, und dem,
                    was wir daraus machen.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p style={{
                    fontSize: "15px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252",
                  }}>
                    Ich übersetze zwischen Tech und Business, zwischen
                    Strategie und Praxis. Keine Folien voller Screenshots —
                    sondern Einordnung, Perspektive, manchmal auch
                    unbequeme Wahrheiten.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              TOPICS
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "100px 36px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <div style={{ position: "sticky", top: `${FRAME + 80}px` }}>
                  <p style={{
                    fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    marginBottom: "16px",
                  }}>Themen</p>
                  <p style={{
                    fontSize: "14px", fontWeight: 300, lineHeight: 1.6,
                    color: "#737373", maxWidth: "180px",
                  }}>
                    Von der großen Einordnung bis zur persönlichen Konsequenz.
                  </p>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <h2 style={{
                    fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900,
                    lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: "20px",
                  }}>
                    Sechs Perspektiven<Dot />
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p style={{
                    fontSize: "16px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252", maxWidth: "520px", marginBottom: "48px",
                  }}>
                    Jeder Vortrag kann an Ihre Veranstaltung angepasst werden —
                    in Länge, Tiefe und Schwerpunkt. Alle Themen funktionieren
                    als Keynote, Impulsvortrag oder als Einstieg in einen Workshop.
                  </p>
                </Reveal>

                {topics.map((t, i) => (
                  <TopicCard key={t.num} {...t} delay={i * 0.06} />
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              APPROACH — wie ich arbeite
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "100px 36px", borderTop: "1px solid #e5e5e5", background: "#fafafa" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Arbeitsweise</p>
              </Reveal>
              <div>
                <Reveal>
                  <h2 style={{
                    fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900,
                    lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: "48px",
                  }}>
                    Was Sie<br />erwarten können<Dot />
                  </h2>
                </Reveal>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px" }}>
                  {[
                    {
                      title: "Kein Standard-Vortrag",
                      text: "Jede Keynote wird auf Ihre Veranstaltung zugeschnitten. Ich spreche vorher mit Ihnen, verstehe Ihr Publikum, passe Beispiele und Tiefe an."
                    },
                    {
                      title: "Substanz statt Show",
                      text: "Keine Motivationsphrasen, keine Buzzword-Bingo-Folien. Sondern Inhalte, über die Ihr Publikum auch am nächsten Tag noch nachdenkt."
                    },
                    {
                      title: "Ehrliche Einschätzung",
                      text: "Ich sage auch, was nicht funktioniert und wo der Hype größer ist als die Realität. Das macht unbequem — aber nützlich."
                    },
                  ].map((item, i) => (
                    <Reveal key={item.title} delay={i * 0.1}>
                      <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: "24px" }}>
                        <h3 style={{
                          fontSize: "18px", fontWeight: 900, letterSpacing: "-0.01em",
                          marginBottom: "12px",
                        }}>{item.title}</h3>
                        <p style={{
                          fontSize: "15px", fontWeight: 300, lineHeight: 1.65,
                          color: "#525252",
                        }}>{item.text}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              CTA
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "140px 36px", borderTop: "1px solid #e5e5e5" }}>
            <Reveal>
              <div style={{
                display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
                gap: "60px", alignItems: "start",
              }}>
                <div />
                <div style={{ maxWidth: "700px" }}>
                  <h2 style={{
                    fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 900,
                    lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: "28px",
                  }}>
                    Passt ein Thema<br />zu Ihrer Veranstaltung<Dot />
                  </h2>
                  <p style={{
                    fontSize: "17px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252", maxWidth: "480px", marginBottom: "36px",
                  }}>
                    Schreiben Sie mir, was Sie vorhaben. Ich melde mich
                    innerhalb von zwei Tagen mit einer ehrlichen Einschätzung,
                    ob und wie ich helfen kann.
                  </p>
                  <div style={{ display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
                    <a href="mailto:rico@loschke.ai" style={{
                      display: "inline-block", background: DARK, color: "#fff",
                      padding: "14px 32px", fontSize: "13px", fontWeight: 500,
                      textDecoration: "none", letterSpacing: "0.02em",
                      transition: "background 0.3s ease",
                    }}
                      onMouseEnter={(e) => (e.target.style.background = ACCENT)}
                      onMouseLeave={(e) => (e.target.style.background = DARK)}
                    >
                      Anfrage senden
                    </a>
                    <a href="https://linkedin.com/in/loschke" style={{
                      fontSize: "13px", fontWeight: 500, color: ACCENT,
                      textDecoration: "none", borderBottom: "1px solid transparent",
                      transition: "border-color 0.25s ease",
                    }}
                      onMouseEnter={(e) => (e.target.style.borderColor = ACCENT)}
                      onMouseLeave={(e) => (e.target.style.borderColor = "transparent")}
                    >
                      LinkedIn →
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
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
