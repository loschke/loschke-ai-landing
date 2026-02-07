# Blog-Authoring Guide – loschke.ai

> Anleitung für Claude Desktop zum Erstellen fertiger `.mdoc` Blog-Beiträge für loschke.ai.
> Die Dateien werden direkt in `src/content/posts/` abgelegt und sind sofort im CMS und auf der Website nutzbar.

---

## 1. Dateiformat und Ablageort

| Eigenschaft | Wert |
|-------------|------|
| **Format** | Markdoc (`.mdoc`) |
| **Ablageort** | `src/content/posts/` |
| **Dateiname** | Slug des Titels, kebab-case, ohne Umlaute, z.B. `ki-governance.mdoc` |
| **Encoding** | UTF-8 |

**Dateinamen-Regeln:**
- Kleinbuchstaben, Wörter mit Bindestrich getrennt
- Umlaute ersetzen: ä→ae, ö→oe, ü→ue, ß→ss
- Keine Sonderzeichen, keine Leerzeichen
- Kurz und sprechend (3-5 Wörter ideal)

**Beispiele:**
- `ki-governance.mdoc`
- `follow-schlaegt-search.mdoc`
- `vibe-coding.mdoc`
- `keine-prompt-sammlungen.mdoc`

---

## 2. Frontmatter-Schema (komplett)

Jede `.mdoc`-Datei beginnt mit einem YAML-Frontmatter-Block zwischen `---` Markern.

```yaml
---
title: "Titel des Beitrags"
excerpt: Kurzbeschreibung für Blog-Übersicht und Detailseite unter dem Titel. 1-2 Sätze, kein Markdown.
summary: >-
  TL;DR für AI Overviews (GEO). Markdown erlaubt:
  **fett**, *kursiv*, [Links](url), Listen mit -

  - **Punkt 1** — Erklärung
  - **Punkt 2** — Erklärung

  Abschließender Satz mit Einordnung.
metaTitle: Optionaler SEO-Titel (überschreibt title für <title> Tag)
metaDescription: Optionale SEO-Description (überschreibt excerpt für <meta>). Multiline möglich.
pubDate: 2026-02-06
category: takes
featured: false
heroImage: 
tags:
  - Tag1
  - Tag2
  - Tag3
readTime: 6 min
audioSrc: /audio/dateiname.mp3
draft: false
---
```

---

## 3. Frontmatter-Felder im Detail

### Pflichtfelder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `title` | String | Titel des Beitrags. Darf Sonderzeichen enthalten. Bei Doppelpunkten oder Sonderzeichen in Anführungszeichen setzen: `"Titel: Untertitel"` |
| `pubDate` | Datum | Format `YYYY-MM-DD`. Bestimmt die Sortierung in der Blog-Übersicht. |
| `category` | Enum | Eine der fünf Kategorien (siehe unten). Default: `takes` |
| `draft` | Boolean | `true` = nicht veröffentlicht, `false` = live. Default: `false` |

### Empfohlene Felder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `excerpt` | String (multiline) | Anlesetext für Blog-Übersicht und Detailseite. 1-2 Sätze, kein Markdown. Klar und neugierig machend. |
| `tags` | Array of Strings | Themen-Tags für Filterung. 2-5 Tags pro Beitrag. Deutschsprachig, Title-Case. |
| `readTime` | String | Geschätzte Lesezeit, Format: `"X min"` (z.B. `"6 min"`). Faustregel: ~200 Wörter pro Minute. |

### Optionale Felder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `summary` | String (multiline) | TL;DR-Box auf der Artikelseite. Für AI Overviews optimiert (GEO). Markdown-Formatierung erlaubt. |
| `metaTitle` | String | Überschreibt `title` für `<title>` und Social Sharing. Nur setzen wenn SEO-Titel abweichen soll. |
| `metaDescription` | String (multiline) | Überschreibt `excerpt` für `<meta>` und Social Sharing. Nur setzen wenn SEO-Description abweichen soll. |
| `featured` | Boolean | `true` = wird prominent in der Übersicht angezeigt. Nur für 1-2 Artikel gleichzeitig verwenden. |
| `heroImage` | Image Path | Pfad zum Hero-Bild. Aktuell nicht aktiv genutzt, kann leer bleiben. |
| `audioSrc` | String | Pfad zur Audio-Zusammenfassung in `/public/audio/`. Format: `/audio/dateiname.mp3` |

---

## 4. Kategorien

Es gibt fünf Kategorien. Jeder Beitrag gehört zu genau einer.

