/**
 * Simple build-output tests for the Astro site.
 * Run with: node test/build-tests.js
 *
 * Tests read from dist/ (run `npm run build` first).
 * Zero dependencies — pure Node.js fs + path.
 */

import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
// CI builds with --base /ashtanga-yoga-zentral/; local builds use ''
// Note: Astro puts files at root of dist/ regardless of base — base only affects hrefs
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '') || '/';
const failures = [];
let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failures.push(message);
    console.error(`  ✗ ${message}`);
  }
}

function readHTML(relative) {
  return fs.readFileSync(path.join(DIST, relative), 'utf-8');
}

function href(route) {
  // Returns the href as it appears in HTML (e.g. '/ashtanga-yoga-zentral/de/kontakt/')
  const prefix = BASE === '/' ? '' : BASE.replace(/\/$/, '');
  return prefix + (route.startsWith('/') ? route : '/' + route);
}

console.log('\n🧪 Build output tests\n');

// ── Index pages ────────────────────────────────────────────────
console.log('Index pages:');
const enIndex = readHTML('index.html');
assert(enIndex.includes('<html lang="en"'), 'EN index has lang="en"');
assert(enIndex.includes('Ashtanga Yoga Zentral'), 'EN index contains site title');
assert(enIndex.includes('Morning Ashtanga Yoga'), 'EN index has English description');

const deIndex = readHTML('de/index.html');
assert(deIndex.includes('<html lang="de"'), 'DE index has lang="de"');
assert(deIndex.includes('Ashtanga Yoga Zentral'), 'DE index contains site title');
assert(deIndex.includes('Standort'), 'DE index has German footer label "Standort"');
assert(deIndex.includes('Kontakt'), 'DE index has German "Kontakt"');

// ── Language switcher ──────────────────────────────────────────
console.log('\nLanguage switcher:');
assert(enIndex.includes('title="Deutsch"'), 'EN index has Deutsch switcher link');
assert(enIndex.includes('title="English"'), 'EN index has English switcher link');
assert(deIndex.includes('title="Deutsch"'), 'DE index has Deutsch switcher link');
assert(deIndex.includes('title="English"'), 'DE index has English switcher link');

// Check that DE page has a link back to EN
assert(
  deIndex.includes('href="../"') || deIndex.includes('href="/"') ||
  deIndex.includes('/ashtanga-yoga-zentral/'),
  'DE index has link to EN home'
);

// ── Navigation labels ──────────────────────────────────────────
console.log('\nNavigation labels:');
assert(enIndex.includes('About Us'), 'EN nav: "About Us"');
assert(enIndex.includes('Retreats'), 'EN nav: "Retreats"');
assert(enIndex.includes('Moondays'), 'EN nav: "Moondays"');
assert(enIndex.includes('Contact'), 'EN nav: "Contact"');

assert(deIndex.includes('Über uns'), 'DE nav: "Über uns"');
assert(deIndex.includes('Retreats'), 'DE nav: "Retreats"');
assert(deIndex.includes('Moondays'), 'DE nav: "Moondays"');
assert(deIndex.includes('Kontakt'), 'DE nav: "Kontakt"');

// ── Route existence ────────────────────────────────────────────
console.log('\nRoute existence:');
const enRoutes = [
  'index.html',
  'about/index.html',
  'contact/index.html',
  'retreats/index.html',
  'moondays/index.html',
  'legal_notice/index.html',
  'gdpr/index.html',
];
const deRoutes = [
  'de/index.html',
  'de/ueber_uns/index.html',
  'de/kontakt/index.html',
  'de/retreats/index.html',
  'de/moondays/index.html',
  'de/impressum/index.html',
  'de/datenschutz/index.html',
];

for (const route of enRoutes) {
  assert(fs.existsSync(path.join(DIST, route)), `EN route exists: /${route}`);
}
for (const route of deRoutes) {
  assert(fs.existsSync(path.join(DIST, route)), `DE route exists: /${route}`);
}

// ── Sitemap ─────────────────────────────────────────────────────
console.log('\nSitemap:');
const sitemapFile = fs.existsSync(path.join(DIST, 'sitemap-0.xml'))
  ? path.join(DIST, 'sitemap-0.xml')
  : path.join(DIST, 'sitemap-index.xml');
assert(fs.existsSync(sitemapFile), 'Sitemap exists');
if (fs.existsSync(sitemapFile)) {
  const sitemap = fs.readFileSync(sitemapFile, 'utf-8');
  assert(sitemap.includes('<?xml'), 'Sitemap is valid XML (has declaration)');
  assert(sitemap.includes('/de/'), 'Sitemap references DE routes');
  assert(sitemap.includes('/about'), 'Sitemap references EN about route');
}

// ── Fallback redirects ──────────────────────────────────────────
console.log('\nFallback redirects (DE → EN):');
const fallbackRoutes = [
  { de: 'de/about/index.html', en: href('/about') },
  { de: 'de/contact/index.html', en: href('/contact') },
  { de: 'de/legal_notice/index.html', en: href('/legal_notice') },
  { de: 'de/gdpr/index.html', en: href('/gdpr') },
];
for (const fb of fallbackRoutes) {
  assert(
    fs.existsSync(path.join(DIST, fb.de)),
    `DE fallback page exists: /${fb.de}`
  );
  const html = readHTML(fb.de);
  assert(
    html.includes('meta http-equiv="refresh"') && html.includes(`url=${fb.en}`),
    `/${fb.de} redirects to ${fb.en}`
  );
}

// ── Language-consistent internal links ───────────────────────────
console.log('\nLanguage-consistent internal links:');
const deRetreats = readHTML('de/retreats/index.html');
assert(
  deRetreats.includes(`href="${href('/de/kontakt')}")`) && !deRetreats.includes(`href="${href('/contact')}`),
  'DE retreats links to /de/kontakt (not /contact)'
);
assert(
  deRetreats.includes(`href="${href('/de/retreats')}"`),
  'DE retreats nav links to /de/retreats'
);
assert(
  deRetreats.includes(`href="${href('/de/ueber_uns')}"`),
  'DE retreats nav links to /de/ueber_uns'
);

const enRetreats = readHTML('retreats/index.html');
assert(
  enRetreats.includes(`href="${href('/contact')}")`) && !enRetreats.includes(`href="${href('/de/kontakt')}`),
  'EN retreats links to /contact (not /de/kontakt)'
);

// ── No BASE_URL concatenation in source ──────────────────────────
console.log('\nNo BASE_URL remnants:');
const srcPages = path.join('src', 'pages');
const mdxFiles = fs.readdirSync(srcPages, { recursive: true })
  .filter(f => typeof f === 'string' && f.endsWith('.mdx'))
  .map(f => path.join(srcPages, f));
for (const file of mdxFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  assert(
    !content.includes('import.meta.env.BASE_URL'),
    `${file} has no BASE_URL concatenation`
  );
}

// ── robots.txt ──────────────────────────────────────────────────
console.log('\nrobots.txt:');
assert(fs.existsSync(path.join(DIST, 'robots.txt')), 'robots.txt exists');

// ── Summary ─────────────────────────────────────────────────────
console.log(`\n${'='.repeat(50)}`);
console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failures.length}`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  - ${f}`));
  process.exit(1);
} else {
  console.log('\nAll tests passed! 🎉');
  process.exit(0);
}
