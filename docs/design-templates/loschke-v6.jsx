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
    <span style={{
      display: "block", overflow: "hidden",
    }}>
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

/* ─── Principle card with number + hover ─── */
function Principle({ num, title, core, text, delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: "32px 0",
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
            <h3 style={{
              fontSize: "20px", fontWeight: 900, letterSpacing: "-0.01em",
              marginBottom: "4px", color: hov ? ACCENT : DARK,
              transition: "color 0.3s ease",
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: "13px", fontWeight: 500, color: ACCENT,
              marginBottom: "8px", letterSpacing: "0.01em",
            }}>{core}</p>
            <p style={{
              fontSize: "15px", fontWeight: 300, lineHeight: 1.65,
              color: "#525252", maxWidth: "520px",
            }}>{text}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function LoschkeV6() {
  const [hovered, setHovered] = useState(null);
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);

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
    { num: "I", title: "Ergebnis zählt, nicht Anstrengung", core: "Wert liegt im Output", text: "KI nimmt uns Routine ab. Das kann sich komisch anfühlen, weil wir stolz auf unseren Fleiß waren. Aber der Wert unserer Arbeit liegt im Ergebnis — nicht im Schweiß." },
    { num: "II", title: "Generalisten haben Zukunft", core: "Breite + Tiefe", text: "KI senkt die Kosten für Kompetenz. Ein Texter kann Code schreiben. Ein Stratege baut Prototypen. Der AI Augmented Generalist ist keine Verwässerung — sondern Erweiterung." },
    { num: "III", title: "Führung kann nicht delegiert werden", core: "Verstehen, um zu führen", text: "KI-Kompetenz lässt sich nicht an eine Taskforce auslagern. Wer führt, muss genug verstehen, um gute Fragen zu stellen und Veränderung glaubwürdig zu gestalten." },
    { num: "IV", title: "Prinzipien vor Tricks", core: "Denken lernen, nicht kopieren", text: "Prompt-Hacks sind Fast Food. Wer versteht, wie KI denkt — wie Kontext funktioniert, wie man Aufgaben strukturiert — braucht keine Prompt-Sammlung." },
    { num: "V", title: "Der Mensch bleibt das Premium-Feature", core: "Augmentation, nicht Automation", text: "Je mehr Durchschnitt automatisiert wird, desto wertvoller wird das Menschliche. Empathie, Urteilsvermögen, Geschmack. Das sind keine Soft Skills — das sind Kernkompetenzen." },
    { num: "VI", title: "Starten vor Fertig", core: "80% heute > 100% nie", text: "Ein Prototyp schlägt eine Powerpoint. Ein Experiment schlägt einen Masterplan. Drei Versuche schlagen drei Monate Planung." },
    { num: "VII", title: "Lernen ist der eigentliche Job", core: "Anpassungsfähigkeit gewinnt", text: "Das Tool von heute ist morgen veraltet. Die einzige sinnvolle Antwort auf permanente Veränderung ist permanente Anpassungsfähigkeit." },
  ];

  const articles = [
    { date: "Jun 2025", title: "Vibe Coding: Zwischen Hype und Realität", desc: "Warum der Ansatz besser ist als sein Ruf — aber auch gefährlicher." },
    { date: "Mai 2025", title: "Von No-Code zu Code-First: Agent Frameworks", desc: "Make, n8n, PydanticAI — ein ehrlicher Vergleich aus der Praxis." },
    { date: "Mai 2025", title: "KI-Governance, die wirklich funktioniert", desc: "Duale Strategie: Compliance für die Rechtsabteilung, Handbook für den Alltag." },
    { date: "Apr 2025", title: "Follow schlägt Search", desc: "Warum persönliche Marken in der AI-Ära wichtiger werden als SEO." },
  ];

  const pillars = [
    { icon: "◎", label: "Visionen & Prognosen", sub: "Was kommt auf uns zu" },
    { icon: "◆", label: "Takes & Meinungen", sub: "Gegen den Mainstream denken" },
    { icon: "▲", label: "Experimente & Learnings", sub: "Ich hab's ausprobiert" },
    { icon: "◻", label: "Building in Public", sub: "Die Reise zeigen" },
    { icon: "●", label: "Persönliches", sub: "Was ich auf dem Weg lerne" },
  ];

  const navLinks = [
    { label: "Blog", href: "/blog" },
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
                    color: hovered === l.label ? ACCENT : "#525252",
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
            minHeight: `calc(88vh - ${FRAME * 2}px)`,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 36px 60px",
          }}>
            <div style={{ maxWidth: "1000px" }}>
              <HeroLine delay={0.15}>
                <p style={{
                  fontSize: "12px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "28px",
                }}>
                  Rico Loschke · AI Transformation · Dresden · {time}
                </p>
              </HeroLine>

              <h1 style={{
                fontSize: "clamp(44px, 7.5vw, 104px)",
                fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.035em",
                margin: "0 0 48px 0",
              }}>
                <HeroLine delay={0.25}>Prinzipien</HeroLine>
                <HeroLine delay={0.38}>statt Tricks<Dot /></HeroLine>
              </h1>

              <HeroLine delay={0.6}>
                <p style={{
                  fontSize: "18px", fontWeight: 300, lineHeight: 1.7,
                  color: "#525252", maxWidth: "460px",
                }}>
                  Ich denke laut über KI nach. Keine Hacks,
                  keine Marketing-Versprechen — sondern klares Denken,
                  ehrliche Einschätzungen und was ich auf dem Weg lerne.
                </p>
              </HeroLine>

              <HeroLine delay={0.75}>
                <div style={{ display: "flex", gap: "24px", marginTop: "36px" }}>
                  <a href="/blog" style={{
                    display: "inline-block", background: DARK, color: "#fff",
                    padding: "13px 28px", fontSize: "13px", fontWeight: 500,
                    textDecoration: "none", letterSpacing: "0.02em",
                    transition: "background 0.3s ease",
                  }}
                    onMouseEnter={(e) => (e.target.style.background = ACCENT)}
                    onMouseLeave={(e) => (e.target.style.background = DARK)}
                  >
                    Blog lesen
                  </a>
                  <a href="/manifest" style={{
                    display: "inline-block", padding: "13px 0",
                    fontSize: "13px", fontWeight: 500, color: ACCENT,
                    textDecoration: "none", borderBottom: "1px solid transparent",
                    transition: "border-color 0.25s ease",
                  }}
                    onMouseEnter={(e) => (e.target.style.borderColor = ACCENT)}
                    onMouseLeave={(e) => (e.target.style.borderColor = "transparent")}
                  >
                    Mein Manifest →
                  </a>
                </div>
              </HeroLine>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              ABOUT – Short, personal
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "100px 36px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Wer ich bin</p>
              </Reveal>
              <div style={{ maxWidth: "680px" }}>
                <Reveal>
                  <p style={{
                    fontSize: "clamp(22px, 2.8vw, 34px)", fontWeight: 300,
                    lineHeight: 1.5, marginBottom: "28px",
                  }}>
                    Seit 2021 arbeite ich täglich mit generativer KI.
                    Erst als Director Automation & AI, seit 2026 selbständig.
                    Was mich antreibt: die Lücke zwischen dem, was KI kann,
                    und dem, was wir daraus machen.
                  </p>
                </Reveal>
                <Reveal delay={0.12}>
                  <p style={{
                    fontSize: "16px", fontWeight: 300, lineHeight: 1.75,
                    color: "#525252", maxWidth: "560px",
                  }}>
                    Kein Spezialist in einem Bereich, sondern ein Generalist
                    mit Tiefe — ich übersetze zwischen Tech und Business,
                    zwischen Strategie und Praxis. In Keynotes wie in
                    Code-Sessions. Für Konzerne wie für Solo-Gründer.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              BLOG / AKTUELLES — Prominent
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "100px 36px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Aktuelles</p>
              </Reveal>
              <div>
                <Reveal>
                  <h2 style={{
                    fontSize: "clamp(34px, 4.5vw, 60px)", fontWeight: 900,
                    lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: "20px",
                  }}>
                    Was mich<br />gerade bewegt<Dot />
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p style={{
                    fontSize: "16px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252", maxWidth: "480px", marginBottom: "56px",
                  }}>
                    Beobachtungen, Experimente, Einordnungen.
                    Alles, worüber ich gerade nachdenke — ohne Filter.
                  </p>
                </Reveal>

                {articles.map((a, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <a href="#" style={{
                      display: "block", textDecoration: "none", color: "inherit",
                      padding: "24px 0", borderTop: "1px solid #e5e5e5",
                      transition: "padding-left 0.35s cubic-bezier(0.16,1,0.3,1)",
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.paddingLeft = "16px";
                        e.currentTarget.querySelector("h3").style.color = ACCENT;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.paddingLeft = "0";
                        e.currentTarget.querySelector("h3").style.color = DARK;
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "6px" }}>
                        <time style={{ fontSize: "12px", color: "#a3a3a3", fontWeight: 400, flexShrink: 0 }}>
                          {a.date}
                        </time>
                        <h3 style={{
                          fontSize: "20px", fontWeight: 900, letterSpacing: "-0.01em",
                          transition: "color 0.25s ease", margin: 0,
                        }}>
                          {a.title}
                        </h3>
                      </div>
                      <p style={{
                        fontSize: "15px", fontWeight: 300, lineHeight: 1.6,
                        color: "#525252", maxWidth: "520px",
                      }}>
                        {a.desc}
                      </p>
                    </a>
                  </Reveal>
                ))}

                <Reveal delay={0.35}>
                  <a href="/blog" style={{
                    display: "inline-block", marginTop: "32px",
                    fontSize: "13px", fontWeight: 500, color: ACCENT,
                    textDecoration: "none", borderBottom: "1px solid transparent",
                    transition: "border-color 0.25s ease",
                  }}
                    onMouseEnter={(e) => (e.target.style.borderColor = ACCENT)}
                    onMouseLeave={(e) => (e.target.style.borderColor = "transparent")}
                  >
                    Alle Artikel →
                  </a>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              MANIFEST / 7 GRUNDSÄTZE — The core identity piece
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
                <div style={{ position: "sticky", top: `${FRAME + 80}px` }}>
                  <p style={{
                    fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    marginBottom: "16px",
                  }}>Manifest</p>
                  <p style={{
                    fontSize: "14px", fontWeight: 300, lineHeight: 1.6,
                    color: "#737373", maxWidth: "180px",
                  }}>
                    Wofür ich stehe. Wie ich arbeite. Was ich glaube.
                  </p>
                </div>
              </Reveal>
              <div>
                <Reveal>
                  <h2 style={{
                    fontSize: "clamp(34px, 4.5vw, 60px)", fontWeight: 900,
                    lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: "20px",
                  }}>
                    7 Grundsätze<Dot />
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p style={{
                    fontSize: "16px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252", maxWidth: "520px", marginBottom: "48px",
                  }}>
                    Jeden Tag ein neues KI-Tool. Jeden Tag neue Schlagzeilen.
                    Ich glaube, es geht anders — nicht mit mehr Hype,
                    sondern mit klarem Denken und praktischer Umsetzung.
                  </p>
                </Reveal>

                {principles.map((p, i) => (
                  <Principle key={p.num} {...p} delay={i * 0.06} />
                ))}

                <Reveal delay={0.5}>
                  <a href="/manifest" style={{
                    display: "inline-block", marginTop: "32px",
                    fontSize: "13px", fontWeight: 500, color: ACCENT,
                    textDecoration: "none", borderBottom: "1px solid transparent",
                    transition: "border-color 0.25s ease",
                  }}
                    onMouseEnter={(e) => (e.target.style.borderColor = ACCENT)}
                    onMouseLeave={(e) => (e.target.style.borderColor = "transparent")}
                  >
                    Das vollständige Manifest →
                  </a>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              WORÜBER ICH SCHREIBE — Content pillars
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "100px 36px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Themen</p>
              </Reveal>
              <div>
                <Reveal>
                  <h2 style={{
                    fontSize: "clamp(34px, 4.5vw, 60px)", fontWeight: 900,
                    lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: "56px",
                  }}>
                    Worüber ich<br />nachdenke<Dot />
                  </h2>
                </Reveal>

                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0",
                }}>
                  {pillars.map((p, i) => (
                    <Reveal key={p.label} delay={i * 0.08}>
                      <div style={{
                        padding: "28px 20px 28px 0",
                        borderTop: "1px solid #e5e5e5",
                      }}>
                        <span style={{
                          fontSize: "10px", color: ACCENT, display: "block",
                          marginBottom: "10px", letterSpacing: "0.05em",
                        }}>{p.icon}</span>
                        <h3 style={{
                          fontSize: "16px", fontWeight: 900, letterSpacing: "-0.01em",
                          marginBottom: "4px",
                        }}>{p.label}</h3>
                        <p style={{
                          fontSize: "14px", fontWeight: 300, color: "#737373",
                          lineHeight: 1.5,
                        }}>{p.sub}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              ÖKOSYSTEM — Brief, contextual
              ═══════════════════════════════════════════════ */}
          <section style={{ padding: "100px 36px", borderTop: "1px solid #e5e5e5" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
              gap: "60px", alignItems: "start",
            }}>
              <Reveal>
                <p style={{
                  fontSize: "11px", fontWeight: 500, color: "#a3a3a3",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  position: "sticky", top: `${FRAME + 80}px`,
                }}>Ökosystem</p>
              </Reveal>
              <div>
                <Reveal>
                  <p style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 300,
                    lineHeight: 1.5, marginBottom: "40px", maxWidth: "560px",
                  }}>
                    Dieses Blog ist eine von drei Plattformen.
                    Jede hat ihren eigenen Fokus — zusammen bilden
                    sie ein System für KI-Transformation.
                  </p>
                </Reveal>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
                  {[
                    { name: "loschke.ai", role: "Thought Leadership", desc: "Du bist hier. Denken, Experimente, Meinung.", active: true },
                    { name: "unlearn.how", role: "B2B Transformation", desc: "Beratung und Workshops für Organisationen." },
                    { name: "lernen.diy", role: "Self-Service Learning", desc: "Guides, Frameworks, Ressourcen. Ohne Gatekeeping." },
                  ].map((b, i) => (
                    <Reveal key={b.name} delay={i * 0.1}>
                      <div style={{
                        borderTop: b.active ? `2px solid ${ACCENT}` : "1px solid #e5e5e5",
                        paddingTop: "24px",
                      }}>
                        <h3 style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-0.01em", marginBottom: "2px" }}>
                          {b.name}
                        </h3>
                        <p style={{
                          fontSize: "12px", fontWeight: 500,
                          color: b.active ? ACCENT : "#a3a3a3",
                          marginBottom: "12px", letterSpacing: "0.01em",
                        }}>
                          {b.role}
                        </p>
                        <p style={{
                          fontSize: "15px", fontWeight: 300, lineHeight: 1.6, color: "#525252",
                        }}>
                          {b.desc}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              CTA — Personal, not corporate
              ═══════════════════════════════════════════════ */}
          <section style={{
            padding: "140px 36px", borderTop: "1px solid #e5e5e5",
            background: "#fafafa",
          }}>
            <Reveal>
              <div style={{
                display: "grid", gridTemplateColumns: "minmax(100px, 240px) 1fr",
                gap: "60px", alignItems: "start",
              }}>
                <div />
                <div style={{ maxWidth: "700px" }}>
                  <h2 style={{
                    fontSize: "clamp(38px, 5.5vw, 76px)", fontWeight: 900,
                    lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: "28px",
                  }}>
                    Lass uns<br />reden<Dot />
                  </h2>
                  <p style={{
                    fontSize: "17px", fontWeight: 300, lineHeight: 1.7,
                    color: "#525252", maxWidth: "440px", marginBottom: "36px",
                  }}>
                    Du willst mich für eine Keynote buchen,
                    hast eine Frage zu einem Artikel,
                    oder willst einfach Hallo sagen? Schreib mir.
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
                      rico@loschke.ai
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
