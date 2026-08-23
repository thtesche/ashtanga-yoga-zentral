# CMS Documentation (AstroCMS)

This website uses [**AstroCMS**](https://github.com/lonestone/astrocms) (npm package [`astrocms`](https://www.npmjs.com/package/astrocms), currently v0.1.x) as its headless CMS.

AstroCMS is a **database-free** CMS for Astro: content lives as Markdown/MDX files directly in the repository, and AstroCMS edits exactly those files. There is no database and no export/import cycle — what you change in the CMS is the state of `src/content/`.

## Core Features

- **Visual MDX editor** with a frontmatter form generated automatically from the Zod schemas in [`src/content.config.ts`](src/content.config.ts)
- **File tree browser** for all content collections
- **Component insertion**: your own Astro components from `src/components/` can be inserted into MDX with prop and slot editing
- **Media upload** to the configured assets directory (`src/assets/`)
- **Git integration**: status, diff, stage, commit, and push directly from the browser UI
- **Optional Claude Code agent** for AI-assisted drafting, rewriting, and fixing content

## Prerequisites

- Node.js 20+
- Installed dependencies: `npm install`

## Starting the CMS Locally

The project already has an npm script set up for this:

```bash
npm run astrocms
```

The CMS UI starts at **<http://localhost:4001/astrocms>**.

- Different port: `npx astrocms --port 5000`
- For a live preview of the website, start the dev server in parallel: `npm run dev` (runs at <http://localhost:4321>)
- A `.env` file in the project root is loaded automatically (shell variables take precedence)

> **Note:** Locally, AstroCMS operates on the current working directory, i.e. it edits your local Git working copy. Commits and pushes from the CMS UI use your normal local Git credentials.

## Project Configuration (`astrocms.json`)

AstroCMS reads its configuration from [`astrocms.json`](astrocms.json) in the project root:

```json
{
  "contentDir": "src/content",
  "contentConfig": "src/content.config.ts",
  "assetsDir": "src/assets",
  "componentsDir": "src/components"
}
```

| Field           | Meaning in this project                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `contentDir`    | Directory containing the content collections → `src/content/`                            |
| `contentConfig` | Path to the Zod schema file → `src/content.config.ts` (source for the frontmatter forms) |
| `assetsDir`     | Target directory for media uploads → `src/assets/` (images land in `src/assets/images/`) |
| `componentsDir` | Astro components available in the MDX editor → `src/components/`                         |

Every field can additionally be overridden via environment variables (`ASTROCMS_CONTENT_DIR`, `ASTROCMS_CONTENT_CONFIG`, `ASTROCMS_ASSETS_DIR`, `ASTROCMS_COMPONENTS_DIR`) — mainly relevant for Docker deployments.

## Content Structure

All website pages (EN + DE) live as MDX files in a **single** content collection named `pages`:

```
src/content/pages/
├── index.mdx          → EN home page         (ID: "index")
├── about.mdx          → /about               (ID: "about")
├── contact.mdx        → /contact             (ID: "contact")
├── faq.mdx            → /faq                 (ID: "faq")
├── gdpr.mdx           → /gdpr                (ID: "gdpr")
├── legal_notice.mdx   → /legal_notice        (ID: "legal_notice")
├── moondays.mdx       → /moondays            (ID: "moondays")
├── retreats.mdx       → /retreats            (ID: "retreats")
└── de/                → German pages under /de/
    ├── index.mdx      → /de/                 (ID: "de")
    ├── ueber_uns.mdx  → /de/ueber_uns        (ID: "de/ueber_uns")
    ├── kontakt.mdx    → /de/kontakt          (ID: "de/kontakt")
    ├── faq.mdx        → /de/faq              (ID: "de/faq")
    ├── datenschutz.mdx→ /de/datenschutz      (ID: "de/datenschutz")
    ├── impressum.mdx  → /de/impressum        (ID: "de/impressum")
    ├── moondays.mdx   → /de/moondays         (ID: "de/moondays")
    └── retreats.mdx   → /de/retreats         (ID: "de/retreats")
```

**ID rules:** The entry ID is derived from the file path relative to `src/content/pages/` — without the `.mdx` extension, using `/`. The German home page has the ID `de`; all other German pages start with `de/`.

**Frontmatter schema** (defined in [`src/content.config.ts`](src/content.config.ts)):

| Field         | Type   | Required                                        |
| ------------- | ------ | ----------------------------------------------- |
| `title`       | String | yes — used as the page title (browser tab, SEO) |
| `description` | String | yes — used as the meta description (SEO)        |

The CMS generates the frontmatter form in the editor automatically from this schema. New required fields in the schema will appear there accordingly.

**Rendering:** The MDX files are not served as routes directly; they are rendered through two dynamic routes:

- [`src/pages/[...slug].astro`](src/pages/%5B...slug%5D.astro) — serves all English pages (every entry without the `de/` prefix; the ID `index` maps to the empty slug)
- [`src/pages/de/[...slug].astro`](src/pages/de/%5B...slug%5D.astro) — serves all German pages under `/de/`

Both routes render the content with `<Content components={mdxComponents} />`.

## Editing Pages

1. Start `npm run astrocms` and open <http://localhost:4001/astrocms>
2. Select the desired MDX file in the **file tree** (e.g. `pages/retreats.mdx`)
3. Edit the text in the **visual editor**; the frontmatter form (at the top) handles `title` and `description`
4. Changes are written directly to the file — they show up immediately in the dev server (`npm run dev`)

### Using Components in MDX

All `.astro` files in `src/components/` are discovered automatically (see [`src/components/index.ts`](src/components/index.ts)) and are available in the CMS editor — with prop and slot editing. New components become available without any extra configuration as soon as the file is in the folder.

> **Best practice:** Do **not** import components into MDX files via `import`; pass them through `<Content components={mdxComponents} />` instead (as the routes already do). AstroCMS hides import statements in the visual editor — pages that rely on imports inside the MDX file cannot be fully managed from the editor.

### Uploading Media

Images and other assets can be uploaded via the CMS upload area. Files are written to `src/assets/` (configured via `assetsDir`) and can then be referenced in MDX.

## Git Workflow in the CMS UI

AstroCMS can handle the entire commit process from the browser:

1. Show **status** (changed files)
2. Review the **diff** of the changes
3. **Stage** the changes
4. **Commit** with a commit message
5. **Push** (locally: using your Git credentials; Docker mode: using `GIT_PAT`)

This lets you push content changes to the GitHub repository directly from the CMS, without a terminal.

## Creating New Pages

1. Create the **English page** as `src/content/pages/<slug>.mdx` (via the file tree in the CMS or locally)
2. Create the **German page** as `src/content/pages/de/<slug>.mdx`
3. Set the required frontmatter in both files: `title` and `description`
4. The page is served as a route automatically on the next build — no routing configuration needed

**i18n fallback:** For every English page that has **no German counterpart with the same slug**, a redirect to the English page is generated under `/de/<slug>` (e.g. `/de/about/` → `/about/`). Page pairs with different slugs (e.g. `gdpr` EN ↔ `datenschutz` DE) are served independently and do not link to each other automatically.

## AI Agent (Optional)

AstroCMS can be connected to **Claude Code** for AI-assisted drafting, rewriting, and fixing of content. The integration is optional and requires a Claude Code login (persisted locally or in the Docker volume `/data/claude`).

## Deployment (Docker)

For production access to the CMS, use the official image from the GitHub Container Registry: `ghcr.io/lonestone/astrocms` (tags: `latest`, `X.Y.Z`, `X.Y`).

```yaml
# docker compose.yml (example)
services:
  cms:
    image: ghcr.io/lonestone/astrocms:latest
    ports:
      - "4001:4001"
    environment:
      - GIT_REPO_URL=https://github.com/<user>/<repo>
      - GIT_BRANCH=main
      - GIT_PAT=${GIT_PAT}
      - ASTROCMS_PASSWORD=<secret-password>
    volumes:
      - astrocms-data:/data
    restart: unless-stopped

volumes:
  astrocms-data:
```

Key environment variables:

| Variable                                 | Description                                                                                                   | Default                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `GIT_REPO_URL`                           | URL of the Git repository (cloned into the container)                                                         | _(auto-detected)_               |
| `GIT_BRANCH`                             | Branch to work on                                                                                             | `main`                          |
| `GIT_PAT`                                | GitHub Personal Access Token (Contents: Read and write)                                                       | _(none)_                        |
| `ASTROCMS_PASSWORD`                      | Password protection for the CMS instance                                                                      | _(none)_                        |
| `ASTROCMS_DEV_CMD` / `ASTROCMS_DEV_PORT` | Optional: start the website dev server inside the container and proxy it under `/` (CMS stays at `/astrocms`) | _(none)_ / `4321`               |
| `GIT_USER_NAME` / `GIT_USER_EMAIL`       | Commit author/email inside the container                                                                      | `AstroCMS` / `cms@astrocms.dev` |

**Generating a GitHub PAT:** GitHub → Settings → Developer settings → Personal access tokens → Fine-grained token, repository access limited to this repo only, permission **Contents: Read and write**.

**Stateless mode:** Without the `astrocms-data` volume, the container is fully disposable (fresh clone on every start). In that case: anything committed in the CMS but not pushed is lost on restart — "Commit and push" is the only safe workflow.

## Verifying Changes

After content changes (in the CMS or locally), before pushing:

```bash
npm run build   # generates dist/
npm test        # checks the build output (test/build-tests.js)
```

The tests verify, among other things, that all pages (EN + DE) build correctly and that the i18n fallbacks work.
