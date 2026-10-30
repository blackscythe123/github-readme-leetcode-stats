// Profile section: LeetCode logo, username, rank, avatar (photo or initial-letter fallback).
// Geometry ported from scratchpad/leetcode-dashboard-mock.html's secProfile().

import type { CardData, ThemeColors } from "../types";
import { escapeXml, fillAttrs, formatNumber } from "../format";
import { LOGO_ON_DARK, LOGO_ON_LIGHT } from "../logo";

const FONT = "'Segoe UI', Ubuntu, sans-serif";

const GRADIENT_STOP_RE = /^[0-9a-fA-F]{3,8}$/;

/** Perceived luminance (0..1) of a 6-hex-digit "RRGGBB" string (no "#"). */
function hex6Luminance(rgb: string): number {
  const r = parseInt(rgb.slice(0, 2), 16);
  const g = parseInt(rgb.slice(2, 4), 16);
  const b = parseInt(rgb.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Expand a 3/4-digit hex shorthand ("abc"/"abcd") to 6/8 digits by doubling each char. */
function expandShorthandHex(hex: string): string {
  return hex.length === 3 || hex.length === 4
    ? hex
        .split("")
        .map((c) => c + c)
        .join("")
    : hex;
}

/**
 * Perceived luminance (0..1) of a theme color value, or null if the value is transparent/unknown
 * and no reliable background color can be determined:
 * - "#rgb"/"#rgba"/"#rrggbb"/"#rrggbbaa": 3/4-digit expanded first; 8-digit uses only the RGB part,
 *   and alpha < 25% is treated as transparent (null).
 * - "deg,hex,hex[,hex...]" gradient (>= 2 stops, stops without "#"): average luminance of the stops.
 * - anything else (bare "transparent", non-hex, malformed): null.
 */
function colorLuminance(value: string): number | null {
  const raw = typeof value === "string" ? value.trim() : "";
  const parts = raw.split(",");

  if (parts.length >= 3) {
    // Gradient: parts[0] is the rotation degree, the rest are bare-hex stops.
    const stopLums: number[] = [];
    for (const stopRaw of parts.slice(1)) {
      const stop = stopRaw.trim();
      if (!GRADIENT_STOP_RE.test(stop)) continue;
      const hex = expandShorthandHex(stop);
      const rgb = hex.length === 8 ? hex.slice(0, 6) : hex;
      if (rgb.length === 6) stopLums.push(hex6Luminance(rgb));
    }
    if (stopLums.length === 0) return null;
    return stopLums.reduce((a, b) => a + b, 0) / stopLums.length;
  }

  if (!raw.startsWith("#")) return null;

  let hex = expandShorthandHex(raw.slice(1));
  if (hex.length === 8) {
    const alphaByte = parseInt(hex.slice(6, 8), 16);
    const alpha = Number.isFinite(alphaByte) ? alphaByte / 255 : 1;
    if (alpha < 0.25) return null; // effectively transparent
    hex = hex.slice(0, 6);
  }
  if (hex.length === 6 && /^[0-9a-fA-F]{6}$/.test(hex)) return hex6Luminance(hex);
  return null;
}

/**
 * Pick the logo variant that stays visible against the card's effective background.
 * Falls back to the INVERSE of theme.sideNums's luminance when the background is
 * transparent/unknown (light text implies a dark surrounding context, and vice versa).
 */
export function pickLogo(theme: ThemeColors): string {
  let bgLum = colorLuminance(theme.background);
  if (bgLum === null) {
    const sideLum = colorLuminance(theme.sideNums);
    bgLum = 1 - (sideLum === null ? 0.5 : sideLum);
  }
  return bgLum < 0.5 ? LOGO_ON_DARK : LOGO_ON_LIGHT;
}

interface RenderOpts {
  animate: boolean;
  uid: string;
  today: number;
  short: boolean;
  isDynamic?: boolean;
}

function text(
  x: number,
  y: number,
  size: number,
  weight: number,
  fill: string,
  s: string | number,
  anchor: "start" | "middle" | "end" = "middle",
  extra = "",
): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" ${fillAttrs(fill, "fill")} font-family="${FONT}" font-weight="${weight}" font-size="${size}px" ${extra}>${escapeXml(String(s))}</text>`;
}

function fadeIn(opts: RenderOpts, delay: number): string {
  return opts.animate && !opts.isDynamic
    ? ` style="opacity:0;animation:pf_fade_${opts.uid} .5s ease-out ${delay}s both"`
    : "";
}

export function render(
  theme: ThemeColors,
  data: CardData,
  x: number,
  y: number,
  w: number,
  opts: RenderOpts,
): string {
  // Avatar sits at the right edge of the section's own width, generalizing the mock's fixed
  // x+272/y+13 offsets (which were exact for w=306).
  const cx = x + Math.max(34, w) - 34;
  const cy = y + 13;
  const username = data.username || "?";
  const initial = username.slice(0, 1).toUpperCase();

  const avatar = data.avatarDataUri
    ? `<clipPath id="av_${opts.uid}"><circle cx="${cx}" cy="${cy}" r="16"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="17" fill="none" ${fillAttrs(theme.ring, "stroke")} stroke-width="1.5"${opts.isDynamic ? ' class="dyn-stroke"' : ""}${fadeIn(opts, 0.5)}/>
      <image href="${escapeXml(data.avatarDataUri)}" x="${cx - 16}" y="${cy - 16}" width="32" height="32" clip-path="url(#av_${opts.uid})"${fadeIn(opts, 0.55)}/>`
    : `<circle cx="${cx}" cy="${cy}" r="16" ${fillAttrs(theme.ring, "fill", 0.2)}${fadeIn(opts, 0.5)}/>
      ${text(cx, cy + 5, 14, 700, theme.sideNums, initial)}`;

  const style = opts.animate
    ? `<style>@media (prefers-reduced-motion: no-preference){@keyframes pf_fade_${opts.uid}{from{opacity:0}to{opacity:1}}}</style>`
    : "";

  return `${style}
    <image href="${pickLogo(theme)}" x="${x}" y="${y}" width="26" height="26"${fadeIn(opts, 0.4)}/>
    ${text(x + 34, y + 14, 16, 700, theme.sideNums, username, "start", fadeIn(opts, 0.4))}
    ${text(x + 34, y + 30, 11, 400, theme.dates, `Rank ${formatNumber(data.rank, false)}`, "start", fadeIn(opts, 0.45))}
    ${avatar}`;
}
