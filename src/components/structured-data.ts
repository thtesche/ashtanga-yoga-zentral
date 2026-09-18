/**
 * Central registry of JSON-LD structured data, keyed by content entry id.
 *
 * The dynamic routes (`src/pages/[...slug].astro`, `src/pages/de/[...slug].astro`)
 * call `getStructuredData()` and pass the result to `<MainLayout>`, so MDX
 * files stay free of schema.org boilerplate (and the AstroCMS editor never
 * shows it).
 *
 * Notes:
 * - Key order inside the objects is load-bearing: `JsonLd.astro` serializes
 *   with `JSON.stringify`, and the output must stay byte-identical to what
 *   the MDX files emitted before this registry existed.
 * - The FAQ pages are intentionally NOT listed here: `FaqAccordion.astro`
 *   emits its own FAQPage schema derived from the visible items (single
 *   source of truth). Listing them here would duplicate the block.
 */

const SITE = "https://www.ashtangayogazentralberlin.com";

interface PageData {
  title: string;
  description: string;
}

/** Shared studio address (PostalAddress) used by several schemas. */
const STUDIO_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Brunnenstr. 29 (3.Hinterhof)",
  addressLocality: "Berlin",
  postalCode: "10119",
  addressCountry: "DE",
};

/** Full YogaStudio schema for the home pages (EN + DE). */
function yogaStudioHome(description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "YogaStudio",
    name: "Ashtanga Yoga Zentral",
    description,
    url,
    priceRange: "€90-€135",
    address: STUDIO_ADDRESS,
    geo: { "@type": "GeoCoordinates", latitude: 52.5304, longitude: 13.3967 },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "06:30",
        closes: "09:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "07:30",
        closes: "09:45",
      },
    ],
  };
}

/** Minimal YogaStudio reference used inside `@graph` (retreat pages). */
function yogaStudioRef(url: string) {
  return {
    "@type": "YogaStudio",
    name: "Ashtanga Yoga Zentral",
    url,
    address: STUDIO_ADDRESS,
  };
}

/** Elinore Burke (Person) — EN/DE variants. */
function person(
  description: string,
  pageUrl: string,
  studioUrl: string,
  jobTitle: string,
  knowsAbout: string[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${pageUrl}#elinore-burke`,
    name: "Elinore Burke",
    description,
    jobTitle,
    url: pageUrl,
    knowsAbout,
    worksFor: {
      "@type": "YogaStudio",
      name: "Ashtanga Yoga Zentral",
      url: studioUrl,
    },
  };
}

/** ContactPage with the studio as mainEntity. */
function contactPage(name: string, pageUrl: string, studioUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name,
    url: pageUrl,
    mainEntity: {
      "@type": "YogaStudio",
      name: "Ashtanga Yoga Zentral",
      url: studioUrl,
      address: STUDIO_ADDRESS,
    },
  };
}

/** JSON-LD per entry id. Entries without a template emit no structured data. */
const TEMPLATES: Record<string, (data: PageData) => object> = {
  index: (d) => yogaStudioHome(d.description, `${SITE}/`),
  de: (d) => yogaStudioHome(d.description, `${SITE}/de/`),
  about: (d) =>
    person(
      d.description,
      `${SITE}/about/`,
      `${SITE}/`,
      "Authorized Level 2 Ashtanga Yoga Teacher & Yoga Therapist",
      [
        "Ashtanga Yoga",
        "Mysore Style Practice",
        "Yoga Therapy",
        "Mindfulness Meditation",
      ],
    ),
  "de/ueber_uns": (d) =>
    person(
      d.description,
      `${SITE}/de/ueber_uns/`,
      `${SITE}/de/`,
      "Autorisierte Level 2 Ashtanga Yoga Lehrerin & Yogatherapeutin",
      [
        "Ashtanga Yoga",
        "Mysore Style Praxis",
        "Yogatherapie",
        "Achtsamkeitsmeditation",
      ],
    ),
  contact: () =>
    contactPage(
      "Contact – Ashtanga Yoga Zentral Berlin",
      `${SITE}/contact/`,
      `${SITE}/`,
    ),
  "de/kontakt": () =>
    contactPage(
      "Kontakt – Ashtanga Yoga Zentral Berlin",
      `${SITE}/de/kontakt/`,
      `${SITE}/de/`,
    ),
  retreats: () => ({
    "@context": "https://schema.org",
    "@graph": [yogaStudioRef(`${SITE}/`)],
  }),
  "de/retreats": () => ({
    "@context": "https://schema.org",
    "@graph": [yogaStudioRef(`${SITE}/de/`)],
  }),
};

/**
 * Returns the JSON-LD object for a content entry, or `undefined` when the
 * page has no structured data (legal pages, moondays, FAQ — see notes above).
 */
export function getStructuredData(entryId: string, data: PageData) {
  const build = TEMPLATES[entryId];
  return build ? build(data) : undefined;
}
