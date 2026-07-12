// Table-driven tests for src/stats.ts — exact port of
// DenverCoder1/github-readme-streak-stats streak semantics.
import { describe, expect, it } from "vitest";
import { computeStreaks, epochDayNow } from "../src/stats";
import type { StreakResult } from "../src/types";

// ---- test helpers -----------------------------------------------------

/** "YYYY-MM-DD" (UTC) -> epoch day (unix seconds / 86400, integer). */
function toEpochDay(iso: string): number {
  return Math.floor(Date.parse(`${iso}T00:00:00.000Z`) / 86400000);
}

/** Inclusive range of epoch days between two ISO dates. */
function isoRangeDays(startIso: string, endIso: string): number[] {
  const start = toEpochDay(startIso);
  const end = toEpochDay(endIso);
  const days: number[] = [];
  for (let d = start; d <= end; d++) days.push(d);
  return days;
}

/** Build a calendar map from a list of epoch days, all with the same count. */
function cal(days: number[], count = 1): Record<number, number> {
  const out: Record<number, number> = {};
  for (const d of days) out[d] = count;
  return out;
}

const EMPTY: StreakResult = {
  currentStreak: 0,
  currentStreakStart: null,
  currentStreakEnd: null,
  highestStreak: 0,
  highestStreakStart: null,
  highestStreakEnd: null,
  totalActiveDays: 0,
  firstActiveDay: null,
};

// Fixed "today" reference used across the relative-day cases.
const TODAY_ISO = "2026-07-12";
const TODAY = toEpochDay(TODAY_ISO);

// ---- table-driven cases -------------------------------------------------

interface Case {
  name: string;
  calendar: Record<number, number>;
  today: number;
  expected: StreakResult;
}

