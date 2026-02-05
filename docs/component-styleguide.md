# Component Styleguide – loschke.ai

> Einheitliche Typografie und Layout-Standards für alle Homepage-Module

---

## Typografie-Standards

### Labels (Sidebar)

Für sticky Labels in der linken Spalte:

```
text-xs sm:text-sm font-medium text-[#737373] tracking-[0.08em] uppercase
```

**Verwendung:** Abschnittskennzeichnung wie "Wer ich bin", "Themen", "Ökosystem"

---

### Serif Lead Text (Instrument Serif)

Für große, einleitende Texte:

```
text-xl sm:text-2xl md:text-[clamp(22px,2.8vw,34px)] font-serif leading-[1.45]
```

**Verwendung:** About-Intro, Manifest-Appetizer, Ecosystem-Intro

---

### Sans Body Text (Noto Sans)

Für Fließtext und Beschreibungen:

```
text-base sm:text-lg font-light leading-[1.75] text-[#525252]
```

**Verwendung:** Alle Beschreibungstexte, Sublines, Card-Descriptions

---

### Headlines (font-black)

Für große Section-Überschriften:

```
text-3xl sm:text-4xl md:text-[clamp(34px,4.5vw,60px)] font-black leading-[0.95] tracking-[-0.025em]
```

**Verwendung:** "Worüber ich nachdenke.", "Was mich gerade bewegt.", "7 Grundsätze."

---

### Card Titles

Für kleinere Überschriften in Cards:

```
text-base sm:text-lg font-black tracking-[-0.01em]
```

**Verwendung:** ArticleCard Titel, Topic Pillar Labels

---

### Links

Für Textlinks:

```
text-sm sm:text-base font-medium text-accent
```

Mit Hover-Underline:
```
border-b border-transparent hover:border-accent transition-colors duration-250
```

---

## Layout-Standards

### Two-Column Section Grid

Standard-Layout für alle Sektionen:

```
grid grid-cols-1 md:grid-cols-[minmax(100px,240px)_1fr] gap-6 md:gap-12 lg:gap-15 items-start
```

### Section Padding

```
py-16 md:py-24 lg:py-[100px] px-6 sm:px-10 md:px-16 lg:px-20
```

### Content max-width

```
max-w-full md:max-w-[560px]   // Standard
max-w-full md:max-w-[680px]   // Breiterer Content (About)
```

---

## Farben

| Variable | Wert | Verwendung |
|----------|------|------------|
| `text-accent` | #FC2D01 | Links, Highlights, Dot |
| `text-[#737373]` | #737373 | Labels, Sublines |
| `text-[#525252]` | #525252 | Body Text |
| `bg-[#fafafa]` | #fafafa | Alternierende Sections |
| `border-[#e5e5e5]` | #e5e5e5 | Trenner, Borders |

---

## Brand-Farben (Ökosystem)

| Brand | Farbe | CSS |
|-------|-------|-----|
| loschke.ai | Orange | `text-accent` / `#FC2D01` |
| unlearn.how | Purple | `text-[#a855f7]` |
| lernen.diy | Teal | `text-[#0F766E]` |

---

## Schriftmarken

### RL. (loschke.ai)
```html
<span class="text-xl sm:text-2xl font-black tracking-[-0.02em]">
  RL<span class="text-accent">.</span>
</span>
```

### unlearn.how
```html
<span class="text-xl sm:text-2xl tracking-[-0.01em]">
  <span class="font-serif italic">unlearn</span>
  <span class="font-serif text-[#a855f7]">.how</span>
</span>
```

### lernen.diy
```html
<span class="text-xl sm:text-2xl tracking-[-0.01em]">
  <span class="font-serif">lernen</span>
  <span class="font-serif italic text-[#0F766E]">.diy</span>
</span>
```

---

## Reveal Animation

Alle sichtbaren Elemente nutzen die `<Reveal>` Komponente:

```astro
<Reveal client:load delay={0.08}>
  <!-- Content -->
</Reveal>
```

Delay-Staffelung: `0`, `0.08`, `0.12`, `0.16` etc.

---

## Ausnahme: Hero

Das Hero-Modul darf von diesen Standards abweichen für maximale visuelle Wirkung:
- Größere Headline
- Andere leading-Werte
- Keine Two-Column Struktur

---

*Stand: Februar 2026*
