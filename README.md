# Ashtanga Yoga Zentral Astro

## 🧘 About the Project

This repository contains the source code for the official website of Ashtanga Yoga Zentral, a yoga studio located in Berlin. The website is built using **Astro**, a modern static site generator, and is designed to promote the studio's classes, services, and the specialized instruction provided by Elinore Burke.

The site is bilingual: English (default, no URL prefix) and German (`/de/`).

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/thtesche/ashtanga-yoga-zentral.git
    cd ashtanga-yoga-zentral
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **(Optional) Configure the contact form:**
    ```bash
    cp .env.example .env
    ```
    The contact form uses [Web3Forms](https://web3forms.com/). The key in `.env.example` is a shared dev/test key — replace it with your own if you like.
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The site should now be accessible in your browser (usually at `http://localhost:4321/`).

    > Note: build-only artifacts (e.g. `sitemap-0.xml`) do not exist in dev mode. To preview the production output, run `npm run build && npm run start`.

## 📝 Content Management (CMS)

The site's content is managed with [AstroCMS](https://github.com/lonestone/astrocms), a database-free CMS that edits the MDX files in `src/content/pages/` directly (with visual editing, media uploads, and Git commit/push from the browser). Start it with `npm run astrocms` → <http://localhost:4001/astrocms>.

MDX files must not import components — they are provided via `<Content components={mdxComponents} />`, which auto-discovers everything in `src/components/` (see `src/components/index.ts`).

📖 Full documentation: [CMS.md](./CMS.md)

## 📂 Project Structure

- **`public/`**: Static assets served as-is (`CNAME`, `favicon.png`, `robots.txt`).
- **`src/pages/`**: Routing only — no page content.
  - `[...slug].astro`: Catch-all route serving every English MDX entry from the `pages` content collection.
  - `de/[...slug].astro`: Same for German entries; additionally emits noindex redirect pages for English-only slugs (e.g. `/de/contact/` → `/contact/`).
  - `404.astro`: Custom not-found page.
- **`src/content/pages/`**: All page content as MDX — English at the top level, German under `de/`. This is what AstroCMS edits.
- **`src/components/`**: Reusable UI components (`MainLayout.astro`, `Navigation.astro`, `CookieConsent.astro`, …). `index.ts` auto-discovers them into `mdxComponents` for use in MDX.
- **`src/styles/`**: Plain CSS — `global.css` plus one stylesheet per page.
- **`test/build-tests.js`**: Zero-dependency test suite that validates the built `dist/` output.

## ✨ Key Features & Sections

The website is divided into several core areas:

1.  **Home Page (`/`):**
    - **Hero Section:** Prominently features "Morning Ashtanga Yoga (Mysore style) in Berlin."
    - **Introduction:** A supportive welcome to the Shala.
    - **Schedule:** Displays class times and the location (Three Boons Studio, Berlin).
    - **Pricing:** Details various membership options (Trial Month, Unlimited Month, 12x Month, Drop-In, etc.) with a special note about financial discounts.

2.  **About Page (`/about`):**
    - Profiles Elinore Burke, the Authorized-Level 2 Ashtanga Yoga Teacher.
    - Highlights her extensive background, training in Mysore, India, and qualifications (Yoga Therapy, Mindfulness Meditation).
    - Includes testimonials to build trust and community.

## 🎨 Design & Styling

- Plain, hand-written CSS: `src/styles/global.css` plus per-page stylesheets (e.g. `retreats.css`, `gdpr.css`). No CSS framework.
- The color palette is defined by CSS variables, emphasizing primary and secondary colors relevant to yoga and mindfulness.

## 🏗️ Build, Test & Deployment

```bash
npm run build   # builds to dist/ (postbuild runs Prettier on the HTML output)
npm test        # validates the built dist/ — run after npm run build
npm run start   # serves the built site locally (astro preview)
```

### Deployment

- **GitHub Pages** (primary): automatic on push to `main` via `.github/workflows/deploy.yml`. The Web3Forms key is injected from the GitHub variable `PUBLIC_WEB3FORMS_GITHUB_KEY`.
- **GoDaddy SFTP** (manual): `.github/workflows/deploy-godaddy.yml`, triggered from the Actions tab. Uses `PUBLIC_WEB3FORMS_GODADDY_KEY`.

> ⚠️ The two targets are deployed independently — after a GoDaddy deploy, the SFTP copy can drift from GitHub Pages until it is re-run.

### 🧪 Linting and Formatting

The project uses **Prettier** to ensure consistent code formatting. The build process includes a post-build formatting step for `dist/`; you can also format files manually with `npx prettier --write <file>`.
