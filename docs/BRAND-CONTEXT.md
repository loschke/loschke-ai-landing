# Brand Context – sevenX Ecosystem

> Reference for AI coding agents. Use this to assign content/features to the correct brand.

---

## Quick Decision Tree

```
Is it about Rico's PERSONAL perspective, opinion, or thought leadership?
  → loschke.ai

Is it about helping ORGANIZATIONS transform (workshops, consulting, strategy)?
  → unlearn.how

Is it about teaching HOW TO DO something (tutorials, labs, tools)?
  → lernen.diy
```

**The split is MODAL, not thematic.** The same topic can live on different brands:
- "Why AI changes leadership" (opinion) → loschke.ai
- "Leadership in the AI era" (workshop for execs) → unlearn.how  
- "5 prompts every leader should know" (tutorial) → lernen.diy

---

## Brand Profiles

### loschke.ai – Personal Brand (Primary)

| Attribute | Value |
|-----------|-------|
| **Function** | Trust anchor, content hub, thought leadership |
| **Content** | Blog (opinion/analysis), podcast, speaker info |
| **Perspective** | "Ich sehe das so..." / "I see a pattern..." |
| **Audience** | Followers, peers, industry observers |
| **Accent Color** | `#FC2D01` (Orange) |
| **Background** | `#151416` (Dark) |
| **Alt Background** | `#1E1E20` |
| **Text Primary** | `#ffffff` |
| **Text Muted** | `#CFCAB4` |
| **Headlines** | Noto Sans Black (900) |
| **Body** | Noto Sans (300-400) |
| **Logo** | "RL." – "RL" white, "." orange |

---

### unlearn.how – B2B Consulting (High-Touch)

| Attribute | Value |
|-----------|-------|
| **Function** | Consulting, workshops, strategic sparring |
| **Content** | Case studies, methodology, service pages |
| **Perspective** | "Was bedeutet das für deine Organisation..." |
| **Audience** | C-Level, HR leads, transformation managers |
| **Metaphor** | Architecture firm (design, not execution) |
| **Key Narratives** | Chefsache, Weckrufe, 4 Powers |
| **Accent Color** | `#a855f7` (Purple) |
| **Background** | `#0f0a15` (Dark Purple-tinted) |
| **Alt Background** | `#1a1225` |
| **Text Primary** | `#ffffff` |
| **Text Muted** | `#a090b5` |
| **Headlines** | Noto Sans Black (900) |
| **Labels/Sublines** | Instrument Serif (400) |
| **Body** | Noto Sans (400) |
| **Accent Style** | Italic + Purple |
| **Logo** | "*unlearn*.how" – "unlearn" italic, ".how" purple |

---

### lernen.diy – Self-Service Learning (Low-Touch)

| Attribute | Value |
|-----------|-------|
| **Function** | Guides, labs, exercises, tools |
| **Content** | Tutorials, how-tos, interactive demos |
| **Perspective** | "So machst du es..." / "Du kannst das" |
| **Audience** | Practitioners, self-motivated learners |
| **Metaphor** | Workshop (hands-on, maker culture) |
| **Core Narrative** | DIY – own your relevance |
| **Accent Color** | `#0F766E` (Teal 700) |
| **CTA Color** | `#14B8A6` (Teal 500) |
| **Background** | `#0f1514` (Dark Teal-tinted) |
| **Alt Background** | `#1a2220` |
| **Text Primary** | `#ffffff` |
| **Text Muted** | `#9fbab6` |
| **Headlines** | Noto Sans Black (900) |
| **Labels/Sublines** | Instrument Serif (400) |
| **Body** | Noto Sans (400) |
| **Mono** | Space Mono |
| **Accent Style** | Italic + Teal |
| **Logo** | "lernen*.diy*" – "lernen" regular, ".diy" italic teal |

---

### sevenX – Legal Entity (Background only)

| Attribute | Value |
|-----------|-------|
| **Function** | Invoicing, legal, email domain |
| **Visibility** | Minimal – not a public brand |
| **Colors** | Black/White neutral |
| **Website** | Simple redirect to the three brands |

---

## Voice Guidelines (All Brands)

### The 5 Laws

1. **No Bullshit** – Direct, honest, but constructive
2. **Plain Language** – Simple words over jargon
3. **Personal Experience** – "I learned..." not "Studies show..."
4. **Contrasts over Superlatives** – "From X to Y" not "The best"
5. **One Point per Paragraph** – Clear, focused statements

### Forbidden Words

**Hype:** revolutionary, disruptive, game-changer, cutting-edge, next-level  
**Consultant BS:** synergies, holistic, best-in-class, strategic alignment, change journey  
**Softeners:** eventuell, vielleicht, man könnte, gewissermaßen  
**AI Tells:** delve, embark, leverage, harness, unlock, foster, groundbreaking, pivotal, seamless, comprehensive

### Avoid These Patterns

- Em dashes (—) for dramatic pauses → Use periods
- Triplet lists ("X, Y, and Z") → Use two or four items
- "In a world where..." openers
- "In conclusion..." closers
- Uniform sentence lengths → Vary rhythm

### Balance (Always)

- Optimistic about AI possibilities
- Realistic about AI limitations
- Critical of hype
- Constructive in solutions

---

## Content Distribution Matrix

| Content Type | Brand |
|--------------|-------|
| Opinion, industry commentary | loschke.ai |
| Tutorials, how-tos, guides | lernen.diy |
| Case studies, methodology | unlearn.how |
| Tools, demos, labs | lernen.diy |
| Podcast | loschke.ai |
| Workshop/service pages | unlearn.how |

---

## The Funnel

```
loschke.ai (Trust Layer)
    │
    ├──► unlearn.how (B2B, consulting)
    │         │
    │         └──► lernen.diy (premium content for clients)
    │
    └──► lernen.diy (B2C, self-service, free content)
```

---

## Format Specs

| Format | Size |
|--------|------|
| LinkedIn Carousel | 1080 × 1350px (4:5) |
| LinkedIn Post Image | 1200 × 628px |
| Presentation Slides | 1920 × 1080px (16:9) |

---

## CSS Variables Template

```css
/* loschke.ai */
:root {
  --bg-dark: #151416;
  --bg-dark-alt: #1E1E20;
  --accent: #FC2D01;
  --text-primary: #ffffff;
  --text-muted: #CFCAB4;
}

/* unlearn.how */
:root {
  --bg-dark: #0f0a15;
  --bg-dark-alt: #1a1225;
  --accent: #a855f7;
  --text-primary: #ffffff;
  --text-muted: #a090b5;
}

/* lernen.diy */
:root {
  --bg-dark: #0f1514;
  --bg-dark-alt: #1a2220;
  --accent: #0F766E;
  --accent-cta: #14B8A6;
  --text-primary: #ffffff;
  --text-muted: #9fbab6;
}
```

---

*Last updated: 2026-02*
