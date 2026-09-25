# Architekturkonzept: AstroCMS & verbleibende Komponenten-Modularisierung

> **Projekt:** Ashtanga Yoga Zentral Berlin (`ashtanga_yoga_zentral_astro`)
> **Status:** Restarbeiten / aktive Backlog-Abrechnung
> **Aktualisiert:** 25. September 2026
> **Autor:** Antigravity / Pair Programming

Dieses Dokument beschreibt die aktuelle Architektur und die **noch offenen Arbeiten**. Bereits abgearbeitete Komponenten und abgeschlossene Entscheidungen werden nicht als aktive Backlog-Aufgaben geführt.

---

## Inhaltsverzeichnis

1. [Statusbild & Zielbild](#1-statusbild--zielbild)
2. [Gesetzte Architektur](#2-gesetzte-architektur)
   - [Content, Routing und Layout](#content-routing-und-layout)
   - [JSON-LD-Registry](#json-ld-registry)
   - [CSS- und Tailwind-Entscheidung](#css--und-tailwind-entscheidung)
   - [AstroCMS-Komponenten-Discovery](#astrocms-komponenten-discovery)
3. [Offener Backlog](#3-offener-backlog)
   - [#23 – Automatische Moondays-Komponente](#23--automatische-moondays-komponente)
   - [#24 – Korrekturtage im AstroCMS](#24--korrekturtage-im-astrocms)
   - [#26 – Rechtstexte bereinigen](#26--rechtstexte-bereinigen)
   - [#27 – CSS-Cleanup](#27--css-cleanup)
   - [#28 – AstroCMS-QA](#28--astrocms-qa)
4. [Konventionen für AstroCMS-Komponenten](#4-konventionen-für-astrocms-komponenten)
5. [Reihenfolge & Definition of Done](#5-reihenfolge--definition-of-done)

---

## 1. Statusbild & Zielbild

Die Website nutzt Astro mit AstroCMS als dateibasiertem Headless-CMS. Inhalte liegen als MDX in `src/content/pages/`, während das CMS die redaktionelle Bearbeitung, Medienauswahl und Git-Operationen übernimmt.

### Zielbild

- MDX enthält redaktionellen Inhalt und semantische Komponentenaufrufe.
- Layout, SEO-Metadaten und JSON-LD werden nicht in einzelnen Content-Dateien gepflegt.
- Wiederkehrende UI-Bausteine liegen als typisierte Astro-Komponenten vor.
- AstroCMS stellt die Komponenten ohne manuelle Verdrahtung im Editor bereit.
- Styling bleibt in Astro-Scoped-Styles oder im schlanken globalen Fundament; MDX enthält keine CSS-Imports, clientseitigen Skripte oder Utility-Klassen.

### Aktueller Restbestand

| Issue                                                              | Arbeitsbereich                                              | Status    |
| ------------------------------------------------------------------ | ----------------------------------------------------------- | --------- |
| [#23](https://github.com/thtesche/ashtanga-yoga-zentral/issues/23) | Automatische Moondays-Komponente mit sechsmonatigem Fenster | `Backlog` |
| [#24](https://github.com/thtesche/ashtanga-yoga-zentral/issues/24) | Korrekturtage im AstroCMS-Editor                            | `Backlog` |
| [#26](https://github.com/thtesche/ashtanga-yoga-zentral/issues/26) | Rechtstexte auf semantische MDX-Struktur umstellen          | `Backlog` |
| [#27](https://github.com/thtesche/ashtanga-yoga-zentral/issues/27) | Verbleibendes CSS bereinigen                                | `Backlog` |
| [#28](https://github.com/thtesche/ashtanga-yoga-zentral/issues/28) | Manuellen AstroCMS-Editor- und Komponenten-QA durchführen   | `Backlog` |

Die Moondays-Seiten enthalten aktuell noch zwölf manuell gepflegte Monatsblöcke, einen CSS-Import und ein Inline-Script. Die Rechtstextseiten enthalten noch CSS-Imports und umfangreiche Raw-HTML-Strukturen. Diese Bereiche bilden den aktiven Restbestand.

---

## 2. Gesetzte Architektur

### Content, Routing und Layout

Die dynamischen Routen `src/pages/[...slug].astro` und `src/pages/de/[...slug].astro` übernehmen die Layout-Hülle. Die MDX-Dateien enthalten keinen `<MainLayout>`-Wrapper mehr.

Aktueller Aufbau der englischen Route:

```astro
---
import { getCollection, render } from "astro:content";
import MainLayout from "../components/MainLayout.astro";
import { mdxComponents } from "../components";
import { getStructuredData } from "../components/structured-data";

const { Content } = await render(entry);
---

<MainLayout
  title={entry.data.title}
  description={entry.data.description}
  fullTitle={entry.data.fullTitle}
  structuredData={getStructuredData(entry.id, entry.data)}
>
  <Content components={mdxComponents} />
</MainLayout>
```

`MainLayout` erhält nur die für die Seite relevanten Metadaten. Das optionale `fullTitle`-Feld wird für Titel verwendet, die bereits den Markennamen enthalten. `ogImage` bleibt eine Layout-Property und wird derzeit nicht als Content-Frontmatter gepflegt.

Das aktuelle Content-Schema in `src/content.config.ts` enthält entsprechend nur die redaktionellen Felder:

```typescript
schema: zod.object({
  title: zod.string(),
  description: zod.string(),
  fullTitle: zod.string().optional(),
});
```

`schemaType` und `ogImage` sind keine Frontmatter-Felder der Pages-Collection.

### JSON-LD-Registry

JSON-LD wird nicht über ein `schemaType`-Enum im Frontmatter ausgewählt. Die Registry in [`src/components/structured-data.ts`](../src/components/structured-data.ts) ordnet Entry-IDs den stabilen Schema-Strukturen zu und wird von beiden dynamischen Routen aufgerufen.

Die FAQ-Seiten bleiben ein Sonderfall: `FaqAccordion.astro` erzeugt das FAQPage-Schema aus den sichtbaren `items` und ist damit die Single Source of Truth.

### CSS- und Tailwind-Entscheidung

**Es erfolgt keine Umstellung auf Tailwind CSS.**

- Komponentenspezifisches Styling liegt in Scoped Styles der jeweiligen `.astro`-Komponente.
- Globale CSS-Variablen und Basisklassen bleiben in `src/styles/global.css`.
- MDX-Dateien pflegen keine Layoutklassen, CSS-Imports oder Style-Strings.
- Neue CSS-Regeln werden nur nach Prüfung der tatsächlichen Verwendung hinzugefügt.

Diese Entscheidung ist abgeschlossen und keine aktive Backlog-Aufgabe.

### AstroCMS-Komponenten-Discovery

`src/components/index.ts` lädt alle `.astro`-Dateien über `import.meta.glob("./**/*.astro", { eager: true })`. `astrocms.json` zeigt mit `componentsDir: "src/components"` auf denselben Ordner.

Eine neue Komponente wird deshalb durch das Ablegen in `src/components/` automatisch:

1. in MDX über `mdxComponents` verfügbar,
2. im AstroCMS-Komponentenmenü erkannt,
3. ohne manuelles Import- oder Routing-Setup verwendet.

Props müssen serialisierbar sein, damit AstroCMS sie im Editor als Felder anbieten kann. Literal-Unions werden für Auswahlfelder verwendet, z. B. `locale: "en" | "de"` oder `adjustment: -1 | 1`.

---

## 3. Offener Backlog

### #23 – Automatische Moondays-Komponente

**Issue:** [#23 – Moondays: automatische 6-Monats-Komponente berechnen](https://github.com/thtesche/ashtanga-yoga-zentral/issues/23)

#### Anforderungen

- Die Komponente berechnet immer **sechs Monate ab dem aktuellen Monat** zum Build-Zeitpunkt.
- Die Monatsausgabe ergänzt den Monatsnamen um die letzten zwei Stellen des Jahres, z. B. `September 26` und `Oktober 26`.
- Vollmond- und Neumondtermine werden automatisch aus einer gemeinsamen Datenquelle bzw. Berechnung erzeugt.
- EN und DE verwenden dieselbe Berechnung und dieselbe Datenbasis; nur die Formatierung ist lokalisiert.
- Die Ausgabe erfolgt über `MoonCalendar.astro`, optional mit einer kleinen `MonthCard.astro`-Unterkomponente.
- Das MDX enthält danach keine zwölf manuell gepflegten Monatskarten, keinen `moondays.css`-Import und kein Inline-Script.
- Die Props sind für die spätere Korrekturliste aus #24 vorbereitet.

#### Abnahme

- Genau sechs Monate ab dem aktuellen Monat werden ausgegeben.
- Der Jahreswechsel wird korrekt behandelt.
- Die Monatsüberschrift enthält Monatsname + zweistellige Jahreszahl.
- `npm run build` und `npm test` sind erfolgreich.
- Automatisierte Tests decken Berechnungsfenster und Formatierung ab.

> **Build-Hinweis:** „Aktueller Monat“ bedeutet zunächst den Monat zum Zeitpunkt des statischen Builds. Nach einem Monatswechsel wird die Ausgabe beim nächsten Build aktualisiert. Eine Aktualisierung ohne Rebuild erfordert eine separate Laufzeit-/Client-Strategie.

### #24 – Korrekturtage im AstroCMS

**Issue:** [#24 – AstroCMS: Korrekturtage für Moondays pflegen](https://github.com/thtesche/ashtanga-yoga-zentral/issues/24)

#24 setzt auf der Komponente aus #23 auf und ergänzt eine optionale Korrekturliste.

#### CMS-Felder

Jeder Listeneintrag besteht aus:

- **Tag für Korrektur** (`date`): Datum des automatisch berechneten Moondays.
- **Korrektur** (`adjustment`): Auswahl `+1` oder `-1`.

Beispiel:

```mdx
<MoonCalendar
  locale="de"
  corrections={[{ date: "2026-10-03", adjustment: -1 }]}
/>
```

#### Verhalten

- Eine leere Korrekturliste ist gültig und verändert die Ausgabe nicht.
- `-1` verschiebt den betroffenen Termin einen Tag nach vorne.
- `+1` verschiebt den betroffenen Termin einen Tag nach hinten.
- Die automatische Berechnung bleibt unverändert; nur die Darstellung des ausgewählten Termins wird korrigiert.
- Für denselben berechneten Termin wird höchstens eine Korrektur zugelassen.
- Das Datum wird im jeweiligen Locale-Format angezeigt.
- Nach dem Speichern entstehen keine JavaScript-, CSS- oder manuellen HTML-Einträge im MDX.

### #26 – Rechtstexte bereinigen

**Issue:** [#26 – Rechtstexte: semantische MDX-Struktur und CSS-Imports bereinigen](https://github.com/thtesche/ashtanga-yoga-zentral/issues/26)

Betroffen sind:

- `src/content/pages/gdpr.mdx`
- `src/content/pages/de/datenschutz.mdx`
- `src/content/pages/legal_notice.mdx`
- `src/content/pages/de/impressum.mdx`

Die Seiten behalten ihren Text und ihre gemeinsame `PageHeader`-Komponente. Die verbleibenden CSS-Imports und generischen Layout-Klassen werden durch semantische Struktur bzw. eine bewusst gekapselte Rechtstext-Komponente ersetzt. Rechtstext-Inhalte dürfen durch das CMS-Speichern nicht verändert werden.

### #27 – CSS-Cleanup

**Issue:** [#27 – CSS-Cleanup: verbleibende Stylesheets und tote Selektoren entfernen](https://github.com/thtesche/ashtanga-yoga-zentral/issues/27)

Nach #23 und #26 werden alle Stylesheets und Imports auf tatsächliche Nutzung geprüft. Nicht mehr benötigte Dateien, Kommentar-Only-Dateien und tote Selektoren werden entfernt. Verbleibende komponentenspezifische Regeln gehören in Scoped Styles; `global.css` bleibt das Fundament für Tokens, Reset und Basiselemente.

Zu prüfen sind insbesondere die verbleibenden `about.css`-/FAQ-Regeln sowie die zuvor genannten toten globalen Selektoren `.highlight-card` und `.usc-topup`. Eine Änderung darf keine sichtbaren Regressionen in EN oder DE verursachen.

### #28 – AstroCMS-QA

**Issue:** [#28 – AstroCMS: manuellen Editor- und Komponenten-QA durchführen](https://github.com/thtesche/ashtanga-yoga-zentral/issues/28)

Der manuelle Test umfasst:

```bash
npm run astrocms
```

Danach wird `http://localhost:4001/astrocms` geöffnet und geprüft:

- automatische Komponenten-Discovery,
- Text-, Auswahl- und Bildfelder,
- die sechsmonatige Moondays-Ausgabe,
- die Korrekturliste aus #24,
- Speichern/Neuladen in EN und DE,
- sauberes Markdown ohne CSS-Imports, Inline-Skripte oder unerwünschte Layoutklassen.

Die automatisierten Build-/HTML-Tests (`npm run build && npm test`) bleiben die technische Basis und ergänzen die manuelle CMS-Abnahme.

---

## 4. Konventionen für AstroCMS-Komponenten

1. **Ablage:** Neue Komponenten liegen als `.astro`-Datei in `src/components/`.
2. **Discovery:** Keine manuelle Registrierung in `src/components/index.ts` oder `astrocms.json` erforderlich.
3. **MDX-Regeln:** MDX enthält keine CSS-Imports, Inline-Skripte, Layout-Utility-Klassen oder Style-Definitionen.
4. **Styling:** Komponentenspezifische Regeln liegen im `<style>`-Block der Komponente; globale Tokens bleiben in `global.css`.
5. **Props:** Props sind serialisierbar und für das CMS verständlich typisiert. Auswahlfelder verwenden Literal-Unions.
6. **Bilder:** Bild-Props verwenden nach Möglichkeit den im Repository etablierten `ImagePath`-/`resolveImagePath()`-Ansatz.
7. **Internationalisierung:** Berechnungen werden sprachneutral geteilt; Monatsnamen, Datumstexte und UI-Texte werden über `locale` lokalisiert.
8. **Datenmodell:** Korrekturdaten werden als Liste serialisiert, z. B. `{ date, adjustment }`; die Berechnung bleibt davon getrennt.

---

## 5. Reihenfolge & Definition of Done

### Empfohlene Reihenfolge

1. **#23** – automatische sechsmonatige Moondays-Komponente implementieren.
2. **#24** – Korrekturliste im AstroCMS ergänzen.
3. **#26 und #27** – Rechtstexte und verbleibendes CSS bereinigen; CSS-Aufräumen erst nach #23 abschließen, damit `moondays.css` nicht doppelt angefasst wird.
4. **#28** – manuellen CMS- und Komponenten-QA durchführen.

### Definition of Done

- Das aktive Backlog enthält nur noch tatsächlich offene Aufgaben.
- Issue-Beschreibungen, Komponenten-API und dieses Dokument beschreiben denselben Zielzustand.
- Änderungen sind durch `npm run build` und `npm test` abgesichert.
- Manuelle CMS-Abnahme ist für #28 dokumentiert.
- Nach erfolgreicher Umsetzung wird das jeweilige Issue geschlossen und im GitHub-Projekt auf `Done` gesetzt.
