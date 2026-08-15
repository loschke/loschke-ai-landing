# CLAUDE.md — loschke-ai

> **Diese Datei deckt bisher nur die Assets ab.** Sie ist am 15.08.2026
> entstanden, damit Sessions in diesem Repo wissen, dass Bilder und Audio
> woanders gebaut werden. Konventionen zu Komponenten, Content und Deployment
> stehen noch nicht drin — wer sie ergänzt, ergänzt sie hier.

Astro mit Markdoc, Keystatic und Vercel-Adapter. Die Hub-`CLAUDE.md` eine Ebene
höher gilt mit: Voice, Blog-Ablauf, Vault-Arbeitsteilung, Naming.

## Assets baut die media-factory

Bilder, Audio, Publikationen und Druckvorlagen entstehen **nicht hier**, sondern
in `../media-factory` (eigenes Repo, eigene CLAUDE.md). Der Output wird in
dieses Repo geschrieben. Wer hier ein Asset braucht, ruft von dort auf, statt
einen zweiten Weg zu bauen.

| Was | Befehl (aus `media-factory/`) | Landet in |
|---|---|---|
| OG-Bild | `node og/gen-og.mjs --out ../loschke-ai/public/images/og/og-<slug>.png --title "..." --brand loschke` | `public/images/og/` |
| Blog-Audio | `node audio/gen-audio.mjs <skript.txt> ../loschke-ai/public/audio/<slug>.mp3` | `public/audio/` |
| Infografik | `node infographics/gen-infographic.mjs <quelle.html> --out <ziel.png>` | je nach Auftrag |
| Cheatsheet, Flipbook, Buch | `cheatsheet/`, `books/` | je nach Auftrag |

**`ogImage` und `audioSrc` gehören erst ins Frontmatter, wenn die Dateien
existieren.** Sonst zeigt die Seite ein kaputtes Bild und einen Audio-Fehler.

Noch nicht eingerichtet: die QR-Weiterleitungsroute. `media-factory/qr/hosts.json`
führt `loschke` mit `live: false` — die Route wird gebaut, wenn der erste
gedruckte Kurzlink dieser Brand ansteht.
