/**
 * Moon phase calculation and the Moondays calendar model (#23, #24).
 *
 * Framework-free single source of truth for `MoonCalendar.astro` and for the
 * automated tests (`test/moon-tests.js`), so EN and DE render exactly the same
 * dates and the logic can be exercised without a build.
 *
 * Phases are derived from the geocentric ecliptic longitudes of Sun and Moon
 * (low-precision series after Paul Schlyter, "How to compute planetary
 * positions" — about 1–2 arcmin, i.e. a few minutes of phase time) and are
 * then projected onto the calendar in `Europe/Berlin` so a UTC day boundary
 * never selects the wrong month or day.
 *
 * Corrections (#24) are editorial shifts of a single calculated date by one
 * day; they only change the displayed date, never the calculation itself.
 *
 * Plain ESM JavaScript with JSDoc so both Astro/Vite and Node (tests) can use
 * it without a TypeScript build step.
 */

/** IANA timezone all dates are projected onto (#23). */
export const TIMEZONE = "Europe/Berlin";

/** How many months the calendar shows by default (#23). */
export const MONTH_WINDOW = 6;

/** Values an editorial correction may carry (#24). */
export const ADJUSTMENTS = ["+1", "-1"];

const DAY_MS = 86400000;
const DEG = Math.PI / 180;
const LOCALE_TAGS = { en: "en-US", de: "de-DE" };

/** Wrap an angle to [0, 360). */
function norm360(deg) {
  return ((deg % 360) + 360) % 360;
}

/** Wrap an angle to (-180, 180]. */
function wrap180(deg) {
  return ((deg + 180) % 360) - 180 + ((deg + 180) % 360 < 0 ? 360 : 0);
}

function sinDeg(deg) {
  return Math.sin(deg * DEG);
}

function cosDeg(deg) {
  return Math.cos(deg * DEG);
}

