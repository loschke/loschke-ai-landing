---
thema: Agent Ringmodell
quellen:
  - kb:AI-Agents/Anatomie-Ringmodell.md
  - kb:AI-Agents/Anatomie-eines-KI-Agenten.md
  - kb:AI-Agents/Agent-Bauplan-6-Bausteine.md
datum: 2026-08-21
---
# Agent Ringmodell

## Kernaussagen

1. **Das Ringmodell ist die verbindliche Standarderzählung für „Was ist ein Agent"** — seit Juli 2026, festgeschrieben im Master-Deck „Haufe - AI-Agent Master". Es ersetzt alle älteren Anatomie-Fassungen (Sensor/Motor/Stimme, 6-Bausteine, 5-Bausteine). Die früheren Zerlegungen sind nicht falsch, aber nicht mehr die Anatomie-Erzählung. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

2. **Ein Agent ist keine Blackbox, sondern drei konzentrische Ringe: Kern, Ausstattung, Rahmen.** Der Kern (LLM) denkt und entscheidet. Die Ausstattung macht das Modell zum *eigenen* Agenten. Der Rahmen formt und sichert ihn ab. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

3. **Der Kern liefert vier Fähigkeiten: Reasoning, Tool-Calling, Instruction-Following und Loop.** Der Loop ist die einzige Kernfähigkeit, die nicht direkt aus dem LLM selbst kommt — er wird über die Schnittstelle mitgeliefert. Das Sternchen im Modell markiert diese Ausnahme. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

4. **Die Ausstattung besteht aus Tools, Wissen, Skills und Memory.** Tools sind Werkzeuge (APIs, Browser, Datenbanken). Wissen ist, was der Agent nachschlägt. Skills sind gebündelte Prozessanweisungen — keine Werkzeuge, sondern Anleitungen, die Werkzeuge nutzen. Memory ist das Gedächtnis selbst, nicht dessen Überwachung. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

5. **Der Rahmen besteht aus Identität, Guardrails, Prüfstand und Interface.** Identität ist das Selbstverständnis (Systemprompt). Guardrails werden weich im LLM angelegt, verbindlich nur durch technische Durchsetzung im Rahmen. Der Prüfstand schaut von außen drauf (Observability, Tracing, Evals). Das Interface ist die Bühne des Agenten. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

6. **Das Ringmodell taugt als Lesekarte für jeden Agenten — gekauft oder selbst gebaut.** Frage: Welcher Ring ist stark besetzt, welcher fehlt? Starke Ausstattung ohne Rahmen = mächtig und unkontrolliert. Dicker Rahmen ohne Ausstattung = abgesicherter Chatbot. Fehlender Prüfstand = niemand weiß, ob es gut läuft. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

7. **Instruction-Following im Kern macht den Rahmen erst wirksam.** Ein Modell, das Vorgaben ignoriert, hat weder Identität noch Guardrails — der äußere Ring greift ins Leere. Das ist die kritische Verbindung zwischen den Ringen. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

## Begriffe

- **Kern** — Das LLM, das denkt und entscheidet. Liefert Reasoning, Tool-Calling, Instruction-Following und Loop. Der innerste Ring.
- **Ausstattung** — Was das generische Modell zum eigenen Agenten macht: Tools, Wissen, Skills, Memory. Der mittlere Ring.
- **Rahmen** — Was den Agenten formt und absichert: Identität, Guardrails, Prüfstand, Interface. Der äußere Ring.
- **Reasoning** — Mehrschrittig planen, Zwischenziele bilden, sich selbst korrigieren. Der Sprung von „antwortet" zu „arbeitet einen Plan ab".
- **Tool-Calling** — Strukturierte Werkzeugaufrufe formulieren. Damit holt sich das Modell fehlende Fähigkeiten (auch Modalitäten wie Sehen/Hören werden so zum Tool).
- **Loop** — Die Fähigkeit, in Schleifen zu denken und zu reflektieren. Nicht direkt im LLM, wird aber über die Schnittstelle mitgeliefert (markiert mit Sternchen).
- **Skills** — Gebündeltes Prozesswissen: ein reproduzierbares Rezept, das selbst Tools orchestriert. Ein Skill ist die Anleitung, kein Tool.
- **Memory** — Was der Agent über Schritte und Sessions hinweg behält (Kurzzeit: laufende Aufgabe; Langzeit: persistiert). Nicht die Überwachung des Gedächtnisses.
- **Identität** — Persona, Werte, Rolle, Grundhaltung im Systemprompt. Wer der Agent ist, nicht was er weiß.
- **Guardrails** — Verbotene Handlungen, harte Constraints, Datenschutzvorgaben. Weich im LLM angelegt, verbindlich erst durch technische Durchsetzung.
- **Prüfstand** — Observability, Tracing, Evals, Monitoring. Blick von außen auf den Agenten.
- **Interface** — Was beim Nutzer ankommt: generierte UI, Format, Tonalität. Die Bühne des Agenten.
- **Instruction-Following** — Fähigkeit, sich zuverlässig an Vorgaben zu halten. Voraussetzung dafür, dass Identität und Guardrails aus dem Rahmen überhaupt greifen.

## Zahlen & Belege

