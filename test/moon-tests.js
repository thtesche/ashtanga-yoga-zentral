/**
 * Unit tests for the Moondays calculation (`src/lib/moon.js`, #23/#24).
 * Run with: node test/moon-tests.js
 *
 * Zero dependencies — pure Node.js. The expected moon dates are the
 * published new/full moon dates for Europe/Berlin in 2026, so the test also
 * guards the accuracy of the phase calculation itself.
 */

import {
  buildMoonCalendar,
  buildCorrectionMap,
  formatDateLabel,
  formatMonthLabel,
  getMonthWindow,
} from "../src/lib/moon.js";

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

function assertEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  assert(a === e, `${message} (expected ${e}, got ${a})`);
}

function assertThrows(fn, message) {
  try {
    fn();
    assert(false, `${message} (no error thrown)`);
  } catch {
    assert(true, message);
  }
}

/** All `type:iso` entries of a calendar, in display order. */
function flatEvents(calendar) {
  return calendar.flatMap((month) =>
    month.events.map((event) => `${event.type}:${event.iso}`),
  );
}

// ── Month window (#23: six months, Europe/Berlin, year rollover) ──
console.log("\n🌙 Moon calculation tests\n");
console.log("Month window:");

const window = getMonthWindow(Date.UTC(2026, 9, 7, 12));
assertEqual(
  window.map((m) => m.key),
  ["2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03"],
  "six months from the current month, crossing the year boundary",
);

// 2026-12-31 23:00 UTC is already January 1st in Berlin (CET).
const newYearsEve = getMonthWindow(Date.UTC(2026, 11, 31, 23));
assertEqual(
  newYearsEve.map((m) => m.key),
  ["2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06"],
  "Berlin date decides the start month around the year boundary",
);

// Berlin is on CEST (UTC+2) in July: 22:30 UTC is already August 1st there.
const summerBoundary = getMonthWindow(Date.UTC(2026, 6, 31, 22, 30));
assertEqual(
  summerBoundary[0].key,
  "2026-08",
  "summer (DST) boundary uses Berlin date",
);

// Berlin is on CET (UTC+1) in January: 23:30 UTC is already February 1st there.
const winterBoundary = getMonthWindow(Date.UTC(2026, 0, 31, 23, 30));
assertEqual(
  winterBoundary[0].key,
  "2026-02",
  "winter boundary uses Berlin date",
);
assert(getMonthWindow(Date.now()).length === 6, "always exactly six months");

// ── Phase calculation (published Berlin ephemeris 2026) ─────────────
console.log("\nMoon phases 2026 (Europe/Berlin):");

const PHASES_2026 = [
  "full:2026-01-03",
  "new:2026-01-18",
  "full:2026-02-01",
  "new:2026-02-17",
  "full:2026-03-03",
  "new:2026-03-19",
  "full:2026-04-02",
  "new:2026-04-17",
  "full:2026-05-01",
  "new:2026-05-16",
  "full:2026-05-31",
  "new:2026-06-15",
  "full:2026-06-30",
];

assertEqual(
  flatEvents(buildMoonCalendar({ now: Date.UTC(2026, 0, 5, 12) })),
  PHASES_2026,
  "Jan–Jun 2026 dates match the published ephemeris",
);

assertEqual(
  flatEvents(buildMoonCalendar({ now: Date.UTC(2026, 9, 1, 12) })).slice(0, 4),
  ["new:2026-10-10", "full:2026-10-26", "new:2026-11-09", "full:2026-11-24"],
  "Oct 2026 – Mar 2027 window contains the corrected October dates",
);

// EN and DE must share the exact same data basis (#23).
const en = buildMoonCalendar({ locale: "en", now: Date.UTC(2026, 0, 5, 12) });
const de = buildMoonCalendar({ locale: "de", now: Date.UTC(2026, 0, 5, 12) });
assertEqual(flatEvents(en), flatEvents(de), "EN and DE render identical dates");

for (const month of en) {
  let previous = 0;
  let sorted = true;
  for (const event of month.events) {
    if (event.day < previous) sorted = false;
    previous = event.day;
  }
  assert(sorted, `events in ${month.key} are sorted by day`);
}

