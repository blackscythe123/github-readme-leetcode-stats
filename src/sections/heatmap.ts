// Submission heatmap: 52-week grid (11px cells, 14px pitch), month labels, Less->More legend.
// Geometry ported from scratchpad/leetcode-dashboard-mock.html's secHeatmap().
//
// `today` is threaded in via opts (computed once in card.ts via stats.epochDayNow()) rather than
// read from the system clock here, keeping this a pure function of (data.calendar, opts.today).

import type { CardData, ThemeColors } from "../types";
import { displayDate, escapeXml, fillAttrs, isoFromEpochDay } from "../format";

const FONT = "'Segoe UI', Ubuntu, sans-serif";
const MONTHS = [
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
    ? ` style="opacity:0;animation:hm_fade_${opts.uid} .5s ease-out ${delay}s both"`
    : "";
}

function intensity(n: number): number {
  if (n <= 0) return 0.1;
  if (n <= 2) return 0.3;
  if (n <= 5) return 0.55;
  if (n <= 9) return 0.8;
  return 1;
}

export function render(
  theme: ThemeColors,
  data: CardData,
  x: number,
  y: number,
  w: number,
  opts: RenderOpts,
): string {
  const pitch = 14;
  const cell = 11;
  const weeks = Math.min(52, Math.max(1, Math.floor((w - 30) / pitch)));
  const today = Number.isFinite(opts.today) ? Math.floor(opts.today) : 0;
  const todayDow = new Date(today * 86400000).getUTCDay();
  const gridStart = today - todayDow - (weeks - 1) * 7;
  const todayIso = isoFromEpochDay(today);

  let cells = "";
  let monthLabels = "";
  let lastMonth = -1;

  for (let wk = 0; wk < weeks; wk++) {
    const colDay = gridStart + wk * 7;
    const month = new Date(colDay * 86400000).getUTCMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      monthLabels += text(
        x + 30 + wk * pitch,
        y + 24,
        9,
        400,
        theme.dates,
        MONTHS[month] ?? "",
        "start",
      );
    }
    for (let d = 0; d < 7; d++) {
      const day = colDay + d;
      if (day > today) break;
      const n = Math.max(0, Math.floor(data.calendar[day] ?? 0));
      const op = intensity(n);
      const title =
        n > 0
          ? `<title>${escapeXml(`${n} submission${n === 1 ? "" : "s"} · ${displayDate(isoFromEpochDay(day), todayIso)}`)}</title>`
          : "";
      cells += `<rect x="${x + 30 + wk * pitch}" y="${y + 32 + d * pitch}" width="${cell}" height="${cell}" rx="2" ${fillAttrs(theme.ring, "fill", op)}>${title}</rect>`;
    }
  }

  const legendOps = [0.1, 0.3, 0.55, 0.8, 1];
  const legend = legendOps
    .map(
      (op, i) =>
        `<rect x="${x + w - 108 + i * 14}" y="${y + 136}" width="11" height="11" rx="2" ${fillAttrs(theme.ring, "fill", op)}/>`,
    )
    .join("");

  const style = opts.animate
    ? `<style>@media (prefers-reduced-motion: no-preference){@keyframes hm_fade_${opts.uid}{from{opacity:0}to{opacity:1}}}</style>`
    : "";

  return `${style}
    ${text(x, y + 10, 12, 700, theme.sideLabels, "Submission Heatmap", "start", fadeIn(opts, 1.0))}
    ${monthLabels}
    ${cells}
    ${text(x + w - 118, y + 145, 9, 400, theme.dates, "Less", "end", fadeIn(opts, 1.3))}
    ${legend}
    ${text(x + w - 30, y + 145, 9, 400, theme.dates, "More", "start", fadeIn(opts, 1.3))}`;
}
