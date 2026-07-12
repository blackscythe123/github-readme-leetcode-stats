// Shared contract for github-readme-leetcode-stats.
// All modules code against these types — treat this file as frozen during the build.

/** The 11 theme color keys, exactly as in the original streak-stats themes. */
export interface ThemeColors {
  background: string; // hex (#rgb/#rgba/#rrggbb/#rrggbbaa) OR gradient "deg,hex,hex[,hex...]"
  border: string;
  stroke: string;
  ring: string;
  fire: string;
  currStreakNum: string;
  sideNums: string;
  currStreakLabel: string;
  sideLabels: string;
  dates: string;
  excludeDaysLabel: string;
}

export type SectionName =
  | "profile"
  | "solved"
  | "streak"
  | "skills"
  | "languages"
  | "heatmap";

export const ALL_SECTIONS: SectionName[] = [
  "profile",
  "solved",
  "streak",
  "skills",
  "heatmap",
];

/** Fully parsed + validated query params. Produced only by params.ts. */
export interface CardParams {
  sections: SectionName[]; // deduped, in canonical order; default ALL_SECTIONS
  theme: string; // validated against themes.json keys, fallback "default"
  hideBorder: boolean;
  /** transparent=true → background becomes fully transparent on ANY theme (fill "#0000"); border/text keep theme colors */
  transparent: boolean;
  borderRadius: number; // clamped [0, 60]
  colorOverrides: Partial<ThemeColors>; // values already validated + "#"-prefixed
  disableAnimations: boolean;
  shortNumbers: boolean;
  /** Max skill chips to render (top_skills=N). Clamped [1, 12]; default 12. */
  topSkills: number;
  /** Max language chips to render (top_langs=N). Clamped [1, 12]; default 12. */
  topLangs: number;
  output: "svg" | "json";
}

export interface DifficultyStat {
  solved: number;
  total: number;
}

export interface NamedCount {
  name: string;
  count: number;
}

/** Raw per-user data from LeetCode (no streak math). Produced by leetcode.ts. */
export interface RawLeetCodeData {
  username: string;
  realName: string | null;
  rank: number;
  /** base64 data URI (image/*) or null → renderer draws an initial-letter circle */
  avatarDataUri: string | null;
  solved: {
    easy: DifficultyStat;
    medium: DifficultyStat;
    hard: DifficultyStat;
    total: number;
    totalQuestions: number;
  };
  totalSubmissions: number;
  /** Top skill tags across all tiers, sorted by count desc (max ~12 entries). */
  skills: NamedCount[];
  /** Languages sorted by count desc. */
  languages: NamedCount[];
  /**
   * Merged submission calendar across ALL activeYears.
   * Key: UTC epoch DAY (unix seconds / 86400, integer). Value: submission count.
   */
  calendar: Record<number, number>;
  /** LeetCode's own reported max streak (cross-check only, not displayed). */
  reportedStreak: number;
  reportedActiveDays: number;
}

/** Streak math results. Produced by stats.ts (pure; clock injected). */
export interface StreakResult {
  currentStreak: number;
  /** ISO dates (YYYY-MM-DD, UTC) or null when the streak is 0 / no data. */
  currentStreakStart: string | null;
  currentStreakEnd: string | null;
  highestStreak: number;
  highestStreakStart: string | null;
  highestStreakEnd: string | null;
  totalActiveDays: number;
  firstActiveDay: string | null;
}

/** Everything the renderer needs. Assembled in api/card.ts. */
export interface CardData extends RawLeetCodeData, StreakResult {}

/** Error that renders as an error card (SVG, HTTP 200) or JSON {error, code}. */
export class RenderableError extends Error {
  constructor(
    message: string,
    public readonly code: number,
  ) {
    super(message);
    this.name = "RenderableError";
  }
}

/*
 * Module contracts (implementations live in the named files):
 *
 * src/format.ts
 *   escapeXml(s: string): string
 *   fillAttrs(color: string, attr: "fill" | "stroke"): string
 *     // "#abcd"/"#aabbccdd" → `attr="#rrggbb" attr-opacity="0.xx"`, plain hex → `attr="#rrggbb"`,
 *     // non-# values (e.g. "url(#g_1)") passed through
 *   formatNumber(n: number, short: boolean): string   // short: 1500 → "1.5K"
 *   isoFromEpochDay(day: number): string               // "YYYY-MM-DD" UTC
 *   displayDate(iso: string, todayIso: string): string // "Jul 7" same year, "Jul 7, 2025" otherwise
 *
 * src/theme.ts
 *   themeNames(): string[]
 *   resolveTheme(name: string, overrides: Partial<ThemeColors>, hideBorder: boolean): ThemeColors
 *     // unknown name → "default"; hideBorder → border "#0000"
 *
 * src/params.ts
 *   parseParams(query: Record<string, string | string[] | undefined>): CardParams
 *
 * src/leetcode.ts
 *   fetchRawData(username: string): Promise<RawLeetCodeData>  // throws RenderableError
 *
 * src/stats.ts
 *   computeStreaks(calendar: Record<number, number>, todayEpochDay: number): StreakResult
 *   epochDayNow(): number
 *
 * src/card.ts
 *   renderCard(data: CardData, params: CardParams, theme: ThemeColors): string
 *   renderErrorCard(message: string, theme: ThemeColors, borderRadius?: number): string
 *
 * src/output.ts
 *   convertHexColors(svg: string): string
 *   removeAnimations(svg: string): string
 *   generateOutput(data: CardData | RenderableError, params: CardParams):
 *     { body: string; contentType: string }
 */