const cases: Case[] = [
  {
    name: "empty calendar -> all-zero result with nulls, does not throw",
    calendar: {},
    today: TODAY,
    expected: EMPTY,
  },
  {
    name: "single active day = today -> current streak 1",
    calendar: cal([TODAY], 5),
    today: TODAY,
    expected: {
      currentStreak: 1,
      currentStreakStart: TODAY_ISO,
      currentStreakEnd: TODAY_ISO,
      highestStreak: 1,
      highestStreakStart: TODAY_ISO,
      highestStreakEnd: TODAY_ISO,
      totalActiveDays: 1,
      firstActiveDay: TODAY_ISO,
    },
  },
  {
    name: "single active day = yesterday -> current streak 1 (grace survives today's zero)",
    calendar: cal([TODAY - 1], 3),
    today: TODAY,
    expected: {
      currentStreak: 1,
      currentStreakStart: "2026-07-11",
      currentStreakEnd: "2026-07-11",
      highestStreak: 1,
      highestStreakStart: "2026-07-11",
      highestStreakEnd: "2026-07-11",
      totalActiveDays: 1,
      firstActiveDay: "2026-07-11",
    },
  },
  {
    name: "gap today only: 3-day run ending yesterday, today zero -> streak survives, last active yesterday",
    calendar: cal([TODAY - 3, TODAY - 2, TODAY - 1]),
    today: TODAY,
    expected: {
      currentStreak: 3,
      currentStreakStart: "2026-07-09",
      currentStreakEnd: "2026-07-11",
      highestStreak: 3,
      highestStreakStart: "2026-07-09",
      highestStreakEnd: "2026-07-11",
      totalActiveDays: 3,
      firstActiveDay: "2026-07-09",
    },
  },
  {
    name: "last active 4 days ago -> current streak 0 (real user case: grace only covers today)",
    calendar: cal([TODAY - 4], 2),
    today: TODAY,
    expected: {
      currentStreak: 0,
      currentStreakStart: null,
      currentStreakEnd: null,
      highestStreak: 1,
      highestStreakStart: "2026-07-08",
      highestStreakEnd: "2026-07-08",
      totalActiveDays: 1,
      firstActiveDay: "2026-07-08",
    },
  },
  {
    name: "tomorrow active extends the current streak (timezone-ahead grace)",
    calendar: cal([TODAY, TODAY + 1]),
    today: TODAY,
    expected: {
      currentStreak: 2,
      currentStreakStart: TODAY_ISO,
      currentStreakEnd: "2026-07-13",
      highestStreak: 2,
      highestStreakStart: TODAY_ISO,
      highestStreakEnd: "2026-07-13",
      totalActiveDays: 2,
      firstActiveDay: TODAY_ISO,
    },
  },
  {
    name: "only tomorrow active (today itself has no activity) -> still counts as a live 1-day streak",
    calendar: cal([TODAY + 1]),
    today: TODAY,
    expected: {
      currentStreak: 1,
      currentStreakStart: "2026-07-13",
      currentStreakEnd: "2026-07-13",
      highestStreak: 1,
      highestStreakStart: "2026-07-13",
      highestStreakEnd: "2026-07-13",
      totalActiveDays: 1,
      firstActiveDay: "2026-07-13",
    },
  },
  {
    name: "Dec 31 -> Jan 1 year boundary run",
    calendar: cal(isoRangeDays("2026-12-30", "2027-01-01")),
    today: toEpochDay("2027-01-01"),
    expected: {
      currentStreak: 3,
      currentStreakStart: "2026-12-30",
      currentStreakEnd: "2027-01-01",
      highestStreak: 3,
      highestStreakStart: "2026-12-30",
      highestStreakEnd: "2027-01-01",
      totalActiveDays: 3,
      firstActiveDay: "2026-12-30",
    },
  },
  {
    name: "multi-gap history where highest streak != current streak",
    calendar: cal([
      ...isoRangeDays("2026-06-08", "2026-06-12"), // 5-day run, long past -> highest
      TODAY - 2,
      TODAY - 1, // 2-day run ending yesterday -> current (grace survives today)
    ]),
    today: TODAY,
    expected: {
      currentStreak: 2,
      currentStreakStart: "2026-07-10",
      currentStreakEnd: "2026-07-11",
      highestStreak: 5,
      highestStreakStart: "2026-06-08",
      highestStreakEnd: "2026-06-12",
      totalActiveDays: 7,
      firstActiveDay: "2026-06-08",
    },
  },
  {
    name: "future timestamps beyond today+1 are ignored (garbage data)",
    calendar: { ...cal([TODAY]), [TODAY + 5]: 10 },
    today: TODAY,
    expected: {
      currentStreak: 1,
      currentStreakStart: TODAY_ISO,
      currentStreakEnd: TODAY_ISO,
      highestStreak: 1,
      highestStreakStart: TODAY_ISO,
      highestStreakEnd: TODAY_ISO,
      totalActiveDays: 1, // the future entry must NOT be counted
      firstActiveDay: TODAY_ISO,
    },
  },
  {
    name: "count 0 entry for today is not an active day, but grace still keeps yesterday's streak alive",
    calendar: { [TODAY]: 0, [TODAY - 1]: 1 },
    today: TODAY,
    expected: {
      currentStreak: 1,
      currentStreakStart: "2026-07-11",
      currentStreakEnd: "2026-07-11",
      highestStreak: 1,
      highestStreakStart: "2026-07-11",
      highestStreakEnd: "2026-07-11",
      totalActiveDays: 1, // the explicit count:0 entry for today must not be counted
      firstActiveDay: "2026-07-11",
    },
  },
  {
    // Composition of the two independent grace rules: yesterday active, today zero, tomorrow
    // active. Tomorrow already having confirmed activity proves the calendar's data horizon
    // extends past today, so today's zero must be treated as a confirmed break — the grace that
    // normally protects today's not-yet-over zero must NOT also bridge across it into tomorrow's
    // separate run. Regression coverage for a bug where these two graces composed to report a
    // 2-day currentStreak spanning a day with zero verified activity.
    name: "yesterday active + today zero + tomorrow active: grace does not bridge today's confirmed break",
    calendar: { [TODAY - 1]: 1, [TODAY + 1]: 1 },
    today: TODAY,
    expected: {
      currentStreak: 1,
      currentStreakStart: "2026-07-13",
      currentStreakEnd: "2026-07-13",
      highestStreak: 1,
      highestStreakStart: "2026-07-11",
      highestStreakEnd: "2026-07-11",
      totalActiveDays: 2,
      firstActiveDay: "2026-07-11",
    },
  },
  {
    name: "negative count entry is not an active day and (unlike today) still breaks the run",
    calendar: { [TODAY - 2]: 1, [TODAY - 1]: -5, [TODAY]: 1 },
    today: TODAY,
    expected: {
      currentStreak: 1,
      currentStreakStart: TODAY_ISO,
      currentStreakEnd: TODAY_ISO,
      highestStreak: 1,
      highestStreakStart: "2026-07-10",
      highestStreakEnd: "2026-07-10",
      totalActiveDays: 2, // TODAY-2 and TODAY only; the negative-count day doesn't count
      firstActiveDay: "2026-07-10",
    },
  },
];

