# Fix: Reveal-Animation blockiert Crawler (opacity: 0)

**Datum:** 27.02.2026  
**Zuletzt angewendet:** 28.02.2026 (unlearn-how)  
**Betrifft:** Jede React/Astro-Anwendung mit scroll-basierten Reveal-Animationen  
**Symptom:** KI-Chat-Assistenten und Crawler können Blog-/Seiteninhalt nicht lesen

---

## Problem

Animationskomponenten mit initialem `opacity: 0` verhindern, dass Crawler den Seiteninhalt erfassen können.

### Warum?

Bei statischem HTML (SSR/SSG) wird der initiale React-State server-seitig gerendert. Das bedeutet:

- Das ausgelieferte HTML enthält `style="opacity: 0"` auf allen gewrappten Elementen
- Crawler führen **kein JavaScript** aus → IntersectionObserver/Timer wird nie getriggert
- Content bleibt mit `opacity: 0` → wird als **versteckter Inhalt** behandelt
- Betrifft: ChatGPT, Perplexity, Google (teilweise), und andere Bot-Crawler

### Betroffene Patterns

Es gibt **zwei typische Varianten**, die beide gefixt werden müssen:

#### Pattern 1: IntersectionObserver-basiert (Reveal)

Scroll-basierte Reveal-Komponenten die `useInView` / `IntersectionObserver` nutzen.

```tsx
// ❌ PROBLEMATISCH: Server rendert mit opacity: 0
function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,                    // SSR: inView = false → opacity: 0
        transform: inView ? "none" : "translateY(28px)",
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
```

#### Pattern 2: Timer-/Delay-basiert (HeroLine)

Zeitgesteuerte Einblende-Animationen, z.B. für Hero-Sektionen mit gestaffelten Delays.

```tsx
// ❌ PROBLEMATISCH: Server rendert mit opacity: 0
function HeroLine({ children, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em" }}>
      <span
        style={{
          display: "block",
          opacity: vis ? 1 : 0,                      // SSR: vis = false → opacity: 0
          transform: vis ? "translateY(0)" : "translateY(100%)",
          transition: "opacity 1.1s ease, transform 1.1s ease",
        }}
      >
        {children}
      </span>
    </span>
  );
}
```

---

## Lösung

Content **server-seitig sichtbar rendern** (`opacity: 1`), Animation erst **nach Client-Hydration** aktivieren.

### Das Prinzip (für alle Varianten gleich)

```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// Vor Hydration (SSR/Crawler): sichtbar | Nach Hydration: Animation
const isVisible = !isMounted || /* originalBedingung */;
```

### Fix Pattern 1: Reveal (IntersectionObserver)

```tsx
// ✅ FIX: Server rendert mit opacity: 1, Animation erst nach Hydration
function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Vor Hydration (SSR/Crawler): sichtbar | Nach Hydration: Animation
  const isVisible = !isMounted || inView;

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(28px)",
        transition: isMounted
          ? `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`
          : "none",  // Keine Transition vor Hydration → kein Flash
      }}
    >
      {children}
    </div>
  );
}
```

### Fix Pattern 2: HeroLine (Timer/Delay)

```tsx
// ✅ FIX: Server rendert mit opacity: 1, Animation erst nach Hydration
function HeroLine({ children, delay = 0 }) {
  const [isMounted, setIsMounted] = useState(false);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const t = setTimeout(() => setVis(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  // Vor Hydration (SSR/Crawler): sichtbar | Nach Hydration: Animation
  const isVisible = !isMounted || vis;

  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em" }}>
      <span
        style={{
          display: "block",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: isMounted
            ? "opacity 1.1s ease, transform 1.1s ease"
            : "none",
        }}
      >
        {children}
      </span>
    </span>
  );
}
```

### Wie es funktioniert

| Zustand | `isMounted` | `inView`/`vis` | `isVisible` | Ergebnis |
|---------|-------------|----------------|-------------|----------|
| **SSR / Crawler** | `false` | `false` | `true` ✅ | `opacity: 1` – Content sichtbar |
| **Client, vor Scroll/Timer** | `true` | `false` | `false` | `opacity: 0` – wartet auf Trigger |
| **Client, im Viewport/nach Timer** | `true` | `true` | `true` ✅ | `opacity: 1` – animiert rein |

### Warum kein Flash?

- `transition: "none"` solange `isMounted === false`
- Beim Hydration-Übergang (SSR `opacity:1` → Client `opacity:0`) gibt es keine Transition
- Der Wechsel passiert in einem einzigen Render-Zyklus und ist visuell nicht wahrnehmbar

---

## Checkliste für die Umsetzung

1. **Alle Animationskomponenten finden** – Suche nach `opacity` in Kombination mit `useState`, `useInView`, `IntersectionObserver`, `setTimeout`
   ```bash
   # In src/ nach opacity-Patterns suchen
   grep -rn "opacity.*inView\|opacity.*vis\|opacity.*show\|opacity.*animate" src/components/
   ```
2. **Für jede Komponente prüfen:** Wird `opacity: 0` als initialer SSR-Zustand gerendert?
3. **`isMounted`-State ergänzen** – `useState(false)` + `useEffect(() => setIsMounted(true), [])`
4. **Sichtbarkeitslogik anpassen** – `const isVisible = !isMounted || originalBedingung`
5. **Transition bedingt setzen** – `transition: isMounted ? "..." : "none"`
6. **Bewusste UI-Elemente ausschließen** – Mobile-Menü-Overlays etc. die `opacity:0` als initialen Zustand haben sind OK, solange der Content auch anders erreichbar ist (z.B. Desktop-Nav)
7. **Testen** – JavaScript im Browser deaktivieren → Content muss sichtbar sein
8. **Build + Verifizierung:**
   ```bash
   # Nach dem Build: opacity-Werte im HTML prüfen
   # Nur Navigation/Overlay-Elemente dürfen noch opacity:0 haben
   curl -s https://deine-domain.de/ | grep -o "opacity:[01]" | sort | uniq -c
   ```
9. **Deploy**

---

## Schnelltest

So prüfst du, ob das Problem bei dir existiert:

```bash
# HTML der Seite fetchen und nach opacity: 0 suchen
curl -s https://deine-domain.de/blog/artikel-slug | grep "opacity" | head -20
```

Wenn du `opacity:0` oder `opacity: 0` auf Content-Wrappern siehst → Problem vorhanden.

Nach dem Fix sollte im ausgelieferten HTML `opacity:1` stehen.

---

## Anwendungslog

| Projekt | Datum | Betroffene Komponenten | Status |
|---------|-------|----------------------|--------|
| **unlearn-how** | 28.02.2026 | `Reveal.tsx` (IntersectionObserver), `HeroLine.tsx` (Timer) | ✅ Gefixt |
| **loschke-ai** | 28.02.2026 | `Reveal.tsx` (IntersectionObserver), `HeroLine.tsx` (Timer) | ✅ Gefixt |

---

## Kontext

- **Framework:** Astro (SSG/SSR), React, Next.js – betrifft alle SSR-fähigen Frameworks
- **Gilt auch für:** Framer Motion (`initial={{ opacity: 0 }}`), GSAP ScrollTrigger, AOS, etc.
- **Grundregel:** Server-gerenderter HTML-Output muss **immer sichtbaren Content** enthalten
- **Nicht betroffen:** UI-Elemente die bewusst versteckt sind (Mobile-Menüs, Modals, Dropdowns) – solange der Content über andere sichtbare Elemente erreichbar ist
