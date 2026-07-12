// Skills / Languages chip section — shared chip renderer, two named exports per the contract
// (renderSkills uses data.skills + "Skills" header, renderLanguages uses data.languages +
// "Languages" header). Geometry ported from scratchpad/leetcode-dashboard-mock.html's secSkills().

import type { CardData, NamedCount, ThemeColors } from "../types";
import { escapeXml, fillAttrs } from "../format";

const FONT = "'Segoe UI', Ubuntu, sans-serif";

interface RenderOpts {
  animate: boolean;
  uid: string;
  today: number;
  short: boolean;
  topSkills: number;
  topLangs: number;
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

function fadeIn(opts: RenderOpts, kind: string, delay: number): string {
  return opts.animate
    ? ` style="opacity:0;animation:${kind}_fade_${opts.uid} .4s ease-out ${Math.min(delay, 1.4).toFixed(2)}s both"`
    : "";
}

function renderChips(
  theme: ThemeColors,
  items: NamedCount[],
  x: number,
  y: number,
  w: number,
  header: string,
  kind: "sk" | "lg",
  opts: RenderOpts,
  cap: number,
): string {
  const totalItems = items.length;
  const cappedItems = items.slice(0, cap);
  let cx = x;
  let cy = y + 22;
  let shown = 0;
  const chips: string[] = [];

  for (const item of cappedItems) {
    const label = `${item.name} ×${item.count}`;
    const cw = label.length * 6.2 + 18;
    if (cx + cw > x + w) {
      cx = x;
      cy += 26;
      if (cy > y + 52) break;
    }
    const delay = 0.85 + shown * 0.05;
    // Two stacked rects (fill-only, then stroke-only) since fill and stroke need different
    // decorative alpha (0.14 vs 0.35) — each folds its flat alpha into fillAttrs()'s own
    // fill-opacity/stroke-opacity via the decorativeOpacity param rather than stacking a
    // separate `opacity="..."` attribute, which would compound multiplicatively with any
    // alpha-hex theme color and silently dim the chip further than intended.
    chips.push(
      `<g${fadeIn(opts, kind, delay)}>
        <rect x="${cx}" y="${cy}" width="${cw.toFixed(1)}" height="20" rx="10" ${fillAttrs(theme.ring, "fill", 0.14)}/>
        <rect x="${cx}" y="${cy}" width="${cw.toFixed(1)}" height="20" rx="10" fill="none" ${fillAttrs(theme.ring, "stroke", 0.35)}/>
        ${text(cx + cw / 2, cy + 14, 10.5, 600, theme.sideNums, label)}
      </g>`,
    );
    cx += cw + 8;
    shown++;
  }

  let html = text(x, y + 10, 12, 700, theme.sideLabels, header, "start", fadeIn(opts, kind, 0.8));
  html += chips.join("");
  if (shown < totalItems) {
    html += text(
      cx + 4,
      cy + 14,
      10.5,
      400,
      theme.dates,
      `+${totalItems - shown} more`,
      "start",
      fadeIn(opts, kind, 0.85 + shown * 0.05),
    );
  }

  const style = opts.animate
    ? `<style>@media (prefers-reduced-motion: no-preference){@keyframes ${kind}_fade_${opts.uid}{from{opacity:0}to{opacity:1}}}</style>`
    : "";

  return `${style}${html}`;
}

export function renderSkills(
  theme: ThemeColors,
  data: CardData,
  x: number,
  y: number,
  w: number,
  opts: RenderOpts,
): string {
  return renderChips(theme, data.skills, x, y, w, "Skills", "sk", opts, opts.topSkills);
}

export function renderLanguages(
  theme: ThemeColors,
  data: CardData,
  x: number,
  y: number,
  w: number,
  opts: RenderOpts,
): string {
  return renderChips(theme, data.languages, x, y, w, "Languages", "lg", opts, opts.topLangs);
}
