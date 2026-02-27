# Fix: Reveal-Animation blockiert Crawler (opacity: 0)

**Datum:** 27.02.2026  
**Betrifft:** Jede React/Astro-Anwendung mit scroll-basierten Reveal-Animationen  
**Symptom:** KI-Chat-Assistenten und Crawler können Blog-/Seiteninhalt nicht lesen

---

## Problem

Scroll-basierte Reveal-Komponenten (IntersectionObserver + `opacity: 0`) verhindern, dass Crawler den Seiteninhalt erfassen können.

### Warum?

Die typische Reveal-Komponente setzt initial:

```css
opacity: 0;
transform: translateY(28px);
```

Erst wenn der IntersectionObserver erkennt, dass das Element im Viewport ist, wird `opacity: 1` gesetzt. 

**Das Problem:** Bei statischem HTML (SSR/SSG) wird der initiale React-State `inView = false` server-seitig gerendert. Das bedeutet:

- Das ausgelieferte HTML enthält `style="opacity: 0"` auf allen gewrappten Elementen
- Crawler führen **kein JavaScript** aus → IntersectionObserver wird nie getriggert
- Content bleibt mit `opacity: 0` → wird als **versteckter Inhalt** behandelt
- Betrifft: ChatGPT, Perplexity, Google (teilweise), und andere Bot-Crawler

### Betroffenes Pattern

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

---

## Lösung

Content **server-seitig sichtbar rendern** (`opacity: 1`), Animation erst **nach Client-Hydration** aktivieren.

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

### Wie es funktioniert

| Zustand | `isMounted` | `inView` | `isVisible` | Ergebnis |
|---------|-------------|----------|-------------|----------|
| **SSR / Crawler** | `false` | `false` | `true` ✅ | `opacity: 1` – Content sichtbar |
| **Client, vor Scroll** | `true` | `false` | `false` | `opacity: 0` – wartet auf Scroll |
| **Client, im Viewport** | `true` | `true` | `true` ✅ | `opacity: 1` – animiert rein |

### Warum kein Flash?

- `transition: "none"` solange `isMounted === false`
- Beim Hydration-Übergang (SSR `opacity:1` → Client `opacity:0`) gibt es keine Transition
- Der Wechsel passiert in einem einzigen Render-Zyklus und ist visuell nicht wahrnehmbar

---

## Checkliste für die Umsetzung

1. **Reveal-Komponente finden** – Suche nach `opacity: 0` in Kombination mit `IntersectionObserver` oder `useInView`
2. **`isMounted`-State ergänzen** – `useState(false)` + `useEffect(() => setIsMounted(true), [])`
3. **Sichtbarkeitslogik anpassen** – `const isVisible = !isMounted || inView`
4. **Transition bedingt setzen** – `transition: isMounted ? "..." : "none"`
5. **Testen** – JavaScript im Browser deaktivieren → Content muss sichtbar sein
6. **Build + Deploy**

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

## Kontext

- **Framework:** Astro (SSG/SSR), React, Next.js – betrifft alle SSR-fähigen Frameworks
- **Gilt auch für:** Framer Motion (`initial={{ opacity: 0 }}`), GSAP ScrollTrigger, AOS, etc.
- **Grundregel:** Server-gerenderter HTML-Output muss **immer sichtbaren Content** enthalten
