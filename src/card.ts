// SVG card composer: chrome (clip/background/gradient/border), dividers, and section assembly.
// Also the error card (always renders successfully so GitHub's camo shows a card, never a
// broken image).
//
// Note on `transparent=true`: params.ts already forces colorOverrides.background = "#0000" and
// theme.ts merges overrides over the base theme, so by the time `theme` reaches renderCard()
// here, `theme.background` is already the correct transparent value on any theme/gradient — no
// special-casing needed in this file.

import type { CardData, CardParams, SectionName, ThemeColors } from "./types";
import { fillAttrs, escapeXml } from "./format";
import { layout } from "./layout";
import { epochDayNow } from "./stats";
import { render as renderProfile } from "./sections/profile";
import { render as renderSolved } from "./sections/solved";
import { render as renderStreak } from "./sections/streak";
import { renderSkills, renderLanguages } from "./sections/skills";
import { render as renderHeatmap } from "./sections/heatmap";

interface SectionOpts {
  animate: boolean;
  uid: string;
  today: number;
  short: boolean;
  topSkills: number;
  topLangs: number;
}

type SectionRenderer = (
  theme: ThemeColors,
  data: CardData,
  x: number,
  y: number,
  w: number,
  opts: SectionOpts,
) => string;

const RENDERERS: Record<SectionName, SectionRenderer> = {
  profile: renderProfile,
  solved: renderSolved,
  streak: renderStreak,
  skills: renderSkills,
  languages: renderLanguages,
  heatmap: renderHeatmap,
};

let uidCounter = 0;

/** Alphanumeric-only id prefix, unique per render call — never needs XML escaping. */
function nextUid(): string {
  uidCounter = (uidCounter + 1) % 1_000_000;
  const rand = Math.random().toString(36).slice(2, 8);
  return `lc${uidCounter}${rand}`;
}

const HEX_STOP_RE = /^[0-9a-fA-F]{3,8}$/;

/** Parses a background value that is either a plain color or a "deg,hex,hex[,hex...]" gradient
 * spec (already validated upstream by params.ts, but defensively re-checked here). */
function buildBackground(
  background: string,
  uid: string,
): { defs: string; fillAttr: string } {
  const safeBackground = typeof background === "string" ? background : "#000000";
  const parts = safeBackground.split(",");
  if (parts.length >= 3) {
    const rotationRaw = Number(parts[0]);
    const rotation = Number.isFinite(rotationRaw) ? rotationRaw : 0;
    const stops = parts.slice(1);
    const stopEls = stops
      .map((c, i) => {
        const offset = stops.length > 1 ? ((i * 100) / (stops.length - 1)).toFixed(1) : "0";
        const hex = HEX_STOP_RE.test(c) ? c : "000000";
        return `<stop offset="${offset}%" stop-color="#${hex}"/>`;
      })
      .join("");
    return {
      defs: `<linearGradient id="bg_${uid}" gradientTransform="rotate(${rotation})" gradientUnits="userSpaceOnUse">${stopEls}</linearGradient>`,
      fillAttr: `fill="url(#bg_${uid})"`,
    };
  }
  return { defs: "", fillAttr: fillAttrs(safeBackground, "fill") };
}

export function renderCard(data: CardData, params: CardParams, theme: ThemeColors): string {
  const cardLayout = layout(params.sections);
  const { width, height, placements, dividers } = cardLayout;
  const uid = nextUid();
  const animate = !params.disableAnimations;
  const today = epochDayNow();
  const radius = Math.max(0, Math.min(params.borderRadius, width / 2, height / 2));

  const { defs: gradientDefs, fillAttr: bgFill } = buildBackground(theme.background, uid);

  const opts: SectionOpts = {
    animate,
    uid,
    today,
    short: params.shortNumbers,
    topSkills: params.topSkills,
    topLangs: params.topLangs,
  };

  const sectionsMarkup = placements
    .map((p) => RENDERERS[p.section](theme, data, p.x, p.y, p.w, opts))
    .join("\n");

  const dividerMarkup = dividers
    .map((d) =>
      d.kind === "v"
        ? `<line x1="${d.a}" y1="${d.b1}" x2="${d.a}" y2="${d.b2}" stroke-width="1" ${fillAttrs(theme.stroke, "stroke", 0.6)}/>`
        : `<line x1="${d.b1}" y1="${d.a}" x2="${d.b2}" y2="${d.a}" stroke-width="1" ${fillAttrs(theme.stroke, "stroke", 0.6)}/>`,
    )
    .join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate">
  <defs>
    ${gradientDefs}
    <clipPath id="clip_${uid}"><rect width="${width}" height="${height}" rx="${radius}"/></clipPath>
  </defs>
  <g clip-path="url(#clip_${uid})">
    <rect ${fillAttrs(theme.border, "stroke")} ${bgFill} rx="${radius}" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}"/>
    ${dividerMarkup}
    ${sectionsMarkup}
  </g>
</svg>`;
}

// Sad-face path ported verbatim from DenverCoder1/github-readme-streak-stats
// (src/card.php::generateErrorCard, MIT) so the error card matches the original project's look.
const SAD_FACE_PATHS = [
  "M0,35.8c-25.2,0-45.7,20.5-45.7,45.7s20.5,45.8,45.7,45.8s45.7-20.5,45.7-45.7S25.2,35.8,0,35.8z M0,122.3c-11.2,0-21.4-4.5-28.8-11.9c-2.9-2.9-5.4-6.3-7.4-10c-3-5.7-4.6-12.1-4.6-18.9c0-22.5,18.3-40.8,40.8-40.8 c10.7,0,20.4,4.1,27.7,10.9c3.8,3.5,6.9,7.7,9.1,12.4c2.6,5.3,4,11.3,4,17.6C40.8,104.1,22.5,122.3,0,122.3z",
  "M4.8,93.8c5.4,1.1,10.3,4.2,13.7,8.6l3.9-3c-4.1-5.3-10-9-16.6-10.4c-10.6-2.2-21.7,1.9-28.3,10.4l3.9,3 C-13.1,95.3-3.9,91.9,4.8,93.8z",
];

export function renderErrorCard(
  message: string,
  theme: ThemeColors,
  borderRadius = 4.5,
): string {
  const width = 495;
  const height = 195;
  const uid = nextUid();
  const radius = Math.max(0, Math.min(Number.isFinite(borderRadius) ? borderRadius : 4.5, width / 2, height / 2));
  const cx = width / 2;
  const labelY = height / 2 + 10.5;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate">
  <defs>
    <clipPath id="err_clip_${uid}"><rect width="${width}" height="${height}" rx="${radius}"/></clipPath>
  </defs>
  <g clip-path="url(#err_clip_${uid})">
    <rect ${fillAttrs(theme.border, "stroke")} ${fillAttrs(theme.background, "fill")} rx="${radius}" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}"/>
    <g transform="translate(${cx}, 0)">
      <path ${fillAttrs(theme.fire, "fill")} d="${SAD_FACE_PATHS[0]}"/>
      <path ${fillAttrs(theme.fire, "fill")} d="${SAD_FACE_PATHS[1]}"/>
      <circle ${fillAttrs(theme.fire, "fill")} cx="-15" cy="71" r="4.9"/>
      <circle ${fillAttrs(theme.fire, "fill")} cx="15" cy="71" r="4.9"/>
    </g>
    <g transform="translate(${cx}, ${labelY})">
      <text x="0" y="50" dy="0.25em" text-anchor="middle" ${fillAttrs(theme.sideLabels, "fill")} font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="14px">${escapeXml(message)}</text>
    </g>
  </g>
</svg>`;
}