| Value | Label | Icon | Wann verwenden |
|-------|-------|------|----------------|
| `vision` | Visionen | ◎ | Zukunftsszenarien, Trends, wohin geht die Reise |
| `takes` | Takes | ◆ | Meinungen, Einordnungen, Kommentare zu aktuellen Themen |
| `experiments` | Experimente | ▲ | Selbstversuche, Tool-Tests, Praxisberichte, Vergleiche |
| `building` | Building | ◻ | Building in Public, eigene Projekte, Tech-Entscheidungen |
| `personal` | Persönlich | ● | Persönliche Reflexionen, Werte, Entscheidungen |

**Entscheidungshilfe:**
- "Ich glaube, dass..." → `vision`
- "Das ist falsch/richtig, weil..." → `takes`
- "Ich habe X ausprobiert..." → `experiments`
- "So habe ich Y gebaut..." → `building`
- "Warum ich Z (nicht) mache..." → `personal`

---

## 5. Summary-Feld (GEO-optimiert)

Das `summary`-Feld ist die Kurzfassung für die TL;DR-Box auf der Artikelseite. Es ist besonders wichtig für AI Overviews (Generative Engine Optimization).

### Format

YAML Multiline mit `>-` (folded block, no trailing newline). Markdown-Formatierung innerhalb:

```yaml
summary: >-
  Einleitender Satz mit **Kernaussage** des Artikels.

  - **Punkt 1** — kurze Erklärung
  - **Punkt 2** — kurze Erklärung
  - **Punkt 3** — kurze Erklärung

  Abschließende Einordnung oder [Link zu Ressource](url).
```

### Regeln

- 3-6 Sätze oder eine Mischung aus Fließtext und Liste
- Wichtigste Aussage zuerst
- Markdown erlaubt: `**fett**`, `*kursiv*`, `[Links](url)`, Listen mit `- `
- Keine Headlines (`##`), keine Codeblöcke
- Eigenständig verständlich ohne den Artikel gelesen zu haben
- Nicht jeder Artikel braucht ein Summary. Weglassen wenn der Artikel kurz oder persönlich ist.

---

## 6. Content-Bereich (nach dem Frontmatter)

Nach dem schließenden `---` folgt der Artikelinhalt in Markdoc-Syntax (kompatibel mit Standard-Markdown).

### Erlaubte Formatierung

```markdown
## Zwischenüberschrift (H2)

### Unter-Überschrift (H3)

Fließtext mit **fett**, *kursiv* und [Links](https://example.com).

> Blockquote für Kernaussagen oder Zitate

- Aufzählung Punkt 1
- Aufzählung Punkt 2

1. Nummerierte Liste
2. Zweiter Punkt

| Spalte 1 | Spalte 2 |
|----------|----------|
| Wert A   | Wert B   |

`Inline-Code` oder:

​```
Code-Block
​```
```

### Nicht verwenden

- H1 (`#`) — der Titel kommt aus dem Frontmatter
- HTML-Tags
- Bilder (aktuell nicht im Content-Bereich vorgesehen)

---

## 7. Stimme und Schreibstil

### Die Grundhaltung

loschke.ai ist Ricos persönliche Plattform. Die Perspektive ist immer "Ich" — Meinung, Erfahrung, Beobachtung. Nicht belehrend, nicht akademisch.

**Die Balance:**
- Optimistisch über KI-Möglichkeiten
- Realistisch über KI-Grenzen
- Kritisch gegenüber Hype
- Konstruktiv in Lösungen

**Ansprache:** Immer "Du", auf Augenhöhe.

### Blog ≠ LinkedIn

Blog-Artikel sind Fach- oder Meinungscontent mit Substanz, Struktur und Tiefe. Sie sind keine verlängerten LinkedIn-Posts.

| Dimension | LinkedIn | Blog |
|-----------|----------|------|
| Länge | 150-250 Wörter | 800-2000 Wörter |
| Absätze | 1-2 Sätze (Stakkato) | 3-6 Sätze (ausgeführte Gedanken) |
| Ziel | Einen Punkt machen | Argument entwickeln, Verständnis schaffen |
| Zwischenüberschriften | Emotional, punchig | Inhaltlich, orientierend |
| Nuancen | Wenig Raum | Raum für Einwände und Komplexität |

### Artikel-Struktur

1. **Einstieg (10-15%)** — Konkrete Szene, Beobachtung oder überraschende Aussage. Storytelling erlaubt.
2. **Problemdarstellung (15-20%)** — Ausgangslage, Relevanz, Daten und Beispiele.
3. **Hauptteil (50-60%)** — Strukturiert durch inhaltliche Zwischenüberschriften. Behauptung → Begründung → Beispiel. Einwände adressieren.
4. **Einordnung (10-15%)** — Was bedeutet das? Wo sind Grenzen? Reflexion.
5. **Schluss (5-10%)** — Kernaussage, offene Frage oder konkreter nächster Schritt.

### Absätze

Ein Absatz = ein Gedanke, aber der Gedanke wird ausgeführt, nicht nur angetippt.