function atan2Deg(y, x) {
  return norm360(Math.atan2(y, x) / DEG);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

// ── Astronomy ─────────────────────────────────────────────────────

/**
 * Schlyter day number: 0.0 = 2000 Jan 0.0 UT (1999-12-31 00:00 UT).
 * @param {number} ms epoch in milliseconds (UTC)
 */
function dayNumber(ms) {
  return ms / DAY_MS + 2440587.5 - 2451543.5;
}

/**
 * Geocentric ecliptic longitude of the Sun (degrees).
 * @param {number} d day number
 */
function sunLongitude(d) {
  const w = 282.9404 + 4.70935e-5 * d;
  const M = norm360(356.047 + 0.9856002585 * d);
  const e = 0.016709 - 1.151e-9 * d;
  // First-order Kepler solve; e is small enough that one step suffices.
  const E = M + e * (180 / Math.PI) * sinDeg(M) * (1 + e * cosDeg(M));
  const xv = cosDeg(E) - e;
  const yv = Math.sqrt(1 - e * e) * sinDeg(E);
  return { lon: norm360(atan2Deg(yv, xv) + w), M, w };
}

/**
 * Geocentric ecliptic longitude of the Moon including the main perturbations
 * (degrees).
 * @param {number} d day number
 */
function moonLongitude(d) {
  const N = norm360(125.1228 - 0.0529538083 * d);
  const inclination = 5.1454;
  const w = norm360(318.0634 + 0.1643573223 * d);
  const e = 0.0549;
  const M = norm360(115.3654 + 13.0649929509 * d);

  const E = M + e * (180 / Math.PI) * sinDeg(M) * (1 + e * cosDeg(M));
  const xv = 60.2666 * (cosDeg(E) - e);
  const yv = 60.2666 * Math.sqrt(1 - e * e) * sinDeg(E);
  const v = atan2Deg(yv, xv);

  const vw = v + w;
  const xh =
    cosDeg(N) * cosDeg(vw) - sinDeg(N) * sinDeg(vw) * cosDeg(inclination);
  const yh =
    sinDeg(N) * cosDeg(vw) + cosDeg(N) * sinDeg(vw) * cosDeg(inclination);
  const zh = sinDeg(vw) * sinDeg(inclination);

  const sun = sunLongitude(d);
  const D = norm360(M + w + N - (sun.M + sun.w)); // mean elongation
  const F = norm360(M + w); // argument of latitude (Lm - N)

  const perturbation =
    -1.274 * sinDeg(M - 2 * D) + // evection
    0.658 * sinDeg(2 * D) + // variation
    -0.186 * sinDeg(sun.M) + // yearly equation
    -0.059 * sinDeg(2 * M - 2 * D) +
    -0.057 * sinDeg(M - 2 * D + sun.M) +
    0.053 * sinDeg(M + 2 * D) +
    0.046 * sinDeg(2 * D - sun.M) +
    0.041 * sinDeg(M - sun.M) +
    -0.035 * sinDeg(D) +
    -0.031 * sinDeg(M + sun.M) +
    -0.015 * sinDeg(2 * F - 2 * D) +
    0.011 * sinDeg(M - 4 * D);

  return norm360(atan2Deg(yh, xh) + perturbation);
}

/** Moon − Sun elongation wrapped to (-180, 180]; 0 = new moon, 180 = full. */
function elongation(d) {
  return wrap180(moonLongitude(d) - sunLongitude(d).lon);
}

/**
 * All new/full moon instants in [fromMs, toMs].
 *
 * The elongation is sampled every 6 hours (it grows by ~3° per step, so
 * phase crossings are always caught and never wrap inside a step) and each
 * bracketing step is bisected to the minute.
 *
 * @param {number} fromMs
 * @param {number} toMs
 * @returns {{ time: number, type: 'new' | 'full' }[]}
 */
export function findMoonPhases(fromMs, toMs) {
  const step = 6 * 3600000;
  const events = [];
  let t = fromMs;
  let elong = elongation(dayNumber(t));
  let unwrapped = elong;

  while (t + step <= toMs) {
    const nextT = t + step;
    const nextElong = elongation(dayNumber(nextT));
    const delta = wrap180(nextElong - elong);
    const start = unwrapped;
    const end = unwrapped + delta;

    for (const [offset, type] of [
      [0, "new"],
      [180, "full"],
    ]) {
      const target = offset + 360 * Math.ceil((start - offset) / 360);
      if (target > start && target <= end) {
        events.push({
          time: bisectPhase(t, nextT, elong, start, target),
          type,
        });
      }
    }

    t = nextT;
    elong = nextElong;
    unwrapped = end;
  }

  return events.sort((a, b) => a.time - b.time);
}

/**
 * Bisect one bracketed crossing of `target` (unwrapped elongation) between
 * `loMs` and `hiMs`. `baseElong`/`baseUnwrapped` anchor the unwrapping at
 * `loMs`; the step is small enough that no wrap occurs inside it.
 */
function bisectPhase(loMs, hiMs, baseElong, baseUnwrapped, target) {
  const at = (ms) =>
    baseUnwrapped + wrap180(elongation(dayNumber(ms)) - baseElong);
  let lo = loMs;
  let hi = hiMs;
  for (let i = 0; i < 40 && hi - lo > 60000; i++) {
    const mid = (lo + hi) / 2;
    if (at(mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ── Calendar dates in Europe/Berlin ───────────────────────────────

/**
 * @typedef {{ year: number, month: number, day: number }} DateParts
 */

/**
 * Calendar date of an instant in `Europe/Berlin`.
 * @param {number} ms
 * @returns {DateParts}
 */
function berlinParts(ms) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(ms));
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Shift a calendar date by whole days (DST-safe, no 24h arithmetic). */
function addDays(parts, days) {
  const shifted = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day + days),
  );
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function toISO(parts) {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

/**
 * The visible month window: `months` months starting with the current month
 * in `Europe/Berlin`.
 * @param {number} now epoch ms
 * @param {number} months
 * @returns {{ year: number, month: number, key: string }[]}
 */
export function getMonthWindow(now, months = MONTH_WINDOW) {
  const current = berlinParts(now);
  const window = [];
  let { year, month } = current;
  for (let i = 0; i < months; i++) {
    window.push({ year, month, key: `${year}-${pad2(month)}` });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return window;
}

// ── Locale formatting ─────────────────────────────────────────────

function localeTag(locale) {
  const tag = LOCALE_TAGS[locale];
  if (!tag) throw new Error(`MoonCalendar: unknown locale "${locale}"`);
  return tag;
}

/** Month heading, e.g. "Oktober 26" / "October 26". */
export function formatMonthLabel(locale, year, month) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    month: "long",
    year: "2-digit",
    timeZone: "UTC",
  }).format(Date.UTC(year, month - 1, 1));
}

/** Event date, e.g. "Sa 3" / "Sat 3" (short weekday + day of month). */
export function formatDateLabel(locale, parts) {
  const format = new Intl.DateTimeFormat(localeTag(locale), {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const found = format.formatToParts(
    Date.UTC(parts.year, parts.month - 1, parts.day),
  );
  const weekday = found.find((p) => p.type === "weekday")?.value ?? "";
  const day = found.find((p) => p.type === "day")?.value ?? "";
  return `${weekday} ${day}`.trim();
}

// ── Editorial corrections (#24) ───────────────────────────────────

/**
 * Accepts "+1"/"-1" (what AstroCMS offers as a select) as well as the numeric
 * 1/-1 spelling that hand-written MDX may use.
 */
function normalizeAdjustment(value) {
  if (value === 1 || value === "+1") return 1;
  if (value === -1 || value === "-1") return -1;
  throw new Error(
    `MoonCalendar: invalid adjustment "${value}" (expected "+1" or "-1")`,
  );
}

/**
 * Validate the correction list and index it by the calculated date it refers
 * to. Two corrections for the same date are a conflict and fail the build.
 *
 * @param {{ date: string, adjustment: unknown }[]} corrections
 * @returns {Map<string, number>} ISO date → ±1
 */
export function buildCorrectionMap(corrections) {
  const map = new Map();
  for (const correction of corrections ?? []) {
    const { date } = correction ?? {};
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(
        `MoonCalendar: correction date "${date}" must be YYYY-MM-DD`,
      );
    }
    if (map.has(date)) {
      throw new Error(
        `MoonCalendar: conflicting corrections for ${date} (one per date only)`,
      );
    }
    map.set(date, normalizeAdjustment(correction.adjustment));
  }
  return map;
}

// ── Calendar model ────────────────────────────────────────────────

/**
 * @typedef {object} MoonEvent
 * @property {'new' | 'full'} type
 * @property {string} iso displayed date (YYYY-MM-DD, Europe/Berlin)
 * @property {number} day day of month
 * @property {string} dateLabel localized "weekday day"
 */

/**
 * @typedef {object} MoonMonth
 * @property {number} year
 * @property {number} month 1–12
 * @property {string} key "YYYY-MM"
 * @property {string} label localized month heading incl. 2-digit year
 * @property {boolean} isCurrent true for the month `now` falls into
 * @property {MoonEvent[]} events sorted by day
 */

/**
 * Build the whole calendar model: the visible month window plus all new/full
 * moon dates in it, with optional editorial corrections applied.
 *
 * Corrections that refer to a date outside the window are ignored (the window
 * moves with every build, so stale corrections must not fail it).
 *
 * @param {object} [options]
 * @param {'en' | 'de'} [options.locale]
 * @param {{ date: string, adjustment: unknown }[]} [options.corrections]
 * @param {number} [options.now] epoch ms (injectable for tests)
 * @param {number} [options.months]
 * @returns {MoonMonth[]}
 */
export function buildMoonCalendar({
  locale = "en",
  corrections = [],
  now = Date.now(),
  months = MONTH_WINDOW,
} = {}) {
  const correctionMap = buildCorrectionMap(corrections);
  const window = getMonthWindow(now, months);
  const eventsByKey = new Map(window.map((m) => [m.key, []]));

  // Scan with a ±2 day margin so a correction near a month boundary still
  // finds its calculated date.
  const fromMs = Date.UTC(window[0].year, window[0].month - 1, 1) - 2 * DAY_MS;
  const last = window[window.length - 1];
  const toMs = Date.UTC(last.year, last.month, 1) + 2 * DAY_MS;

  for (const phase of findMoonPhases(fromMs, toMs)) {
    const calculated = berlinParts(phase.time);
    const adjustment = correctionMap.get(toISO(calculated));
    const shown = adjustment ? addDays(calculated, adjustment) : calculated;
    const key = `${shown.year}-${pad2(shown.month)}`;
    const bucket = eventsByKey.get(key);
    // Shifted out of the visible window: nothing to render it in.
    if (!bucket) continue;

    bucket.push({
      type: phase.type,
      iso: toISO(shown),
      day: shown.day,
      dateLabel: formatDateLabel(locale, shown),
    });
  }

  for (const list of eventsByKey.values()) {
    list.sort((a, b) => a.day - b.day);
  }

  const currentKey = toISO(berlinParts(now)).slice(0, 7);
  return window.map((m) => ({
    ...m,
    label: formatMonthLabel(locale, m.year, m.month),
    isCurrent: m.key === currentKey,
    events: eventsByKey.get(m.key),
  }));
}
