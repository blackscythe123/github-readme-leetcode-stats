// Streak section: Total Submissions | Current Streak (ring + fire + glow pulse) | Highest Streak.
// Geometry ported from scratchpad/leetcode-dashboard-mock.html's secStreak().
//
// Ring/mask coordinates are ABSOLUTE (never wrapped in a translate() group) — wrapping a
// userSpaceOnUse mask's target in a transform breaks the mask (verified while mocking).

import type { CardData, ThemeColors } from "../types";
import { escapeXml, fillAttrs, formatNumber } from "../format";

const FONT = "'Segoe UI', Ubuntu, sans-serif";

// Original streak-stats fire icon path (scaled 0.62 in-place via a transform on its own <g>,
// which is fine — only the masked ring circle must stay unwrapped).
const FIRE_PATH =
  "M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z";

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
  return opts.animate
    ? ` style="opacity:0;animation:st_fade_${opts.uid} .5s ease-out ${delay}s both"`
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
  const cols = [w / 6, w / 2, (5 * w) / 6].map((v) => x + v);
  const cy = y + 44;
  const [col0, col1, col2] = cols as [number, number, number];

  const popStyle = opts.animate
    ? ` style="animation:st_pop_${opts.uid} .7s cubic-bezier(.34,1.56,.64,1) .9s both"`
    : "";

  const glow = opts.animate
    ? `<filter id="glow_ring_${opts.uid}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
      <g filter="url(#glow_ring_${opts.uid})" opacity="0.5" style="animation:st_glow_${opts.uid} 2.5s ease-in-out infinite alternate">
        <circle cx="${col1}" cy="${cy}" r="28" fill="none" ${fillAttrs(theme.fire, "stroke")} stroke-width="4"/>
        <path d="${FIRE_PATH}" transform="translate(${col1}, ${cy - 36}) scale(0.62)" ${fillAttrs(theme.fire, "fill")}/>
      </g>`
    : "";

  const style = opts.animate
    ? `<style>@media (prefers-reduced-motion: no-preference){
        @keyframes st_fade_${opts.uid}{from{opacity:0}to{opacity:1}}
        @keyframes st_pop_${opts.uid}{0%{font-size:0px;opacity:0}70%{font-size:27px}100%{font-size:24px;opacity:1}}
        @keyframes st_glow_${opts.uid}{from{opacity:0.35}to{opacity:0.75}}
      }</style>`
    : "";

  return `${style}
    ${text(col0, cy + 8, 24, 700, theme.sideNums, formatNumber(data.totalSubmissions, opts.short), "middle", fadeIn(opts, 0.4))}
    ${text(col0, cy + 32, 11, 400, theme.sideLabels, "Total Submissions", "middle", fadeIn(opts, 0.5) + (opts.isDynamic ? ' class="dyn-fill"' : ""))}
    <mask id="rm_${opts.uid}"><rect x="${x}" y="${y - 20}" width="${w}" height="120" fill="white"/><ellipse cx="${col1}" cy="${cy - 28}" rx="9" ry="12" fill="black"/></mask>
    <g mask="url(#rm_${opts.uid})">
      <circle cx="${col1}" cy="${cy}" r="28" fill="none" ${fillAttrs(theme.fire, "stroke")} stroke-width="4"${fadeIn(opts, 0.4)}/>
    </g>
    ${glow}
    <g transform="translate(${col1}, ${cy - 36}) scale(0.62)"${fadeIn(opts, 0.6)}>
      <path d="${FIRE_PATH}" ${fillAttrs(theme.fire, "fill")}/>
    </g>
    ${text(col1, cy + 8, 24, 700, theme.currStreakNum, formatNumber(data.currentStreak, opts.short), "middle", popStyle)}
    ${text(col1, cy + 46, 11, 700, theme.currStreakLabel, "Current Streak", "middle", fadeIn(opts, 0.7))}
    ${text(col2, cy + 8, 24, 700, theme.sideNums, formatNumber(data.highestStreak, opts.short), "middle", fadeIn(opts, 0.45))}
    ${text(col2, cy + 32, 11, 400, theme.sideLabels, "Highest Streak", "middle", fadeIn(opts, 0.55) + (opts.isDynamic ? ' class="dyn-fill"' : ""))}`;
}