❌ **Nicht so (LinkedIn-Stakkato):**
```
Das ist kein Führen. Das ist Hoffen.

Bei jeder anderen strategischen Kompetenz wäre das undenkbar.
```

✅ **So (Blog-Stil):**
```
Das ist kein Führen. Das ist Hoffen. Bei jeder anderen strategischen 
Kompetenz wäre das undenkbar. Kein Geschäftsführer würde sagen: 
"Finanzen? Da kenn ich mich nicht aus, das macht mein Controller."
Bei KI ist genau das der Standard.
```

### Zwischenüberschriften

Inhaltlich und orientierend, nicht emotional und punchig.

- ❌ "Der Denkfehler" / "Das Muster" / "Die Neudefinition"
- ✅ "Warum Delegation bei KI nicht funktioniert" / "Was AI nicht aggregieren kann"

### Tiefe statt Behauptung

Behauptungen brauchen mindestens einen Folgesatz, der sie begründet, erklärt oder belegt.

❌ `Wer KI delegiert, delegiert Urteilsvermögen.`

✅ `Wer KI komplett delegiert, delegiert nicht Arbeit. Er delegiert die Fähigkeit, Ergebnisse zu bewerten. Er delegiert Urteilsvermögen. Und Urteilsvermögen ist das, wofür Führungskräfte bezahlt werden.`

---

## 8. Verbotene Wörter und Muster

### Nie verwenden

**Hype-Sprache:** revolutionär, disruptiv, game-changer, cutting-edge, next-level, ultimativ

**Berater-Bullshit:** Synergien, holistisch, best-in-class, strategic alignment, change journey, Transformationspartner

**Weichmacher:** eventuell, vielleicht, man könnte, gewissermaßen

**KI-typische Verben:** delve, eintauchen, embark, leverage, harness, unlock, freischalten, foster

**KI-typische Adjektive:** groundbreaking, bahnbrechend, robust (außer technisch), pivotal, seamless, nahtlos, comprehensive, umfassend

**KI-typische Übergänge:** furthermore, darüber hinaus, moreover, notably, consequently, folglich, subsequently, indeed (als Verstärker), "es ist erwähnenswert"

### Nie so anfangen

- ❌ "In einer Welt, in der..."
- ❌ "Stell dir vor..."
- ❌ "In an era of..."

Stattdessen: Direkt zum Punkt. Konkrete Beobachtung oder Situation.

### Nie so aufhören

- ❌ "Zusammenfassend lässt sich sagen..."
- ❌ "In conclusion..."

Stattdessen: Offene Frage, konkreter nächster Schritt, oder einfach aufhören wenn fertig.

### Strukturelle Tells vermeiden

- Keine langen Bindestriche (—) für dramatische Pausen. Punkt. Neuer Satz.
- Keine gleichförmigen Satzlängen. Rhythmus variieren.
- Keine Triplet-Aufzählungen ("X, Y und Z"). Zwei Dinge nennen. Oder vier.
- Keine übermäßig formellen Übergänge zwischen Absätzen.

---

## 9. Vokabular-Referenz

| ❌ Vermeiden | ✅ Bevorzugen |
|--------------|---------------|
| Schulung / Seminar | Workshop / Programm |
| Implementierung | Umsetzung |
| Stakeholder | Beteiligte / Entscheider |
| Use Case | Anwendungsfall / Beispiel |
| Skill Set | Fähigkeiten |
| Mindset | Haltung / Denkweise |
| Pain Point | Problem |
| Low-hanging Fruits | Schnelle Erfolge |
| Magie / Wunderwaffe | Werkzeug / Co-Pilot |

---

## 10. Vollständige Beispiel-Datei

Dateiname: `ki-governance.mdoc`

