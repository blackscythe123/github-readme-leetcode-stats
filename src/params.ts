// Query-param parsing/validation for the card endpoint. Every value that could end up
// interpolated into SVG or used as a lookup key is validated/allowlisted HERE — nothing
// downstream should have to re-sanitize raw query text.

import { ALL_SECTIONS, type CardParams, type SectionName, type ThemeColors } from "./types";

type QueryValue = string | string[] | undefined;
type Query = Record<string, QueryValue>;

/** Array-valued query entries (e.g. `?theme=a&theme=b`) take the first value. */
function first(v: QueryValue): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

// ---------------------------------------------------------------------------
// sections
// ---------------------------------------------------------------------------

const CANONICAL_SECTION_ORDER: SectionName[] = [
  "profile",
  "solved",
  "streak",
  "skills",
  "languages",
  "heatmap",
];

const VALID_SECTIONS = new Set<string>(CANONICAL_SECTION_ORDER);

function parseSections(raw: string | undefined): SectionName[] {
  if (raw === undefined || raw.trim() === "") {
    return [...ALL_SECTIONS];
  }

  const picked = new Set<SectionName>();
  for (const token of raw.split(",")) {
    const cleaned = token.trim().toLowerCase();
    if (VALID_SECTIONS.has(cleaned)) {
      picked.add(cleaned as SectionName);
    }
  }

  if (picked.size === 0) {
    return [...ALL_SECTIONS];
  }

  return CANONICAL_SECTION_ORDER.filter((s) => picked.has(s));
}

// ---------------------------------------------------------------------------
// theme name
// ---------------------------------------------------------------------------

/**
 * Normalize only (lowercase, underscores -> dashes). Does NOT validate against the known
 * theme catalog — that requires themes.json, which is theme.ts's responsibility
 * (resolveTheme() falls back to "default" for unknown names). Keeping params.ts free of a
 * themes.json dependency means it parses correctly even before/without that generated file.
 */
function normalizeThemeName(raw: string | undefined): string {
  if (raw === undefined || raw.trim() === "") return "default";
  return raw.trim().toLowerCase().replace(/_/g, "-");
}

// ---------------------------------------------------------------------------
// booleans / numbers
// ---------------------------------------------------------------------------

function parseBoolFlag(raw: string | undefined): boolean {
  return raw === "true";
}

const DEFAULT_BORDER_RADIUS = 4.5;
const MIN_BORDER_RADIUS = 0;
const MAX_BORDER_RADIUS = 60;

function parseBorderRadius(raw: string | undefined): number {
  if (raw === undefined) return DEFAULT_BORDER_RADIUS;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return DEFAULT_BORDER_RADIUS;
  return Math.min(MAX_BORDER_RADIUS, Math.max(MIN_BORDER_RADIUS, n));
}

// ---------------------------------------------------------------------------
// top_skills / top_langs
// ---------------------------------------------------------------------------

const DEFAULT_TOP_N = 12;
const MIN_TOP_N = 1;
const MAX_TOP_N = 12;

function parseTopN(raw: string | undefined): number {
  if (raw === undefined) return DEFAULT_TOP_N;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return DEFAULT_TOP_N;
  return Math.min(MAX_TOP_N, Math.max(MIN_TOP_N, n));
}

// ---------------------------------------------------------------------------
// color overrides
// ---------------------------------------------------------------------------

const COLOR_KEYS: (keyof ThemeColors)[] = [
  "background",
  "border",
  "stroke",
  "ring",
  "fire",
  "currStreakNum",
  "sideNums",
  "currStreakLabel",
  "sideLabels",
  "dates",
  "excludeDaysLabel",
];

const HEX_RE = /^([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
// background-only: "<deg>,<hex>,<hex>[,<hex>...]" (>= 2 color stops), hex without leading "#".
const GRADIENT_RE = /^-?\d{1,3}(,[0-9a-fA-F]{3,8}){2,}$/;

/** The 148 standard CSS/HTML named colors (lowercase). */
const NAMED_CSS_COLORS = new Set<string>([
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black",
  "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
  "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
  "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta",
  "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
  "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink",
  "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen",
  "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green",
  "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
  "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
  "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon",
  "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue",
  "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine",
  "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue",
  "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream",
  "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange",
  "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
  "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple",
  "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell",
  "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen",
  "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
  "whitesmoke", "yellow", "yellowgreen",
]);

/** Returns a validated, normalized color string, or undefined if `raw` is not acceptable. */
function validateColorValue(raw: string, allowGradient: boolean): string | undefined {
  const value = raw.trim();
  if (value === "") return undefined;

  const hexCandidate = value.startsWith("#") ? value.slice(1) : value;
  if (HEX_RE.test(hexCandidate)) {
    return "#" + hexCandidate;
  }

  if (allowGradient && GRADIENT_RE.test(value)) {
    return value;
  }

  const lower = value.toLowerCase();
  if (NAMED_CSS_COLORS.has(lower)) {
    return lower;
  }

  return undefined;
}

function parseColorOverrides(query: Query): Partial<ThemeColors> {
  const overrides: Partial<ThemeColors> = {};
  for (const key of COLOR_KEYS) {
    const raw = first(query[key]);
    if (raw === undefined) continue;
    const validated = validateColorValue(raw, key === "background");
    if (validated !== undefined) {
      overrides[key] = validated;
    }
  }
  return overrides;
}

// ---------------------------------------------------------------------------
// entry point
// ---------------------------------------------------------------------------

export function parseParams(query: Query): CardParams {
  const sections = parseSections(first(query.sections));
  const theme = normalizeThemeName(first(query.theme));

  const hideBorder = parseBoolFlag(first(query.hide_border));
  const transparent = parseBoolFlag(first(query.transparent));
  const disableAnimations = parseBoolFlag(first(query.disable_animations));
  const shortNumbers = parseBoolFlag(first(query.short_numbers));

  const borderRadius = parseBorderRadius(first(query.border_radius));

  const topSkills = parseTopN(first(query.top_skills));
  const topLangs = parseTopN(first(query.top_langs));

  const colorOverrides = parseColorOverrides(query);
  // transparent=true always wins, regardless of an explicit (valid or invalid) background=.
  if (transparent) {
    colorOverrides.background = "#0000";
  }

  const output: "svg" | "json" = first(query.type) === "json" ? "json" : "svg";

  return {
    sections,
    theme,
    hideBorder,
    transparent,
    borderRadius,
    colorOverrides,
    disableAnimations,
    shortNumbers,
    topSkills,
    topLangs,
    output,
  };
}
