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

/* ─── Principle card for manifest page ─── */
function ManifestPrinciple({ num, title, core, text, delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: "48px 0",
          borderTop: "1px solid #e5e5e5",
          cursor: "default",
          transition: "padding-left 0.4s cubic-bezier(0.16,1,0.3,1)",
          paddingLeft: hov ? "12px" : "0",
        }}
      >
        <div style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
          <span style={{
            fontSize: "12px", fontWeight: 500, color: hov ? ACCENT : "#a3a3a3",
            fontVariantNumeric: "tabular-nums", transition: "color 0.3s ease",
            flexShrink: 0, width: "32px",
          }}>{num}</span>
          <div style={{ flex: 1, maxWidth: "640px" }}>
            <h3 style={{
              fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, letterSpacing: "-0.02em",
              marginBottom: "8px", color: hov ? ACCENT : DARK,
              transition: "color 0.3s ease", lineHeight: 1.1,
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: "14px", fontWeight: 500, color: ACCENT,
              marginBottom: "16px", letterSpacing: "0.01em",
            }}>{core}</p>
            <p style={{
              fontSize: "17px", fontWeight: 300, lineHeight: 1.7,
              color: "#525252",
            }}>{text}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ManifestPage() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

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

  const principles = [
    {
      num: "I",
      title: "Ergebnis zählt, nicht Anstrengung",
      core: "Wert liegt im Output",
      text: "Wir haben gelernt, Arbeit über Mühe zu definieren. KI nimmt uns einen Teil dieser Arbeit ab. Das kann sich komisch anfühlen, weil wir stolz auf unseren Fleiß waren. Aber der Wert unserer Arbeit liegt im Ergebnis, nicht im Schweiß. Das bedeutet nicht, dass Anstrengung nichts wert ist – es bedeutet, dass wir sie für die Dinge aufsparen können, die wirklich zählen: Denken, Entscheiden, Gestalten."
    },
    {
      num: "II",
      title: "Generalisten haben Zukunft",
      core: "Breite + Tiefe",
      text: "KI senkt die Kosten für Kompetenz. Ein Texter kann heute brauchbaren Code schreiben. Ein Stratege kann einen funktionierenden Prototyp bauen. Ich nenne das den AI Augmented Generalist – Menschen, die ihre Kernkompetenz haben, aber mit KI-Unterstützung in Nachbardisziplinen handlungsfähig werden. Das ist kein Ersatz für echte Expertise. Aber es ist eine Erweiterung dessen, was möglich ist."
    },
    {
      num: "III",
      title: "Führung kann nicht delegiert werden",
      core: "Verstehen, um zu führen",
      text: "KI-Kompetenz lässt sich nicht an eine Taskforce auslagern. Wer führt, muss verstehen. Nicht jedes technische Detail. Aber genug, um gute Fragen zu stellen, realistische Erwartungen zu haben und das Team sinnvoll zu unterstützen. Das ist unbequem. Es kostet Zeit. Aber es ist der einzige Weg, Veränderung glaubwürdig zu führen."
    },
    {
      num: "IV",
      title: "Prinzipien vor Tricks",
      core: "Denken lernen, nicht kopieren",
      text: "Der Markt ist voll von Prompt-Hacks und KI-Tricks. Das ist Fast Food – es macht kurzfristig satt, aber nicht langfristig stark. Wer versteht, wie KI denkt – wie Kontext funktioniert, wie man Aufgaben strukturiert – braucht keine Prompt-Sammlung. Er kann selbst denken. Das dauert länger. Aber es hält."
    },
    {
      num: "V",
      title: "Der Mensch bleibt das Premium-Feature",
      core: "Augmentation, nicht Automation",
      text: "Je mehr Durchschnitt automatisiert wird, desto wertvoller wird das Menschliche. Empathie. Urteilsvermögen. Echte Verbindung. Geschmack. Das sind keine Soft Skills. Das sind die Kernkompetenzen der Zukunft. Wir nutzen KI nicht, um Menschen zu ersetzen. Wir nutzen sie, um die Routine loszuwerden – damit mehr Raum für das bleibt, was nur Menschen können."
    },
    {
      num: "VI",
      title: "Starten vor Fertig",
      core: "80% heute > 100% nie",
      text: "Perfektion ist der Feind des Fortschritts. Das bedeutet nicht, schlampig zu arbeiten. Es bedeutet, früher ins Machen zu kommen. Zu testen. Zu lernen. Zu verbessern. Ein Prototyp schlägt eine Powerpoint. Ein Experiment schlägt einen Masterplan. Drei Versuche schlagen drei Monate Planung."
    },
    {
      num: "VII",
      title: "Lernen ist der eigentliche Job",
      core: "Anpassungsfähigkeit gewinnt",
      text: "Das Tool von heute ist morgen veraltet. Das Wissen von gestern ist heute unvollständig. Die einzige Konstante ist Veränderung. Die einzige sinnvolle Antwort ist Anpassungsfähigkeit. Wir hören nicht auf zu lernen. Nicht weil wir müssen, sondern weil wir verstanden haben: Wer stehen bleibt, fällt zurück."
    },
  ];

  const navLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Manifest", href: "/manifest", active: true },
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
              HERO — Manifest intro
              ═══════════════════════════════════════════════ */}
          <header style={{
            minHeight: "70vh",
            display: "flex", alignItems: "flex-end",
            padding: "0 36px 80px",
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
                Manifest
              </div>
              <div>
                <h1 style={{
                  fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 900,
                  lineHeight: 0.92, letterSpacing: "-0.035em", marginBottom: "32px",
                }}>
                  <HeroLine delay={0.1}>Wofür ich</HeroLine>
                  <HeroLine delay={0.2}>stehe<Dot /></HeroLine>
                </h1>
                <Reveal delay={0.5}>
                  <p style={{
                    fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 300,
                    lineHeight: 1.6, color: "#525252", maxWidth: "520px",
                  }}>
                    Jeden Tag ein neues KI-Tool. Jeden Tag neue Schlagzeilen. 
                    Alle reden über KI, aber wenige wissen, wie sie damit 
                    tatsächlich besser arbeiten.
                  </p>
                </Reveal>
              </div>
            </div>
          </header>

          {/* ═══════════════════════════════════════════════
              INTRO — Warum das hier
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "80px 36px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Haltung</p>
              </Reveal>
              <div style={{ maxWidth: "640px" }}>
                <Reveal>
                  <p style={{
                    fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 300,
                    lineHeight: 1.6, marginBottom: "24px",
                  }}>
                    Ich glaube, das geht anders.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p style={{
                    fontSize: "17px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252", marginBottom: "20px",
                  }}>
                    Nicht mit mehr Hype. Nicht mit dem nächsten "Game-Changer". 
                    Sondern mit klarem Denken, ehrlicher Einschätzung und 
                    praktischer Umsetzung.
                  </p>
                </Reveal>
                <Reveal delay={0.15}>
                  <p style={{
                    fontSize: "17px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252",
                  }}>
                    Das hier sind die Grundsätze, nach denen ich arbeite – 
                    mit mir selbst und mit den Menschen, die ich begleite.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              7 GRUNDSÄTZE — Full manifest
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "60px 36px 100px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>7 Grundsätze</p>
              </Reveal>
              <div>
                {principles.map((p, i) => (
                  <ManifestPrinciple
                    key={p.num}
                    num={p.num}
                    title={p.title}
                    core={p.core}
                    text={p.text}
                    delay={i * 0.06}
                  />
                ))}
                <div style={{ borderTop: "1px solid #e5e5e5" }} />
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              CREDO — Woran ich glaube
              ═══════════════════════════════════════════════ */}
          <section style={{
            padding: "120px 36px", borderTop: "1px solid #e5e5e5",
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
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Credo</p>
              </Reveal>
              <div style={{ maxWidth: "700px" }}>
                <Reveal>
                  <h2 style={{
                    fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 900,
                    lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: "48px",
                  }}>
                    Woran ich<br />glaube<Dot />
                  </h2>
                </Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {[
                    "Eine Arbeitswelt, die weniger beschäftigt, aber wirksamer ist.",
                    "Technologie, die uns erweitert, nicht ersetzt.",
                    "Menschen, die verlernen, was sie bremst – um zu lernen, was sie weiterbringt.",
                  ].map((belief, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <p style={{
                        fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 300,
                        lineHeight: 1.5, color: DARK,
                        paddingLeft: "24px",
                        borderLeft: `3px solid ${i === 0 ? ACCENT : "#e5e5e5"}`,
                      }}>
                        {belief}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              BACK LINK
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "80px 36px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "center",
            }}>
              <div />
              <Reveal>
                <a href="/" style={{
                  display: "inline-flex", alignItems: "center", gap: "12px",
                  fontSize: "14px", fontWeight: 500, color: DARK,
                  textDecoration: "none",
                  transition: "color 0.25s ease",
                }}
                  onMouseEnter={(e) => (e.target.style.color = ACCENT)}
                  onMouseLeave={(e) => (e.target.style.color = DARK)}
                >
                  ← Zurück zur Startseite
                </a>
              </Reveal>
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
