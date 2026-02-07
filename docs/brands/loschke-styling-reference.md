# loschke.ai – Styling Reference (Light Mode)

> Referenz-Dokument für Claude Code – Minimalistisches, editorial Design mit übergroßer Typografie

---

## Brand Identity

**Logo:** "RL." – "RL" in Noto Sans Black (schwarz), "." in Primary Color (#FC2D01)
**Charakter:** Minimalistisch, übergroße Typografie, editorial, extravagant
**Modus:** Light Mode

---

## Farbpalette

### CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f4;
  
  /* Accent */
  --accent: #FC2D01;
  --accent-hover: #e02800;
  
  /* Text */
  --text-primary: #151416;
  --text-secondary: #525252;
  --text-muted: #a3a3a3;
  
  /* Borders */
  --border-subtle: #e5e5e5;
  --border-strong: #d4d4d4;
}
```

### Tailwind Config Extension

```js
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        'loschke': {
          'accent': '#FC2D01',
          'accent-hover': '#e02800',
          'dark': '#151416',
        }
      }
    }
  }
}
```

---

## Typografie

### Font Stack

- **Headlines:** Noto Sans, Weight 900 (Black)
- **Body:** Noto Sans, Weight 300-400

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;900&display=swap" rel="stylesheet">
```

### Tailwind Font Config

```js
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Noto Sans"', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

---

## Typografische Skala

### Übergroße Headlines (Signature Style)

| Klasse | Tailwind | Verwendung |
|--------|----------|------------|
| Hero | `text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none` | Startseite Hero |
| Display | `text-4xl md:text-5xl lg:text-6xl font-black tracking-tight` | Seiten-Headlines |
| H1 | `text-3xl md:text-4xl lg:text-5xl font-black` | Artikel-Titel |
| H2 | `text-2xl md:text-3xl font-black` | Abschnitte |
| H3 | `text-xl md:text-2xl font-black` | Unter-Abschnitte |

### Body Text

| Klasse | Tailwind | Verwendung |
|--------|----------|------------|
| Body | `text-lg font-light leading-relaxed` | Fließtext |
| Body Small | `text-base font-normal` | Sekundärer Text |
| Caption | `text-sm font-medium text-neutral-500` | Labels, Meta |

---

## Design-Prinzipien

1. **Whitespace ist King** – Großzügige Abstände, Inhalte atmen lassen
2. **Asymmetrische Layouts** – Keine zentrischen Standard-Grids
3. **Typografie als Gestaltungselement** – Headlines dürfen dominieren
4. **Minimal Decoration** – Keine Schatten, keine Gradienten, keine Ornamente
5. **Akzent sparsam** – Orange nur für wichtige Interaktionen und Logo-Punkt

---

## Layout-Richtlinien

### Container

```html
<!-- Schmal – für Lesbarkeit -->
<div class="max-w-2xl mx-auto px-6">

<!-- Content – Standard -->
<div class="max-w-4xl mx-auto px-6">

<!-- Weit – für Hero/Feature Sections -->
<div class="max-w-6xl mx-auto px-6">
```

### Section Spacing

```html
<!-- Standard Section -->
<section class="py-24">

<!-- Hero Section -->
<section class="min-h-[80vh] flex items-center py-16">
```

### Grid-Empfehlung

- Asymmetrisches 2-Column (60/40 oder 70/30)
- Keine symmetrischen 3-Column Grids
- Viel Leerraum links oder rechts
- Content linksbündig, nicht zentriert

---

## Komponenten-Patterns

### Logo

```html
<a href="/" class="text-xl font-black tracking-tight">
  RL<span class="text-loschke-accent">.</span>
</a>
```

### Navigation

```html
<nav class="flex justify-between items-center py-6 px-6">
  <a href="/" class="text-xl font-black tracking-tight">
    RL<span class="text-loschke-accent">.</span>
  </a>
  <div class="flex gap-8 text-sm font-medium">
    <a href="/about" class="hover:text-loschke-accent transition-colors">About</a>
    <a href="/blog" class="hover:text-loschke-accent transition-colors">Blog</a>
    <a href="/speaking" class="hover:text-loschke-accent transition-colors">Speaking</a>
  </div>
</nav>
```

### Text Links

```html
<a href="#" class="text-loschke-accent hover:underline underline-offset-4 transition-colors">
  Link Text
</a>
```

### Primary Button (sparsam verwenden)

```html
<a href="#" class="inline-block bg-loschke-dark text-white px-6 py-3 text-sm font-medium hover:bg-loschke-accent transition-colors">
  Call to Action