// ── Formatting (#23: month name + two-digit year, locale aware) ─────
console.log("\nFormatting:");

assertEqual(
  [
    formatMonthLabel("en", 2026, 9),
    formatMonthLabel("en", 2027, 1),
    formatMonthLabel("de", 2026, 10),
    formatMonthLabel("de", 2027, 1),
  ],
  ["September 26", "January 27", "Oktober 26", "Januar 27"],
  "month headings are month name + two-digit year",
);

assertEqual(
  [
    formatDateLabel("en", { year: 2026, month: 1, day: 3 }),
    formatDateLabel("de", { year: 2026, month: 1, day: 3 }),
  ],
  ["Sat 3", "Sa. 3"],
  "event dates use the locale's weekday format",
);

assertThrows(
  () => formatMonthLabel("fr", 2026, 1),
  "unknown locales are rejected",
);

// ── Corrections (#24) ───────────────────────────────────────────────
console.log("\nCorrections:");

const now = Date.UTC(2026, 0, 5, 12);
const plain = buildMoonCalendar({ now });

assertEqual(
  buildMoonCalendar({ now, corrections: [] }),
  plain,
  "an empty correction list leaves the output unchanged",
);

const shiftedBack = buildMoonCalendar({
  now,
  corrections: [{ date: "2026-03-03", adjustment: "-1" }],
});
assert(
  flatEvents(shiftedBack).includes("full:2026-03-02") &&
    !flatEvents(shiftedBack).includes("full:2026-03-03"),
  '"-1" moves the calculated date one day earlier',
);

const shiftedForward = buildMoonCalendar({
  now,
  corrections: [{ date: "2026-03-03", adjustment: "+1" }],
});
assert(
  flatEvents(shiftedForward).includes("full:2026-03-04") &&
    !flatEvents(shiftedForward).includes("full:2026-03-03"),
  '"+1" moves the calculated date one day later',
);

const numeric = buildMoonCalendar({
  now,
  corrections: [{ date: "2026-03-03", adjustment: -1 }],
});
assertEqual(
  flatEvents(numeric),
  flatEvents(shiftedBack),
  'hand-written numeric adjustments (-1 / 1) behave like "-1" / "+1"',
);

// A correction on the last day of a month moves the entry into the next card.
const may = Date.UTC(2026, 4, 1, 12);
const crossed = buildMoonCalendar({
  now: may,
  corrections: [{ date: "2026-05-31", adjustment: "+1" }],
});
const june = crossed.find((m) => m.key === "2026-06");
assert(
  june.events.some((event) => event.iso === "2026-06-01"),
  "a month-boundary correction shows up in the following month's card",
);
assert(
  !crossed
    .find((m) => m.key === "2026-05")
    .events.some((e) => e.iso === "2026-05-31"),
  "the corrected date is removed from its original month",
);

assertEqual(
  flatEvents(
    buildMoonCalendar({
      now,
      corrections: [{ date: "2024-06-01", adjustment: "+1" }],
    }),
  ),
  flatEvents(plain),
  "corrections outside the visible window are ignored, not fatal",
);

assertThrows(
  () =>
    buildMoonCalendar({
      now,
      corrections: [
        { date: "2026-03-03", adjustment: "+1" },
        { date: "2026-03-03", adjustment: "-1" },
      ],
    }),
  "two corrections for the same calculated date are a conflict",
);

assertThrows(
  () => buildCorrectionMap([{ date: "2026-03-03", adjustment: "+2" }]),
  "invalid adjustment values are rejected",
);

assertThrows(
  () => buildCorrectionMap([{ date: "03.03.2026", adjustment: "+1" }]),
  "correction dates must be YYYY-MM-DD",
);

// ── Summary ─────────────────────────────────────────────────────────
console.log(`\n${"=".repeat(50)}`);
console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failures.length}`);
if (failures.length > 0) {
  console.log("\nFailures:");
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
} else {
  console.log("\nAll moon tests passed! 🌙");
  process.exit(0);
}
