// LeetCode GraphQL data layer for github-readme-leetcode-stats.
// Fetches one combined query for profile/solved/skills/languages/trailing-calendar, then fans
// out one small per-year query for every year in activeYears to build the FULL submission
// calendar (LeetCode's default userCalendar only covers the trailing ~12 months).

import { RenderableError } from "./types";
import type { DifficultyStat, NamedCount, RawLeetCodeData } from "./types";

const GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

// Static desktop-Chrome UA — LeetCode's edge (Cloudflare) is more likely to block requests that
// look like a bare server/script client.
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const REQUEST_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  Origin: "https://leetcode.com",
  "User-Agent": USER_AGENT,
};

const BLOCKED_MESSAGE = "LeetCode is currently blocking requests. Try again soon.";
const MAX_AVATAR_BYTES = 60 * 1024;

/** Combined query: everything needed for one user except the full-history calendar fan-out. */
export const QUERY = `query userProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    profile {
      ranking
      userAvatar
      realName
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    tagProblemCounts {
      advanced {
        tagName
        problemsSolved
      }
      intermediate {
        tagName
        problemsSolved
      }
      fundamental {
        tagName
        problemsSolved
      }
    }
    languageProblemCount {
      languageName
      problemsSolved
    }
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}`;

/** Small per-year query used to fan out the full submission calendar. */
export const CALENDAR_QUERY = `query userCalendarForYear($username: String!, $year: Int) {
  matchedUser(username: $username) {
    userCalendar(year: $year) {
      submissionCalendar
    }
  }
}`;

// ---- Raw GraphQL response shapes (internal only — never exported) ----

interface DifficultyCountRow {
  difficulty: string;
  count: number;
}

interface SubmissionCountRow {
  difficulty: string;
  count: number;
  submissions: number;
}

interface TagCountRow {
  tagName: string;
  problemsSolved: number;
}

interface LanguageCountRow {
  languageName: string;
  problemsSolved: number;
}

interface UserCalendarPayload {
  activeYears?: number[];
  streak?: number;
  totalActiveDays?: number;
  submissionCalendar?: string;
}

interface MatchedUserPayload {
  profile: {
    ranking: number;
    userAvatar: string | null;
    realName: string | null;
  } | null;
  submitStatsGlobal: {
    acSubmissionNum: DifficultyCountRow[];
    totalSubmissionNum: SubmissionCountRow[];
  } | null;
  tagProblemCounts: {
    advanced: TagCountRow[];
    intermediate: TagCountRow[];
    fundamental: TagCountRow[];
  } | null;
  languageProblemCount: LanguageCountRow[] | null;
  userCalendar: UserCalendarPayload | null;
}

interface MainQueryData {
  allQuestionsCount: DifficultyCountRow[];
  matchedUser: MatchedUserPayload | null;
}

interface CalendarQueryData {
  matchedUser: {
    userCalendar: { submissionCalendar?: string } | null;
  } | null;
}

interface GraphQLEnvelope<T> {
  data?: T;
}

// ---- Networking ----

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 300-800ms jitter, per the plan. */
function retryJitterMs(): number {
  return 300 + Math.random() * 500;
}

function blockedError(): RenderableError {
  return new RenderableError(BLOCKED_MESSAGE, 502);
}

function isGraphQLEnvelope<T>(value: unknown): value is GraphQLEnvelope<T> {
  return typeof value === "object" && value !== null;
}

/**
 * POST one GraphQL query. One retry (with jitter) on network errors or 5xx; 403/429 and
 * malformed/non-JSON bodies fail immediately as a "blocked" RenderableError.
 */
async function postGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response;
    try {
      response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: REQUEST_HEADERS,
        body: JSON.stringify({ query, variables }),
      });
    } catch {
      // Network-level failure (DNS, timeout, connection reset, ...).
      if (attempt < maxAttempts) {
        await sleep(retryJitterMs());
        continue;
      }
      throw blockedError();
    }

    if (response.status >= 500) {
      if (attempt < maxAttempts) {
        await sleep(retryJitterMs());
        continue;
      }
      throw blockedError();
    }

    if (response.status === 403 || response.status === 429) {
      throw blockedError();
    }

    if (!response.ok) {
      throw blockedError();
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw blockedError(); // non-JSON body
    }

    if (!isGraphQLEnvelope<T>(body) || body.data === undefined) {
      throw blockedError();
    }

    return body.data;
  }

  // Unreachable (loop always returns or throws), kept for type-safety.
  throw blockedError();
}

// ---- Field extraction helpers ----

function pickDifficultyCount(
  rows: DifficultyCountRow[] | undefined,
  difficulty: string,
): number {
  const row = rows?.find((r) => r.difficulty === difficulty);
  return typeof row?.count === "number" && Number.isFinite(row.count) ? row.count : 0;
}

function pickTotalSubmissions(rows: SubmissionCountRow[] | undefined): number {
  const row = rows?.find((r) => r.difficulty === "All");
  return typeof row?.submissions === "number" && Number.isFinite(row.submissions)
    ? row.submissions
    : 0;
}

function buildSolved(
  allQuestionsCount: DifficultyCountRow[],
  submitStatsGlobal: MatchedUserPayload["submitStatsGlobal"],
): RawLeetCodeData["solved"] {
  const ac = submitStatsGlobal?.acSubmissionNum;
  const totals = allQuestionsCount;

  const easy: DifficultyStat = {
    solved: pickDifficultyCount(ac, "Easy"),
    total: pickDifficultyCount(totals, "Easy"),
  };
  const medium: DifficultyStat = {
    solved: pickDifficultyCount(ac, "Medium"),
    total: pickDifficultyCount(totals, "Medium"),
  };
  const hard: DifficultyStat = {
    solved: pickDifficultyCount(ac, "Hard"),
    total: pickDifficultyCount(totals, "Hard"),
  };

  return {
    easy,
    medium,
    hard,
    total: pickDifficultyCount(ac, "All"),
    totalQuestions: pickDifficultyCount(totals, "All"),
  };
}