```markdown
---
title: KI-Governance, die wirklich funktioniert
excerpt: Duale Strategie statt Einheitsbrei. Warum Unternehmen einen dualen Ansatz für ihre KI-Richtlinien brauchen — und wie die Trennung konkret aussieht.
summary: >-
  Klassische KI-Richtlinien scheitern, weil sie **Compliance und Praxishilfe** in ein Dokument packen.

  - **Compliance-Richtlinie** — kurz, rechtssicher, von der Geschäftsleitung verabschiedet
  - **Anwenderhandbuch** — praxisnah, mit Beispielen, kontinuierlich aktualisiert

  Diese Trennung ermöglicht agile Weiterentwicklung ohne ständige Compliance-Reviews.
pubDate: 2026-01-15
category: takes
featured: true
tags:
  - KI-Governance
  - Compliance
  - Change Management
readTime: 6 min
audioSrc: /audio/ki-governance.mp3
draft: false
---

Die Einführung von KI-Tools in Unternehmen ist längst kein Zukunftsszenario mehr, sondern gelebte Realität.

## Das Problem bisheriger KI-Richtlinien

Vielleicht kennen Sie das Dilemma: Zu strenge Richtlinien werden umgangen, zu vage bieten keine Orientierung. Die meisten Unternehmen versuchen beides in einem einzigen Dokument zu lösen. Das funktioniert nicht.

Das Grundproblem: Ein einzelnes Dokument soll gleichzeitig rechtliche Absicherung bieten und den Mitarbeitenden im Alltag helfen. Diese beiden Ziele widersprechen sich fundamental. Compliance-Texte müssen stabil sein, Praxishilfen müssen sich ständig weiterentwickeln.

## Die duale Lösung

Der bessere Ansatz ist eine bewusste Trennung in zwei Säulen.

**Säule 1: Compliance-Richtlinie.** Kurz, klar, von der Geschäftsleitung verabschiedet. Definiert Grenzen und Verantwortlichkeiten. Wird selten aktualisiert, nur bei regulatorischen Änderungen.

**Säule 2: Anwenderhandbuch.** Praxisnah, mit konkreten Beispielen und Workflows. Wird regelmäßig aktualisiert, lebt mit den Tools und Erfahrungen der Teams.

> **Der entscheidende Vorteil:** Das Anwenderhandbuch kann sich alle zwei Wochen ändern, ohne dass Legal jedes Mal drüberschauen muss.

## Warum das in der Praxis funktioniert

Teams bekommen klare Leitplanken UND praktische Hilfe. Die Compliance-Abteilung hat ein stabiles Dokument. Die Fachabteilungen haben ein lebendiges Werkzeug.

Drei Unternehmen, mit denen ich das umgesetzt habe, berichten alle dasselbe: Die tatsächliche Nutzung von KI-Tools hat sich verdoppelt, gleichzeitig sind die Compliance-Verstöße zurückgegangen.

## Was das für dein Unternehmen bedeutet

Wenn du gerade an KI-Richtlinien arbeitest: Frag dich nicht "Was muss alles rein?" Frag dich: "Für wen schreibe ich das?" Wenn die Antwort "für Legal und für die Mitarbeitenden" lautet, brauchst du zwei Dokumente.
```

---

## 11. Minimale Beispiel-Datei

Nicht jeder Beitrag braucht alle Felder. Das hier ist das Minimum:

Dateiname: `warum-keine-prompt-sammlungen.mdoc`

```markdown
---
title: Warum ich keine Prompt-Sammlungen verkaufe
excerpt: Prinzipien vor Tricks. Und warum das kein Marketing-Slogan ist, sondern eine bewusste Entscheidung.
pubDate: 2025-11-05
category: personal
tags:
  - Prinzipien
  - Prompting
readTime: 4 min
draft: false
---

Es wäre einfach. 99 Prompts für ChatGPT, schön verpackt als PDF, für 29 Euro. Aber ich mache es nicht.

## Der schnelle Weg vs. der richtige Weg

Prompt-Sammlungen verkaufen sich gut, weil sie ein Versprechen machen: Copy-Paste und fertig. Das Problem ist, dass dieses Versprechen nicht hält. Die Tools ändern sich schneller als jede Sammlung aktualisiert werden kann.

Was bleibt, sind Prinzipien. Wer versteht, wie Sprachmodelle denken, braucht keine vorgefertigten Prompts.
```

---

## 12. Checkliste vor Fertigstellung

| Check | Frage |
|-------|-------|
| **Dateiname** | Kebab-case, keine Umlaute, `.mdoc` Endung? |
| **Frontmatter** | Alle Pflichtfelder vorhanden? YAML valide? |
| **Title** | Klar, sprechend, kein Clickbait? |
| **Excerpt** | 1-2 Sätze, eigenständig verständlich? |
| **Category** | Richtige Kategorie gewählt? |
| **Tags** | 2-5 relevante Tags, deutschsprachig? |
| **ReadTime** | Geschätzt basierend auf Wortanzahl? |
| **Content** | Nur H2/H3, kein H1? Kein HTML? |
| **Stimme** | Klingt wie Rico, nicht wie ein KI-Text? |
| **Bullshit-Check** | Keine verbotenen Wörter/Muster? |
| **Tiefe** | Behauptungen begründet, nicht nur aufgestellt? |
| **Struktur** | Blog-Stil (ausgeführte Absätze), nicht LinkedIn-Stakkato? |

---

## 13. Schnellreferenz: Frontmatter-Template zum Kopieren

```yaml
---
title: 
excerpt: 
summary: >-
  
pubDate: 
category: takes
featured: false
tags:
  - 
readTime: 
audioSrc: 
draft: true
---
```

---

*Erstellt: Februar 2026*
*Für: Claude Desktop — Blog-Content-Produktion loschke.ai*
