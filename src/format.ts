// XML escaping, SVG fill/stroke attribute rendering, and number/date formatting.
// Pure, dependency-free helpers used by every section renderer and card.ts.

/** Escape the 5 XML-significant characters. Use on ANY dynamic text placed inside SVG. */
export function escapeXml(value: string): string {
  const s = String(value);
  let out = "";
  for (const ch of s) {
    switch (ch) {
      case "&":
        out += "&amp;";
        break;
      case "<":
        out += "&lt;";
        break;
      case ">":
        out += "&gt;";
        break;
      case '"':
        out += "&quot;";
        break;
      case "'":
        out += "&apos;";
        break;
      default:
        out += ch;
    }
  }
  return out;
}

/**
 * Render a `fill="..."` or `stroke="..."` attribute pair for an SVG color value.
 *
 * - "transparent" (case-insensitive) is treated exactly like the 4-digit hex "#0000".
 * - "#rgb" / "#rgba" (3/4 hex digits) expand each digit (doubling) before further processing.
 * - "#rrggbbaa" (8 hex digits, after expansion or as given) splits into `attr="#rrggbb"` plus
 *   `attr-opacity="a"` where a = alpha/255, rendered to 2 decimal places.
 * - "#rrggbb" (6 hex digits) renders as a plain `attr="#rrggbb"`.
 * - Anything else NOT starting with "#" (e.g. `url(#g_1)`, a bare named CSS color like
 *   "cornflowerblue", or a raw SVG paint keyword) is passed through verbatim as `attr="<value>"`.
 *
 * `decorativeOpacity` (default 1) lets a caller bake a flat "decorative" alpha (e.g. a progress
 * ring's track, a chip's fill wash) INTO the same `attr-opacity` this function already emits for
 * alpha-hex colors, instead of the caller stacking its own separate `opacity="..."` attribute on
 * the element. Per the SVG spec, `opacity` and `fill-opacity`/`stroke-opacity` on one element
 * compound multiplicatively — stacking them independently silently squashes the visible alpha for
 * any theme color that itself carries an alpha channel. Passing the intended flat alpha here keeps
 * the math correct in one place: combined = colorAlpha * decorativeOpacity.
 *
 * Callers are responsible for supplying already-validated color values (see params.ts /
 * theme.ts) — this function does not itself reject malformed input, it just formats it.
 */
export function fillAttrs(
  color: string,
  attr: "fill" | "stroke",
  decorativeOpacity = 1,
): string {
  const raw = typeof color === "string" ? color.trim() : "";
  const factor = Number.isFinite(decorativeOpacity)
    ? Math.min(1, Math.max(0, decorativeOpacity))
    : 1;

  if (raw.toLowerCase() === "transparent") {
    return `${attr}="#000000" ${attr}-opacity="0.00"`;
  }

  if (!raw.startsWith("#")) {
    return factor < 1
      ? `${attr}="${raw}" ${attr}-opacity="${factor.toFixed(2)}"`
      : `${attr}="${raw}"`;
  }

  let hex = raw.slice(1);

  // 3/4-digit shorthand -> expand each char by doubling ("abc" -> "aabbcc").
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (hex.length === 8) {
    const rgb = hex.slice(0, 6);
    const alphaByte = parseInt(hex.slice(6, 8), 16);
    const colorAlpha = Number.isFinite(alphaByte) ? alphaByte / 255 : 1;
    const combined = (colorAlpha * factor).toFixed(2);
    return `${attr}="#${rgb}" ${attr}-opacity="${combined}"`;
  }

  // 6-digit (or anything else post-expansion) — render as-is, plus a combined opacity if a
  // decorative factor was requested.
  return factor < 1
    ? `${attr}="#${hex}" ${attr}-opacity="${factor.toFixed(2)}"`
    : `${attr}="#${hex}"`;
}

const SHORT_SUFFIXES = ["", "K", "M", "B", "T"];

/**
 * Format a number for display. `short=false` uses Intl en-US grouping (e.g. 12345 -> "12,345").
 * `short=true` divides by 1000 repeatedly, picking K/M/B/T, 1 decimal place, trailing ".0" trimmed
 * (e.g. 999 -> "999", 1500 -> "1.5K", 1000000 -> "1M").
 */
export function formatNumber(n: number, short: boolean): string {
  const num = Number.isFinite(n) ? n : 0;

  if (!short) {
    return new Intl.NumberFormat("en-US").format(num);
  }

  const sign = num < 0 ? "-" : "";
  let abs = Math.abs(num);
  let idx = 0;
  while (abs >= 1000 && idx < SHORT_SUFFIXES.length - 1) {
    abs /= 1000;
    idx++;
  }

  if (idx === 0) {
    return sign + new Intl.NumberFormat("en-US").format(abs);
  }

  let str = abs.toFixed(1);
  if (str.endsWith(".0")) {
    str = str.slice(0, -2);
  }
  return sign + str + SHORT_SUFFIXES[idx];
}

/** Convert a UTC epoch day (unix seconds / 86400, integer) to "YYYY-MM-DD" (UTC). */
export function isoFromEpochDay(day: number): string {
  const ms = day * 86400 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "YYYY-MM-DD" -> "Jul 7" (same year as todayIso) or "Jul 7, 2025" (different year). */
export function displayDate(iso: string, todayIso: string): string {
  const [y, m, d] = iso.split("-").map((part) => parseInt(part, 10));
  const [ty] = todayIso.split("-").map((part) => parseInt(part, 10));
  const date = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  const monthName = MONTH_NAMES[date.getUTCMonth()];
  const dayOfMonth = date.getUTCDate();
  if (y === ty) {
    return `${monthName} ${dayOfMonth}`;
  }
  return `${monthName} ${dayOfMonth}, ${y}`;
}
