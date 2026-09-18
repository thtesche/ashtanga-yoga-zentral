# Architekturkonzept: Weiterentwicklung AstroCMS & Komponenten-Modularisierung

> **Projekt:** Ashtanga Yoga Zentral Berlin (`ashtanga_yoga_zentral_astro`)  
> **Status:** Entwurf / Vorbereitung für PR  
> **Datum:** 18. September 2026  
> **Autor:** Antigravity / Pair Programming  

---

## Inhaltsverzeichnis

1. [Management Summary & Zielbild](#1-management-summary--zielbild)
2. [Einschätzung & Status des `cms`-Branches](#2-einschätzung--status-des-cms-branches)
3. [Architekturentscheidung (ADR): Umstellung auf Tailwind CSS?](#3-architekturentscheidung-adr-umstellung-auf-tailwind-css)
4. [AstroCMS Ziel-Architektur & Entkopplung](#4-astrocms-ziel-architektur--entkopplung)
5. [Komponenten-Katalog & Priorisierungs-Roadmap](#5-komponenten-katalog--priorisierungs-roadmap)
   - [Phase 1: Mehrfach benutzte Teile (Shared Components)](#phase-1-mehrfach-benutzte-teile-shared-components)
   - [Phase 2: Einzigartige Teile (Unique Content)](#phase-2-einzigartige-teile-unique-content)
   - [Phase 3: QA, CMS-Validierung & Testing](#phase-3-qa-cms-validierung--testing)
6. [Konventionen für AstroCMS-Komponenten](#6-konventionen-für-astrocms-komponenten)
7. [Rollout- und PR-Strategie](#7-rollout-und-pr-strategie)

---

## 1. Management Summary & Zielbild

Die Website von **Ashtanga Yoga Zentral Berlin** wird mit Astro betrieben und nutzt [**AstroCMS**](https://github.com/lonestone/astrocms) als datenbankfreies Headless-CMS. Inhalte liegen direkt als MDX-Dateien im Git-Repository (`src/content/pages/`), während das CMS eine visuelle Redaktionsoberfläche, Medienverwaltung und Git-Operationen (Commit/Push) bereitstellt.

### Aktuelle Herausforderung
Die ersten Schritte in Richtung AstroCMS wurden erfolgreich unternommen (dynamisches Routing über `[...slug].astro`, Schemadefinition in `src/content.config.ts`, Komponenten wie `TeacherSection` und `FaqAccordion`). Dennoch weisen die MDX-Dateien aktuell noch wesentliche architektonische Altlasten auf:
- **Layout-Kopplung im Content:** Jede MDX-Datei umschließt ihren Inhalt manuell mit `<MainLayout>` und übergibt komplexe structuredData-Objekte (JSON-LD).
- **CSS-Imports im MDX:** Fast jede MDX-Seite importiert Seitensheets (`import "../../styles/faq.css"`), was im visuellen Editor von AstroCMS unsichtbar ist oder zu Inkonsistenzen führt.
- **Eingebettete Skripte & Raw-HTML:** Formulare und clientseitiges JavaScript (z. B. Web3Forms in `contact.mdx`) liegen ungeschützt im Content-Bereich.
- **Wiederkehrende UI-Blöcke als HTML:** Preise, Stundenpläne, Adresskarten und Mondtage-Kalender sind noch als rohe HTML-Tags im MDX hinterlegt, statt als wiederverwendbare, typsichere Astro-Komponenten.

### Zielbild
1. **Reine Inhaltsdateien:** MDX-Dateien enthalten **ausschließlich** redaktionellen Text, Frontmatter-Metadaten und semantische Astro-Komponenten. Keine CSS-Imports, keine Skripte, kein `<MainLayout>`.
2. **Priorisierung:** Zuerst werden alle mehrfach benutzten UI-Elemente in modulare Astro-Komponenten überführt (Shared Components), danach die seitenspezifischen Unikate (Unique Content).
3. **Visuelle CMS-Exzellenz:** Redakteure können im AstroCMS-Editor alle Komponenten per Klick einfügen und über strukturierte Formularfelder bzw. Tabellen pflegen, ohne HTML/CSS-Kenntnisse zu benötigen.

---

## 2. Einschätzung & Status des `cms`-Branches

Eine detaillierte Untersuchung der Git-Historie liefert folgendes Bild:

```text
git merge-base main cms               -> 8f1bb17331b39442f785de6e5dde41b40a4d9e4b (Tip von cms)
git rev-list --left-right --count main...cms -> 57 0
```

### Befund
- **Stand des Branches:** Der Branch `cms` (sowohl lokal als auch `origin/cms`) steht unverändert auf Commit `8f1bb17` (*"Rework faq (de) for components; drop lang fallback"*) vom 22. August 2026.
- **Vorfahren-Prüfung:** `cms` ist ein direkter Vorfahre von `main`. 
- **Ungemergte Änderungen:** `0` (null). Es existiert kein einziger Commit auf `cms`, der nicht bereits vollständig in `main` enthalten ist.
- **Entwicklung auf `main`:** Seit dem Stand von `cms` wurden auf `main` **57 Commits** getätigt, darunter:
  - Überarbeitung der About-Seiten für Komponenten (`b36b164`)
  - Erstellung der CMS-Dokumentation `CMS.md` (`82bbd46`)
  - Bereinigung und Reorganisation der Stylesheets (`910085b`)
  - Bump von Astro (auf 7.3.3), AstroCMS (auf 0.3.0), Prettier und Plugins
  - Vollständige Domain-Migration auf `www.ashtangayogazentralberlin.com`
  - Umfassende SEO-Optimierungen (hreflang `en-US`/`de-DE`, JSON-LD, Open Graph, Sitemap)
  - Adressanpassungen und Sicherheits-Fixes

### Fazit & Empfehlung
> [!IMPORTANT]
> **Der `cms`-Branch ist vollständig obsolet (stale).**  
> Er enthält keinerlei unveröffentlichten Code und spiegelt einen Stand wider, der Monate hinter dem aktuellen Produktionsstand liegt.  
> **Empfehlung:** Der Branch `cms` sollte sowohl lokal als auch im Remote-Repository gelöscht werden, um Missverständnisse zu vermeiden:
> ```bash
> git branch -d cms
> git push origin --delete cms
> ```
> Sämtliche künftigen Arbeiten zur CMS-Umstellung erfolgen auf frischen Feature-Branches, die von `main` abzweigen.

---

## 3. Architekturentscheidung (ADR): Umstellung auf Tailwind CSS?

### Fragestellung
*Soll die Website im Zuge der weiteren AstroCMS-Umstellung auf Tailwind CSS migriert werden?*

### Analyse des Ist-Zustands
- Die Website nutzt derzeit ein sehr kompaktes, handgeschriebenes CSS-System:
  - `src/styles/global.css`: ~590 Zeilen für Design-Tokens (CSS-Variablen: Farben `--color-primary`, Schriften, Schatten, Abstände) sowie grundlegende Basis-Elemente (`.btn`, `.surface`, `.container`, Typography).
  - Seitenspezifische Stylesheets (`about.css`, `faq.css`, `contact.css`, etc.): je ca. 50–100 Zeilen.
- Komponenten wie `TeacherSection.astro` nutzen bereits Astros eingebautes **Scoped Styling** (`<style>`), welches automatisch isoliert und gebündelt wird.

### Bewertung: Tailwind CSS vs. Bisheriger Ansatz

| Bewertungskriterium | Bestehendes CSS + Astro Scoped Styles | Tailwind CSS |
| :--- | :--- | :--- |
| **AstroCMS Redaktionserlebnis** | **Hervorragend:** MDX bleibt frei von Styling-Details. Redakteure sehen lesbaren Text und semantische Komponenten (`<RetreatCard ... />`). | **Schlecht / Riskant:** Würden Klassen im MDX genutzt, müssten Redakteure Strings wie `class="flex flex-col p-6 rounded-lg bg-stone-100 dark:bg-stone-800 ..."` pflegen. Das zerstört die Übersicht im visuellen Editor und führt zu Layout-Fehlern. |
| **Code-Kapselung** | **Optimal:** Astro-Komponenten kapseln ihr CSS direkt in `<style>`. Styles werden nur geladen, wenn die Komponente auf der Seite vorkommt. | Erfordert entweder lange Utility-Ketten im HTML/Astro-Markup oder `@apply`-Anweisungen in CSS-Dateien (was den Tailwind-Vorteil untergräbt). |
| **Build- & Bundle-Overhead** | **Null:** Keine zusätzlichen Vite-Plugins oder Tailwind-Kompilierungsschritte erforderlich. | Zusätzliche Tooling-Abhängigkeit (`@tailwindcss/vite` oder PostCSS), potenzieller Mehraufwand bei künftigen Astro-Major-Upgrades. |
| **Design-Konsistenz** | **Sehr hoch:** Die Farbpalette (`#637b69`, `#d4bfa7`, etc.) und Typografie (`Outfit`, `Inter`) sind über CSS-Variablen fest verankert. | Müsste komplett in eine Tailwind-Konfiguration / CSS Theme-Layer überführt werden. |
| **Migrationsaufwand** | **Sehr gering:** Bestehende Styles können direkt 1:1 in die neuen Komponenten übernommen werden. | **Hoch:** Komplettes Neuschreiben aller bestehenden Selektoren und Klassen in Utility-Klassen, mit hohem Risiko visueller Regressionen. |

### Entscheidung
> [!TIP]
> **Entscheidung: Keine Umstellung auf Tailwind CSS.**  
> 
> **Begründung:**  
> 1. Die Zielsetzung ist eine exzellente Redaktionserfahrung in AstroCMS. Diese basiert darauf, dass Styling vollständig in **wiederverwendbare Astro-Komponenten** gekapselt wird. MDX-Dateien dürfen keine Styling-Klassen enthalten.
> 2. Astros natives Scoped CSS leistet genau diese Kapselung bereits ohne zusätzliche Abhängigkeiten und ohne Runtime-/Build-Komplexität.
> 3. Der Aufwand einer Tailwind-Migration böte keinen funktionalen Mehrwert für Besucher oder Redakteure, würde aber wertvolle Ressourcen von der Komponenten-Modularisierung abziehen.
> 
> *Hinweis für die Zukunft:* Sollte später an isolierter Stelle Tailwind gewünscht werden, darf dies ausschließlich **intern innerhalb von `.astro`-Dateien** geschehen, niemals als Inline-Klassen in den MDX-Dateien.

---

## 4. AstroCMS Ziel-Architektur & Entkopplung

### 4.1 Die Kern-Entkopplung: Layout aus MDX verbannen
Aktuell umschließt jede Seite ihren Inhalt mit:
```mdx
<MainLayout title={frontmatter.title} description={frontmatter.description} structuredData={...}>
  ...
</MainLayout>
```
Dies hat mehrere gravierende Nachteile:
1. Im AstroCMS-Editor sieht der Redakteur die umschließenden Tags.
2. Mehrere hundert Zeilen JSON-LD Schema.org Definitionen liegen direkt in den Inhaltsdateien (z. B. `index.mdx`, `about.mdx`, `faq.mdx`).
3. Die Dynamic Routes `[...slug].astro` und `de/[...slug].astro` sind derzeit nur passive Durchreicher:
   ```astro
   <Content components={mdxComponents} />
   ```

### 4.2 Die neue Route-Architektur
Die dynamischen Routen übernehmen die Hülle selbst:

```astro
---
// src/pages/[...slug].astro (bzw. src/pages/de/[...slug].astro)
import { getCollection, render } from "astro:content";
import MainLayout from "../components/MainLayout.astro";
import { mdxComponents } from "../components";

// ... Static Paths & Entry Resolution ...
const { Content, headings } = await render(entry);
---

<MainLayout
  title={entry.data.title}
  description={entry.data.description}
  ogImage={entry.data.ogImage}
  schemaType={entry.data.schemaType}
>
  <Content components={mdxComponents} />
</MainLayout>
```

Damit werden alle MDX-Dateien schlagartig von `<MainLayout>`, `import ...css` und unleserlichen JSON-Objekten befreit.

### 4.3 Erweitertes Content-Schema (`src/content.config.ts`)
Das Zod-Schema steuert automatisch die Eingabefelder im AstroCMS-Editor:

```typescript
import { defineCollection } from "astro:content";
import { z as zod } from "astro/zod";
import { glob } from "astro/loaders";

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/pages",
  }),
  schema: zod.object({
    title: zod.string(),
    description: zod.string(),
    // Optionale Felder für feinere SEO/Layout-Steuerung:
    ogImage: zod.string().optional(),
    schemaType: zod.enum(["YogaStudio", "Person", "FAQPage", "ContactPage", "WebPage"]).default("WebPage"),
  }),
});

export const collections = { pages };
```

---

## 5. Komponenten-Katalog & Priorisierungs-Roadmap

Um den Übergang strukturiert und regressionsfrei zu gestalten, gliedert sich die Umsetzung in zwei Phasen: **zuerst mehrfach benutzte Teile (Shared Components)**, danach **einzigartige Teile (Unique Content)**.

```mermaid
flowchart TD
    subgraph Phase 1: Shared Components
        A1[1. Layout-Entkopplung] --> A2[2. PageHeader]
        A2 --> A3[3. ContactForm]
        A3 --> A4[4. LocationCard]
        A4 --> A5[5. RetreatCard]
        A5 --> A6[6. PricingGrid & Cards]
        A6 --> A7[7. ScheduleSection]
        A7 --> A8[8. MoonCalendar]
    end

    subgraph Phase 2: Unique Content
        B1[HeroSection Home] --> B2[Rechtstexte MDX Bereinigung]
        B2 --> B3[Vollständige CSS-Bereinigung]
    end

    subgraph Phase 3: Validierung
        C1[CMS Editor Test] --> C2[Automatisierte Build-Tests]
        C2 --> C3[SEO & Schema Verification]
    end

    Phase 1 --> Phase 2 --> Phase 3
```

---

### Phase 1: Mehrfach benutzte Teile (Shared Components)

Diese Komponenten werden auf mehreren Seiten (oft sowohl in EN als auch in DE) verwendet und haben den höchsten Hebel zur Reduktion von Code-Duplikaten.

#### 1. Layout-Entkopplung & Routing-Refactoring
- **Ziel:** `<MainLayout>` aus allen 16 MDX-Dateien (`src/content/pages/**/*.mdx`) entfernen und fest in `[...slug].astro` und `de/[...slug].astro` integrieren.
- **Vorteil:** MDX-Dateien sind sofort sauberer und im CMS viel angenehmer zu bearbeiten.

#### 2. `PageHeader.astro`
- **Aktueller Zustand:** Auf 7 Seiten existiert identisches Markup:
  ```html
  <div class="page-header">
    <div class="container text-center animate-fade-in">
      <h1>...</h1>
      <p class="subtitle">...</p>
    </div>
  </div>
  ```
- **Ziel-Komponente:**
  ```astro
  <PageHeader title="FAQ" subtitle="Frequently Asked Questions" />
  ```
- **Eigenschaften:** Unterstützt `title`, `subtitle` und optionale `class`-Varianten.

#### 3. `ContactForm.astro`
- **Aktueller Zustand:** `contact.mdx` und `de/kontakt.mdx` enthalten rohes Formular-HTML sowie ein 30-zeiliges `<script>` mit `fetch("https://api.web3forms.com/submit")`.
- **Ziel-Komponente:**
  ```astro
  <ContactForm
    locale="en"
    buttonText="Send Message"
    successMessage="Thank you! Your message has been sent."
  />
  ```
- **Eigenschaften:** Kapselt das Formular, Web3Forms-Honeypot, Umgebungsvariablen (`PUBLIC_WEB3FORMS_ACCESS_KEY`), Validierung und interaktive Statusmeldung. Im MDX verbleibt ein sauberer Einzeiler.

#### 4. `LocationCard.astro` / `StudioAddress.astro`
- **Aktueller Zustand:** Studioadresse ("Three Boons Studio, Brunnenstr. 29"), Öffnungszeiten-Hinweis und Google Maps Link sind auf der Startseite (`index.mdx` / `de/index.mdx`) und der Kontaktseite (`contact.mdx` / `de/kontakt.mdx`) dupliziert.
- **Ziel-Komponente:**
  ```astro
  <LocationCard
    title="Three Boons Studio"
    address="Brunnenstr. 29 (3.Hinterhof), 10119 Berlin"
    mapUrl="https://maps.app.goo.gl/3Z79LhNtPXcF3LH37"
  />
  ```

#### 5. `RetreatCard.astro`
- **Aktueller Zustand:** In `retreats.mdx` und `de/retreats.mdx` werden Retreat-Karten (Puglia, Mecklenburg, Laruga Glaser Workshop) mit identischen verschachtelten HTML-Strukturen und Bild-Imports gepflegt.
- **Ziel-Komponente:**
  ```astro
  <RetreatCard
    date="1 – 7 August 2026"
    title="Ashtanga Yoga Retreat – Puglia, Italy"
    image="../../assets/images/img_2_yogaPulia_retreat_centre_images.webp"
    imageAlt="YogApulia retreat center"
    linkUrl="https://www.yogapulia.com/elinore-burke-2026"
    linkText="Gallery"
  >
    <p>We had an amazing week at YogApulia...</p>
  </RetreatCard>
  ```
- **Eigenschaften:** Nutzt `resolveImagePath()` aus `image-assets.ts` für Astro-optimierte Bilder und AstroCMS-Bildauswahl.

#### 6. `PricingGrid.astro` & `PricingCard.astro` (+ `UscTopUp.astro`)
- **Aktueller Zustand:** ~70 Zeilen HTML in `index.mdx` und `de/index.mdx` für Mitgliedschaften (Trial Month, 8x, 12x, Unlimited, Drop-In, Visiting Pass) und Urban Sports Club Top-Ups.
- **Ziel-Komponenten:**
  ```astro
  <PricingGrid>
    <PricingCard title="Trial Month" price="€90" tooltip="Unlimited classes for beginners." />
    <PricingCard title="8x Month" price="€95" />
    <PricingCard title="12x Month" price="€115" />
    <PricingCard title="Unlimited Month" price="€135" highlighted />
  </PricingGrid>
  <UscTopUp />
  ```

#### 7. `ScheduleSection.astro`
- **Aktueller Zustand:** Tabelle/Liste der Kurszeiten (Mo–Fr 6:30–9:30, Led Primary monatlich, So 7:30–9:45, Mondtage-Hinweis).
- **Ziel-Komponente:**
  ```astro
  <ScheduleSection locale="en" />
  ```

#### 8. `MoonCalendar.astro` / `MonthCard.astro`
- **Aktueller Zustand:** In `moondays.mdx` und `de/moondays.mdx` sind 12 Monate mit je 2 Mondphasen hart codiert (~100 Zeilen HTML-Grid).
- **Ziel-Komponente:**
  ```astro
  <MoonCalendar year={2026} locale="en" />
  ```
  *(Die Monddaten können in einer zentralen Datenstruktur oder JSON-Datei liegen, sodass beide Sprachversionen auf dieselbe Datenbasis zugreifen).*

#### 9. Bereits etablierte Shared Components weiterführen
- `FaqAccordion.astro`: Bereits vorhanden und bewährt.
- `TeacherSection.astro`: Bereits vorhanden und vorbildlich (nutzt `resolveImagePath` und Scoped Styles).
- `TestimonialsSection.astro`: Bereits vorhanden und bewährt.

---

### Phase 2: Einzigartige Teile (Unique Content)

Sobald das Fundament aus Shared Components steht, werden die seitenspezifischen Einzelbereiche finalisiert:

#### 1. Startseiten-Hero (`HeroSection.astro`)
- Einzigartig für die Startseite: Große H1 ("Morning Ashtanga Yoga Mysore Style in Berlin"), Untertitel, CTA-Button ("View Schedule") und zentriertes Shala-Willkommensbild.
- Auslagerung in `HeroSection.astro`, damit `index.mdx` und `de/index.mdx` nur noch aus 4–5 sauberen Komponentenblöcken bestehen:
  ```mdx
  <HeroSection image="../../assets/images/img_3_ashtanga_yoga_zentral_berlin_mysore_studio.webp" ... />
  <ScheduleSection />
  <PricingGrid ... />
  <LocationCard ... />
  ```

#### 2. Rechtliche Seiten (Impressum, Datenschutz, Legal Notice, GDPR)
- Diese Seiten (`gdpr.mdx`, `datenschutz.mdx`, `legal_notice.mdx`, `impressum.mdx`) enthalten keine interaktiven Widgets, sondern Fließtext mit rechtlichen Hinweisen.
- **Zielzustand:** Nach der Layout-Entkopplung bestehen diese Seiten aus reinem, semantischem Markdown:
  ```markdown
  # Legal Notice

  Information according to § 5 TMG...
  ```
- Sämtliche `import "../../styles/gdpr.css"` und `<MainLayout>`-Wrapper entfallen restlos.

#### 3. Abschließende Bereinigung der Stylesheets
- Alle seitenspezifischen CSS-Dateien (`src/styles/*.css`), die in Scoped Styles von Komponenten überführt wurden, werden aus `src/styles/` entfernt.
- `global.css` bleibt das schlanke Fundament für Variablen, Reset und Basiselemente.

---

### Phase 3: QA, CMS-Validierung & Testing

1. **AstroCMS Editor-Test:**
   - Starten der CMS-Instanz: `npm run astrocms`
   - Öffnen unter `http://localhost:4001/astrocms`
   - Prüfung:
     - Werden alle Komponenten im Komponenten-Menü angezeigt?
     - Funktionieren Props-Bearbeitung und Bildauswahl?
     - Bleibt das Markdown sauber formatiert nach dem Speichern?
2. **Automatisierte Build- und HTML-Tests:**
   - Ausführen von `npm run build && npm test`.
   - Die Testsuite in `test/build-tests.js` prüft alle HTML-Dateien im `dist/`-Verzeichnis (Meta-Tags, Hreflang, Canonical URLs, Structured Data JSON-LD).
3. **i18n & SEO Prüfung:**
   - Verifikation, dass alle englischen und deutschen Routen (`/` und `/de/`) fehlerfrei generiert werden.
   - Verifikation der Redirects für englische Einzelseiten.

---

## 6. Konventionen für AstroCMS-Komponenten

Damit neue Komponenten nahtlos mit AstroCMS harmonieren, gelten folgende Entwicklungsrichtlinien:

1. **Dateiname und Speicherort:**
   Jede neue Komponente wird als `.astro`-Datei in `src/components/` angelegt. Durch `import.meta.glob("./**/*.astro")` in `src/components/index.ts` steht sie ohne manuelles Verdrahten sofort im MDX und im CMS-Editor zur Verfügung.

2. **Bilder via `ImagePath`:**
   Um die Medienauswahl von AstroCMS zu nutzen, müssen Bild-Props als Pfadstring typisiert und über `resolveImagePath()` aufgelöst werden:
   ```typescript
   import { resolveImagePath } from "./image-assets.ts";
   type ImagePath = string;

   interface Props {
     image?: ImagePath;
     alt?: string;
   }
   ```

3. **Keine HTML/CSS-Imports im MDX:**
   MDX-Dateien dürfen weder CSS (`import "..."`) noch JavaScript-Logik enthalten.

4. **Scoped Styles bevorzugen:**
   Komponentenspezifisches Styling gehört in den `<style>`-Block der jeweiligen `.astro`-Komponente. CSS-Variablen aus `global.css` sind überall verfügbar.

---

## 7. Rollout- und PR-Strategie

Die Umsetzung erfolgt in klar abgegrenzten, testbaren Schritten:

1. **PR 1 (dieser Schritt):**
   - Branch: `docs-astrocms-architecture`
   - Inhalt: Dieses Architektur-Dokument (`docs/architektur-astrocms.md`).
   - Ziel: Review und Abstimmung des Vorgehens.

2. **PR 2 (Cleanup & Vorbereitung):**
   - Löschung des veralteten Branches `cms`.
   - Entkopplung von `<MainLayout>` in die Dynamic Routes `[...slug].astro` und `de/[...slug].astro`.

3. **PR 3 (Shared Components - Phase 1):**
   - Implementierung von `PageHeader`, `ContactForm`, `LocationCard`, `RetreatCard`, `PricingGrid`, `ScheduleSection`, `MoonCalendar`.
   - Refactoring der entsprechenden MDX-Seiten.

4. **PR 4 (Unique Content & Final Polish - Phase 2):**
   - Startseiten-Hero (`HeroSection.astro`).
   - Bereinigung der rechtlichen Seiten und Löschung überflüssiger CSS-Dateien.