function toNamedCounts(
  rows: Array<{ name: string; count: number }>,
  limit?: number,
): NamedCount[] {
  const sorted = rows
    .filter((r) => typeof r.name === "string" && Number.isFinite(r.count))
    .sort((a, b) => b.count - a.count);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

function buildSkills(
  tagProblemCounts: MatchedUserPayload["tagProblemCounts"],
): NamedCount[] {
  const rows = [
    ...(tagProblemCounts?.advanced ?? []),
    ...(tagProblemCounts?.intermediate ?? []),
    ...(tagProblemCounts?.fundamental ?? []),
  ].map((t) => ({ name: t.tagName, count: t.problemsSolved }));
  return toNamedCounts(rows, 12);
}

function buildLanguages(rows: LanguageCountRow[] | null): NamedCount[] {
  const mapped = (rows ?? []).map((r) => ({
    name: r.languageName,
    count: r.problemsSolved,
  }));
  return toNamedCounts(mapped);
}

/** Parse LeetCode's `submissionCalendar` JSON string into a raw ts-seconds → count map. */
function parseCalendarString(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Malformed calendar payload — treat as empty rather than failing the whole card.
  }
  return {};
}

/** Merge one raw ts-seconds→count calendar string into the epoch-day accumulator. */
function mergeCalendarInto(
  target: Record<number, number>,
  raw: string | undefined,
): void {
  const parsed = parseCalendarString(raw);
  for (const [key, value] of Object.entries(parsed)) {
    const tsSeconds = Number(key);
    const count = Number(value);
    if (!Number.isFinite(tsSeconds) || !Number.isFinite(count)) continue;
    const epochDay = Math.floor(tsSeconds / 86400);
    target[epochDay] = count;
  }
}

/**
 * Build the full-history calendar: the trailing-year data already in `userCalendar`, merged
 * with one small parallel query per activeYears entry. A single failed year is dropped rather
 * than failing the whole card (best-effort full history; the trailing-year data still lands).
 */
async function buildFullCalendar(
  username: string,
  userCalendar: UserCalendarPayload | null,
): Promise<Record<number, number>> {
  const merged: Record<number, number> = {};
  mergeCalendarInto(merged, userCalendar?.submissionCalendar);

  const activeYears = Array.isArray(userCalendar?.activeYears)
    ? userCalendar.activeYears
    : [];
  const years = [...new Set(activeYears.filter((y) => Number.isInteger(y)))];

  if (years.length > 0) {
    const perYearResults = await Promise.all(
      years.map(async (year) => {
        try {
          const data = await postGraphQL<CalendarQueryData>(CALENDAR_QUERY, {
            username,
            year,
          });
          return data.matchedUser?.userCalendar?.submissionCalendar;
        } catch {
          return undefined;
        }
      }),
    );
    for (const raw of perYearResults) {
      mergeCalendarInto(merged, raw);
    }
  }

  return merged;
}

// ---- Avatar ----

/** Data-URI cache keyed by avatar URL; survives warm lambda invocations. Successes only. */
const avatarCache = new Map<string, string>();

async function fetchAvatarDataUri(avatarUrl: string | null): Promise<string | null> {
  if (!avatarUrl || !/^https:\/\//i.test(avatarUrl)) return null;

  const cached = avatarCache.get(avatarUrl);
  if (cached !== undefined) return cached;

  try {
    const response = await fetch(avatarUrl, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("image/")) return null;

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength <= 0 || buffer.byteLength > MAX_AVATAR_BYTES) return null;

    const base64 = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${contentType};base64,${base64}`;
    avatarCache.set(avatarUrl, dataUri);
    return dataUri;
  } catch {
    return null;
  }
}

// ---- Public entry point ----

export async function fetchRawData(username: string): Promise<RawLeetCodeData> {
  const mainData = await postGraphQL<MainQueryData>(QUERY, { username });

  const matchedUser = mainData.matchedUser;
  if (!matchedUser) {
    throw new RenderableError("Could not find that LeetCode user.", 404);
  }

  const [calendar, avatarDataUri] = await Promise.all([
    buildFullCalendar(username, matchedUser.userCalendar),
    fetchAvatarDataUri(matchedUser.profile?.userAvatar ?? null),
  ]);

  return {
    username,
    realName: matchedUser.profile?.realName ?? null,
    rank:
      typeof matchedUser.profile?.ranking === "number" &&
      Number.isFinite(matchedUser.profile.ranking)
        ? matchedUser.profile.ranking
        : 0,
    avatarDataUri,
    solved: buildSolved(mainData.allQuestionsCount, matchedUser.submitStatsGlobal),
    totalSubmissions: pickTotalSubmissions(matchedUser.submitStatsGlobal?.totalSubmissionNum),
    skills: buildSkills(matchedUser.tagProblemCounts),
    languages: buildLanguages(matchedUser.languageProblemCount),
    calendar,
    reportedStreak:
      typeof matchedUser.userCalendar?.streak === "number" &&
      Number.isFinite(matchedUser.userCalendar.streak)
        ? matchedUser.userCalendar.streak
        : 0,
    reportedActiveDays:
      typeof matchedUser.userCalendar?.totalActiveDays === "number" &&
      Number.isFinite(matchedUser.userCalendar.totalActiveDays)
        ? matchedUser.userCalendar.totalActiveDays
        : 0,
  };
}