</a>
```

### Horizontale Trenner

```html
<hr class="border-t border-neutral-200 my-16" />
```

### Footer

```html
<footer class="py-16 border-t border-neutral-200">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex justify-between items-center">
      <span class="text-sm text-neutral-500">© 2026 Rico Loschke</span>
      <div class="flex gap-6 text-sm text-neutral-500">
        <a href="/impressum" class="hover:text-loschke-accent">Impressum</a>
        <a href="/datenschutz" class="hover:text-loschke-accent">Datenschutz</a>
      </div>
    </div>
  </div>
</footer>
```

---

## Akzent-Verwendung

Orange (#FC2D01) **nur** für:
- Logo-Punkt
- Hover-States auf Links
- Aktive Navigation
- Wichtige CTAs (max. 1 pro Seite)
- Punkt am Ende von Headlines (optional, signature style)

**Nicht** für:
- Hintergründe
- Badges oder Tags
- Dekorative Elemente
- Icons

---

## Beispiel-Komponenten

### Hero Section

```html
<section class="min-h-[80vh] flex items-center">
  <div class="max-w-6xl mx-auto px-6">
    <div class="max-w-4xl">
      <p class="text-sm font-medium text-neutral-500 mb-4">
        AI Transformation Consultant
      </p>
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-8">
        Ich helfe Menschen,<br/>
        mit KI besser<br/>
        zu arbeiten<span class="text-loschke-accent">.</span>
      </h1>
      <p class="text-lg font-light text-neutral-600 max-w-xl leading-relaxed">
        Thought Leadership, Experimente, Building in Public. 
        Keine Marketing-Sprache, kein Bullshit.
      </p>
    </div>
  </div>
</section>
```

### Blog Post Card

```html
<article class="group">
  <a href="/blog/post-slug" class="block">
    <time class="text-sm text-neutral-500">15. Januar 2026</time>
    <h2 class="text-2xl md:text-3xl font-black mt-2 mb-3 group-hover:text-loschke-accent transition-colors">
      Artikel Headline hier
    </h2>
    <p class="text-neutral-600 font-light leading-relaxed">
      Kurze Beschreibung des Artikels, maximal zwei bis drei Zeilen...
    </p>
  </a>
</article>
```

### Blog Post Liste

```html
<section class="py-24">
  <div class="max-w-4xl mx-auto px-6">
    <h2 class="text-3xl md:text-4xl font-black mb-16">Aktuelle Artikel</h2>
    <div class="space-y-12">
      <!-- Blog Post Cards hier -->
    </div>
  </div>
</section>
```

### Artikel-Layout (Prose)

```html
<article class="py-24">
  <div class="max-w-4xl mx-auto px-6">
    <!-- Header -->
    <header class="mb-16">
      <time class="text-sm text-neutral-500">15. Januar 2026</time>
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6">
        Artikel Headline
      </h1>
      <p class="text-xl font-light text-neutral-600">
        Lead-Paragraph oder Zusammenfassung des Artikels.
      </p>
    </header>
    
    <!-- Content -->
    <div class="prose prose-lg prose-neutral max-w-none
                prose-headings:font-black 
                prose-a:text-loschke-accent prose-a:no-underline hover:prose-a:underline
                prose-p:font-light prose-p:leading-relaxed">
      <!-- Markdoc/MDX Content hier -->
    </div>
  </div>
</article>
```

---

## Don'ts

- ❌ Keine Schatten (`box-shadow`)
- ❌ Keine abgerundeten Ecken auf Containern (`rounded-lg` etc.)
- ❌ Keine Gradienten
- ❌ Keine Icons als Dekoration
- ❌ Keine Card-Grids mit vielen kleinen Boxen
- ❌ Keine zentrierten Hero-Sections
- ❌ Kein Orange als Hintergrundfarbe
- ❌ Keine Bilder mit Overlay-Text
- ❌ Keine Badges oder Tags mit farbigem Hintergrund

---

## Zusammenfassung

| Aspekt | Regel |
|--------|-------|
| **Mode** | Light |
| **Accent** | #FC2D01 (Orange) |
| **Font** | Noto Sans (300, 400, 900) |
| **Headlines** | Übergroß, Black (900), tracking-tight |
| **Body** | Light (300), relaxed leading |
| **Layout** | Asymmetrisch, viel Whitespace |
| **Decoration** | Keine |

---

*Erstellt für Claude Code – loschke.ai Website Build*
