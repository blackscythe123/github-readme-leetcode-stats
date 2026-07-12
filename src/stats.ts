// Streak math for github-readme-leetcode-stats.
// Exact port of DenverCoder1/github-readme-streak-stats semantics:
//   - walk every day (densified, zero-filled) ascending from the first active day
//   - an active day extends the current run; an inactive day resets it UNLESS it is today
//     (grace until the day ends)
//   - tomorrow (todayEpochDay + 1) is included only when it has activity
//     (timezone-ahead grace; it extends the current streak)
// Pure function; the clock is injected via todayEpochDay.

import type { StreakResult } from "./types";
import { isoFromEpochDay } from "./format";

/** Current UTC epoch day (unix ms / 86400000, floored). */
export function epochDayNow(): number {
  return Math.floor(Date.now() / 86400000);
}

const EMPTY_RESULT: StreakResult = {
  currentStreak: 0,
  currentStreakStart: null,
  currentStreakEnd: null,
  highestStreak: 0,
  highestStreakStart: null,
  highestStreakEnd: null,
  totalActiveDays: 0,
  firstActiveDay: null,
};

/**
 * Compute current/highest streaks from a merged submission calendar.
 *
 * @param calendar map of UTC epoch day (unix seconds / 86400, integer) → submission count
 * @param todayEpochDay the injected "today" as a UTC epoch day
 */
export function computeStreaks(
  calendar: Record<number, number>,
  todayEpochDay: number,
): StreakResult {
  // Collect valid active days: positive count, integer key, not beyond today + 1.
  const activeSet = new Set<number>();
  for (const [key, count] of Object.entries(calendar)) {
    const day = Number(key);
    if (!Number.isInteger(day)) continue;
    if (typeof count !== "number" || !(count > 0)) continue;
    if (day > todayEpochDay + 1) continue; // ignore future garbage
    activeSet.add(day);
  }

  if (activeSet.size === 0) return { ...EMPTY_RESULT };

  let firstActive = Infinity;
  for (const day of activeSet) if (day < firstActive) firstActive = day;

  // Include tomorrow only when it is itself active (timezone-ahead grace).
  const lastDay = activeSet.has(todayEpochDay + 1)
    ? todayEpochDay + 1
    : todayEpochDay;

  let curLen = 0;
  let curStart = 0;
  let curEnd = 0;
  let hiLen = 0;
  let hiStart = 0;
  let hiEnd = 0;
  let totalActiveDays = 0;

  for (let day = firstActive; day <= lastDay; day++) {
    if (activeSet.has(day)) {
      totalActiveDays++;
      if (curLen === 0) curStart = day;
      curLen++;
      curEnd = day;
      if (curLen > hiLen) {
        hiLen = curLen;
        hiStart = curStart;
        hiEnd = curEnd;
      }
    } else if (day !== todayEpochDay || lastDay > todayEpochDay) {
      // Inactive day that is not today breaks the run; a zero TODAY does not
      // (the day isn't over yet — grace until it ends) UNLESS tomorrow
      // (todayEpochDay + 1) already has confirmed activity: that proves the
      // calendar's data horizon extends past today, so today's zero is a
      // confirmed break, not a "day isn't over yet" pending zero — grace
      // must not bridge over it into tomorrow's separate run.
      curLen = 0;
    }
  }

  return {
    currentStreak: curLen,
    currentStreakStart: curLen > 0 ? isoFromEpochDay(curStart) : null,
    currentStreakEnd: curLen > 0 ? isoFromEpochDay(curEnd) : null,
    highestStreak: hiLen,
    highestStreakStart: hiLen > 0 ? isoFromEpochDay(hiStart) : null,
    highestStreakEnd: hiLen > 0 ? isoFromEpochDay(hiEnd) : null,
    totalActiveDays,
    firstActiveDay: isoFromEpochDay(firstActive),
  };
}
