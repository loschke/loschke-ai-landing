# Implementierungsplan: Loschke.ai Redesign

Dieser Plan beschreibt die schrittweise Transformation der Loschke.ai Website basierend auf den neuen Design-Templates und spezifischen Branding-Vorgaben. Ziel ist eine saubere, komponenten-basierte Architektur unter Verwendung von Astro, React und Tailwind CSS.

## Phase 1: Fundament & Design System

In dieser Phase legen wir die technischen Grundlagen und definieren die globalen Styles gemäß dem minimalen Farbschema.

- [ ] **Design Tokens & Typografie**
    - **Farben**: Minimalistisches Schema.
        - Primary/Accent: `#FC2D01` (Rot/Orange) - für Interaktionen, den "Punkt" im Logo.
        - Backgrounds: Weiß `#ffffff` & Light Gray `#f5f5f5` (zur Absetzung von Sektionen).
        - Text: Dark `#151416` (statt reinem Schwarz).
    - **Typografie**:
        - Headings: `Noto Sans` (Modern, Bold/Black für Impact).
        - Accents/Subtext: `Instrument Serif` (für eleganten Kontrast, sparsam eingesetzt).
        - Body: `Noto Sans`.
    - Update der `tailwind.config.mjs` und `src/styles/global.css`.
- [ ] **Core Layout erstellen (`src/layouts/FrameLayout.astro`)**
    - Implementierung des fixen "Frames" (18px Border in Accent Color?).
    - Scroll-Container Logik.
    - Responsive Anpassungen.
- [ ] **Core UI Components (React/Astro)**
    - `Reveal` & `HeroLine`: Animations-Wrapper.
    - `Dot`: Design-Element (Punkt in Akzentfarbe).
    - `AvatarIntro`: Komponente für "Hi, ich bin Rico" mit Bild (siehe Screenshot), integrierbar in Header oder Hero.

## Phase 2: Globale Komponenten

Komponenten, die auf fast allen Seiten verwendet werden.

- [ ] **Navigation (`src/components/layout/Nav.astro`)**
    - **Logo**: "RL." (Text-Logo, Serif/Sans-Mix?, Punkt in Primary Color).
    - Integration des `AvatarIntro` (optional oder responsive gesteuert).
    - Responsive Navigation mit "Sticky"-Effekt.
- [ ] **Footer (`src/components/layout/Footer.astro`)**
    - Reduziertes Design.

## Phase 3: Feature-Komponenten

Spezifische Komponenten für bestimmte Seitenfunktionen.

- [ ] **Audio Player (`src/components/features/AudioPlayer.tsx`)**
    - React Island für Audio-Wiedergabe.
- [ ] **Blog Components**
    - `ArticleCard`: Vorschau-Karte.
    - `CategoryPill`: Filter-Elemente.

## Phase 4: Seiten-Implementierung

Aufbau der eigentlichen Seiten.

- [ ] **Homepage (`src/pages/index.astro`)**
    - Portierung von `loschke-homepage-v2.jsx`.
    - **Anpassung**: Integration der "Hi, ich bin Rico" Vorstellung im Hero-Bereich (neben/unter der Headline).
    - Nutzung von `Noto Sans` für die großen Headlines.
    - Gezielter Einsatz von `Instrument Serif` für Zwischenüberschriften oder Zitate.
- [ ] **Manifest (`src/pages/manifest.astro`)**
    - Stark text-fokussiert.
- [ ] **Speaking (`src/pages/speaking.astro`)**
- [ ] **Blog (`src/pages/blog/...`)**

## Phase 5: Content & Cleanup

- [ ] **Keystatic Integration**
- [ ] **Cleanup**

## Nächste Schritte
Bitte reviewe diesen aktualisierten Plan. Sobald freigegeben, starte ich mit **Phase 1**.
