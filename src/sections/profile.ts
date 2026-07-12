// Profile section: LeetCode logo, username, rank, avatar (photo or initial-letter fallback).
// Geometry ported from scratchpad/leetcode-dashboard-mock.html's secProfile().

import type { CardData, ThemeColors } from "../types";
import { escapeXml, fillAttrs, formatNumber } from "../format";

// simple-icons "leetcode" glyph (CC0), https://simpleicons.org — 24x24 viewBox, scaled to 26px.
const LOGO_PATH =
  "M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z";
const LOGO_COLOR = "#FFA116"; // LeetCode brand orange — static asset color, not theme-driven.

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
    <path d="${LOGO_PATH}" transform="translate(${x}, ${y}) scale(${(26 / 24).toFixed(4)})" fill="${LOGO_COLOR}"${fadeIn(opts, 0.4)}/>
    ${text(x + 34, y + 14, 16, 700, theme.sideNums, username, "start", fadeIn(opts, 0.4))}
    ${text(x + 34, y + 30, 11, 400, theme.dates, `Rank ${formatNumber(data.rank, false)}`, "start", fadeIn(opts, 0.45))}
    ${avatar}`;
}
