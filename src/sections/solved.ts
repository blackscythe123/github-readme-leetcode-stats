// Solved section: progress ring (solved/totalQuestions) + Easy/Medium/Hard bars.
// Geometry ported from scratchpad/leetcode-dashboard-mock.html's secSolved().

import type { CardData, ThemeColors } from "../types";
import { escapeXml, fillAttrs, formatNumber } from "../format";

const FONT = "'Segoe UI', Ubuntu, sans-serif";

// LeetCode brand difficulty colors — static assets, not theme-driven (matches the mock).
const DIFF_COLORS: Record<"easy" | "medium" | "hard", string> = {
  easy: "#00B8A3",
  medium: "#FFC01E",
  hard: "#FF375F",
};
const DIFFS: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];

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
    ? ` style="opacity:0;animation:sv_fade_${opts.uid} .5s ease-out ${delay}s both"`
    : "";
}

export function render(
  theme: ThemeColors,
  data: CardData,
  x: number,
  y: number,
  _w: number,
  opts: RenderOpts,
): string {
  const cx = x + 52;
  const cy = y + 48;
  const r = 33;
  const circumference = 2 * Math.PI * r;
  const totalQ = data.solved.totalQuestions > 0 ? data.solved.totalQuestions : 1;
  const pct = Math.min(1, Math.max(0, data.solved.total / totalQ));
  const dash = (pct * circumference).toFixed(1);

  const ringStyle = opts.animate
    ? ` style="stroke-dashoffset:${circumference.toFixed(1)};animation:sv_ring_${opts.uid} 1s ease-out .5s both"`
    : ` style="stroke-dashoffset:0"`;

  const rows = DIFFS.map((d, i) => {
    const stat = data.solved[d];
    const ry = y + 12 + i * 31;
    const barW = 116;
    const tot = stat.total > 0 ? stat.total : 1;
    const bw = Math.max(2, barW * (stat.solved / tot));
    const label = d.charAt(0).toUpperCase() + d.slice(1);
    const barX = x + 168;
    const barY = ry + 2;
    const barStyle = opts.animate
      ? ` style="transform-origin:${barX}px ${(barY + 3.5).toFixed(1)}px;animation:sv_bar_${opts.uid} .6s ease-out ${(0.6 + i * 0.12).toFixed(2)}s both"`
      : "";
    return `
      ${text(x + 115, ry + 9, 11, 600, theme.sideLabels, label, "start", fadeIn(opts, 0.55 + i * 0.05))}
      <text x="${x + 346}" y="${ry + 9}" text-anchor="end" font-family="${FONT}" font-size="11px"${fadeIn(opts, 0.55 + i * 0.05)}>
        <tspan font-weight="700" ${fillAttrs(theme.sideNums, "fill")}>${formatNumber(stat.solved, opts.short)}</tspan><tspan font-weight="400" ${fillAttrs(theme.dates, "fill")}>/${formatNumber(stat.total, opts.short)}</tspan>
      </text>
      <rect x="${barX}" y="${barY}" width="${barW}" height="7" rx="3.5" fill="${DIFF_COLORS[d]}" fill-opacity="0.18"/>
      <g${barStyle}><rect x="${barX}" y="${barY}" width="${bw.toFixed(1)}" height="7" rx="3.5" fill="${DIFF_COLORS[d]}"/></g>`;
  }).join("");

  const style = opts.animate
    ? `<style>@media (prefers-reduced-motion: no-preference){
        @keyframes sv_fade_${opts.uid}{from{opacity:0}to{opacity:1}}
        @keyframes sv_ring_${opts.uid}{from{stroke-dashoffset:${circumference.toFixed(1)}}to{stroke-dashoffset:0}}
        @keyframes sv_bar_${opts.uid}{from{transform:scaleX(0)}to{transform:scaleX(1)}}
      }</style>`
    : "";

  return `${style}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${fillAttrs(theme.ring, "stroke", 0.18)} stroke-width="6"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${fillAttrs(theme.ring, "stroke")} stroke-width="6" stroke-linecap="round" stroke-dasharray="${dash} ${circumference.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"${ringStyle}/>
    ${text(cx, cy - 2, 22, 700, theme.sideNums, formatNumber(data.solved.total, opts.short), "middle", fadeIn(opts, 0.4))}
    ${text(cx, cy + 14, 9, 400, theme.dates, "Solved", "middle", fadeIn(opts, 0.45))}
    ${rows}`;
}