| Wert | Was er misst | Quelle |
|---|---|---|
| Juli 2026 | Einführungszeitpunkt des Ringmodells als Standarderzählung | kb:AI-Agents/Anatomie-Ringmodell.md (Master-Deck „Haufe - AI-Agent Master") |
| 4 Fähigkeiten im Kern | Reasoning, Tool-Calling, Instruction-Following, Loop (davon 1 mit Sternchen) | kb:AI-Agents/Anatomie-Ringmodell.md |
| 4 Bestandteile Ausstattung | Tools, Wissen, Skills, Memory | kb:AI-Agents/Anatomie-Ringmodell.md |
| 4 Bestandteile Rahmen | Identität, Guardrails, Prüfstand, Interface | kb:AI-Agents/Anatomie-Ringmodell.md |
| 4 zentrale Abgrenzungen | Wissen ≠ Identität, Skill ≠ Tool, Memory ≠ Prüfstand, Lesen ≠ Schreiben | kb:AI-Agents/Anatomie-Ringmodell.md |
| 5 Vorgänger-Fassungen | Anatomie-Notizen, die als Anatomie-Erzählung überholt sind | kb:AI-Agents/Anatomie-Ringmodell.md |

*Hinweis: Keine quantitativen Leistungs- oder Marktdaten in den Quellen. Die Zahlen beschreiben ausschließlich die Modellstruktur.*

## Beispiele & Bilder

- **Lesekarte für Vendor-Pitches**: Ein Anbieter zeigt „seinen KI-Agenten". Mit dem Ringmodell prüft man: Wie stark ist die Ausstattung besetzt? Gibt es einen Rahmen? Ist ein Prüfstand vorhanden? Wer diese Fragen stellen kann, erkennt den Unterschied zwischen echtem Agenten und abgesichertem Chatbot. *(aus kb:AI-Agents/Anatomie-Ringmodell.md)*

- **Chatbot-Test**: „Ein Produkt mit dickem Rahmen und leerer Ausstattung ist ein abgesicherter Chatbot." Der Satz eignet sich als sofort einprägsames Bild, um die Asymmetrie zwischen den Ringen zu erklären. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

- **Loop-Sternchen**: Der Loop ist im Ringmodell mit einem Sternchen markiert, weil er als einzige Fähigkeit im Kern nicht aus dem Modell selbst kommt — wird über die Schnittstelle mitgeliefert. Dieses Detail ist erzählenswert, weil es zeigt, wie präzise das Modell zwischen LLM-Eigenschaft und Infrastruktur-Eigenschaft trennt. *(kb:AI-Agents/Anatomie-Ringmodell.md)*

- **Übersetzungstabelle (alt → neu)**: Für Seminar-Teilnehmer, die noch mit Motor/Sensor/Stimme/Kompass arbeiten, existiert eine vollständige Übersetzungshilfe. Beispiel: „Motor" landet im Kern (Reasoning, Tool-Calling, Loop), „Stimme" landet im Interface (Rahmen), „Kompass/Verfassung/Leitplanken" landen in Identität + Guardrails (Rahmen). *(kb:AI-Agents/Anatomie-Ringmodell.md)*

- **Abgrenzungsmerksätze** (aus dem Modell, für Vermittlung geeignet):
  - „Wissen ist, was er nachschlägt. Identität ist, wer er ist."
  - „Ein Skill ist kein Werkzeug, er ist die Anleitung, die welche benutzt."
  - „Lesen ist harmlos, Schreiben ist das Risiko."
  *(Einschränkung: Rico hat 2026-08-07 festgestellt, dass diese Abgrenzungen nicht mehr als eigene Lehreinheit erzählt werden sollen — nur „Lesen ist harmlos, Schreiben ist das Risiko" trägt als eigenständiger Merksatz.)*

## Roter Faden

1. **Von der Blackbox zur Lesekarte** — Problem: Jeder Vendor zeigt „seinen Agenten" und Demos sehen immer gut aus. Lösung: Das Ringmodell gibt eine strukturierte Sprache, mit der man jeden Agenten durchleuchten kann. Einstieg: drei Ringe, zwölf Bestandteile, vier Abgrenzungen. Ausklang: Was fehlt, wenn ein Ring leer bleibt.

2. **Von alt nach neu** — Für Zielgruppen, die bereits mit Sensor/Motor/Stimme oder den 6-Bausteinen arbeiten: Kurze Geschichte der Fassungen, klare Übersetzungshilfe, dann das neue Modell. Botschaft: Nicht alles ist ersetzt, aber die Anatomie-Erzählung hat eine neue verbindliche Fassung — und die ist präziser.

3. **Aufbau und Absicherung** — Für Entscheider und Auftraggeber: Zuerst erklären, was in einem Agenten steckt (Ringe 1 + 2). Dann zeigen, was ihn erst sicher und steuerbar macht (Ring 3). Instruction-Following als Brücke: Ohne es greift der Rahmen ins Leere. Abschluss: Prüfstand als blinder Fleck, der in der Praxis am häufigsten fehlt.

## Offene Punkte

- **Referenzformulierung für Nicht-Fachpublikum**: Die Notiz verweist auf das Flipbook „Agenten im Griff" (Kapitel 02, `lernen-diy`) als ausformulierte Fassung in Ricos Ton. Diese Quelle wurde nicht gelesen — inhaltliche Nuancen aus dieser Fassung fehlen im Dossier.
- **Abgrenzungs-Block zurückgestuft**: Rico hat am 2026-08-07 festgelegt, dass die vier Abgrenzungen nicht mehr als eigene Lehreinheit ausgespielt werden. Nur ein Merksatz trägt eigenständig. Unklar, ob das für alle Medien gilt oder nur für Buch/Lesson/Seminar.
- **Loop-Sternchen technisch**: Die Notiz sagt, der Loop kommt „über die Schnittstelle". Was genau das technisch bedeutet (API-Feature, Prompting-Konvention, Framework-Ebene), ist in den Quellen nicht weiter ausgeführt.
- **Keine Zahlen zu Leistung oder Verbreitung**: Die Quellen liefern keine empirischen Belege dafür, warum das Ringmodell besser funktioniert als die Vorgänger-Fassungen — nur strukturelle Argumente.