describe("computeStreaks", () => {
  for (const { name, calendar, today, expected } of cases) {
    it(name, () => {
      expect(computeStreaks(calendar, today)).toEqual(expected);
    });
  }

  it("ignores non-integer / non-numeric calendar keys defensively", () => {
    const dirty = {
      ...cal([TODAY - 1]),
      // simulate malformed upstream data landing in the record
      notADay: 99,
    } as unknown as Record<number, number>;
    expect(computeStreaks(dirty, TODAY)).toEqual({
      currentStreak: 1,
      currentStreakStart: "2026-07-11",
      currentStreakEnd: "2026-07-11",
      highestStreak: 1,
      highestStreakStart: "2026-07-11",
      highestStreakEnd: "2026-07-11",
      totalActiveDays: 1,
      firstActiveDay: "2026-07-11",
    });
  });

  // ---- the real fixture ---------------------------------------------
  // Active days: 2026-01-09, 2026-01-10, then a consecutive run
  // 2026-01-12 .. 2026-02-18 (38 days), then 2026-07-07, 2026-07-08.
  // today = 2026-07-12 -> last active day is 4 days before today, so the
  // current streak resets to 0 (same shape as the "4 days ago" case above);
  // the highest streak is the 38-day January/February run.
  it("real fixture: current 0, highest 38 (2026-01-12..2026-02-18), totalActiveDays 42", () => {
    const leadDays = [toEpochDay("2026-01-09"), toEpochDay("2026-01-10")]; // 2 days
    const longRun = isoRangeDays("2026-01-12", "2026-02-18"); // 38 days
    const julyDays = [toEpochDay("2026-07-07"), toEpochDay("2026-07-08")]; // 2 days
    expect(longRun.length).toBe(38); // sanity on the fixture itself

    const calendar = cal([...leadDays, ...longRun, ...julyDays]);
    const today = toEpochDay("2026-07-12");

    const result = computeStreaks(calendar, today);

    expect(result).toEqual({
      currentStreak: 0,
      currentStreakStart: null,
      currentStreakEnd: null,
      highestStreak: 38,
      highestStreakStart: "2026-01-12",
      highestStreakEnd: "2026-02-18",
      totalActiveDays: 42, // 2 lead days + 38-day run + 2 July days
      firstActiveDay: "2026-01-09",
    });
  });
});

describe("epochDayNow", () => {
  it("returns the current UTC epoch day, consistent with Date.now()", () => {
    const before = Math.floor(Date.now() / 86400000);
    const actual = epochDayNow();
    const after = Math.floor(Date.now() / 86400000);
    expect(Number.isInteger(actual)).toBe(true);
    expect(actual).toBeGreaterThanOrEqual(before);
    expect(actual).toBeLessThanOrEqual(after);
  });
});
