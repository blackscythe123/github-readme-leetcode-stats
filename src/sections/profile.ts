// Profile section: LeetCode logo, username, rank, avatar (photo or initial-letter fallback).
// Geometry ported from scratchpad/leetcode-dashboard-mock.html's secProfile().

import type { CardData, ThemeColors } from "../types";
import { escapeXml, fillAttrs, formatNumber } from "../format";
import { LOGO_DATA_URI } from "../logo";

const FONT = "'Segoe UI', Ubuntu, sans-serif";

interface RenderOpts {
  animate: boolean;
  uid: string;
  today: number;
  short: boolean;
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
  return opts.animate
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
      <circle cx="${cx}" cy="${cy}" r="17" fill="none" ${fillAttrs(theme.ring, "stroke")} stroke-width="1.5"${fadeIn(opts, 0.5)}/>
      <image href="${escapeXml(data.avatarDataUri)}" x="${cx - 16}" y="${cy - 16}" width="32" height="32" clip-path="url(#av_${opts.uid})"${fadeIn(opts, 0.55)}/>`
    : `<circle cx="${cx}" cy="${cy}" r="16" ${fillAttrs(theme.ring, "fill", 0.2)}${fadeIn(opts, 0.5)}/>
      ${text(cx, cy + 5, 14, 700, theme.sideNums, initial)}`;

  const style = opts.animate
    ? `<style>@media (prefers-reduced-motion: no-preference){@keyframes pf_fade_${opts.uid}{from{opacity:0}to{opacity:1}}}</style>`
    : "";

  return `${style}
    <image href="${LOGO_DATA_URI}" x="${x}" y="${y}" width="26" height="26"${fadeIn(opts, 0.4)}/>
    ${text(x + 34, y + 14, 16, 700, theme.sideNums, username, "start", fadeIn(opts, 0.4))}
    ${text(x + 34, y + 30, 11, 400, theme.dates, `Rank ${formatNumber(data.rank, false)}`, "start", fadeIn(opts, 0.45))}
    ${avatar}`;
}
