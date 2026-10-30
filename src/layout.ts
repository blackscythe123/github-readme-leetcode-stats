// Maps a `sections` list to card dimensions + per-section (x, y, w) placements + divider lines.
// A small explicit rule table covers every arrangement demonstrated in the approved mock; a
// simple row-stacking fallback generalizes to any other combination. Deliberately not a
// constraint solver — see plan.

import type { SectionName } from "./types";

export interface SectionPlacement {
  section: SectionName;
  x: number;
  y: number;
  w: number;
}

/** A single 1px divider line — a vertical line at x=`a` spanning y=[b1,b2], or a horizontal
 * line at y=`a` spanning x=[b1,b2]. */
export interface DividerLine {
  kind: "v" | "h";
  a: number;
  b1: number;
  b2: number;
}

export interface CardLayout {
  width: number;
  height: number;
  placements: SectionPlacement[];
  dividers: DividerLine[];
}

/** Data-dependent row counts for the chip sections (computed by card.ts via
 * skills.ts::chipRowCount). Consumed by the generic layout so a 2-row chip band
 * gets 104px instead of 78px — otherwise the next divider slices through row 2. */
export interface LayoutHints {
  skillsRows?: 1 | 2;
  languagesRows?: 1 | 2;
}

const CANONICAL_ORDER: SectionName[] = [
  "profile",
  "solved",
  "streak",
  "skills",
  "languages",
  "heatmap",
];

function sortCanonical(sections: SectionName[]): SectionName[] {
  const set = new Set(sections);
  return CANONICAL_ORDER.filter((s) => set.has(s));
}

function vline(x: number, y1: number, y2: number): DividerLine {
  return { kind: "v", a: x, b1: y1, b2: y2 };
}

function hline(y: number, x1: number, x2: number): DividerLine {
  return { kind: "h", a: y, b1: x1, b2: x2 };
}

// ---------------------------------------------------------------------------
// Explicit rule table — geometry ported verbatim from the approved mock (or the exact numbers
// given in the build spec) for every arrangement that was actually designed/demonstrated.
// ---------------------------------------------------------------------------

// NOTE: no explicit entry nests chip sections in the 460px right column anymore — the user
// wants skills/languages always full-width, which the generic layout provides (with correct
// row-aware heights via LayoutHints).
const EXPLICIT: Record<string, CardLayout> = {
  "profile,solved": {
    width: 370,
    height: 195,
    placements: [
      { section: "profile", x: 20, y: 20, w: 330 },
      { section: "solved", x: 10, y: 72, w: 350 },
    ],
    dividers: [],
  },
  solved: {
    width: 370,
    height: 140,
    placements: [{ section: "solved", x: 10, y: 22, w: 350 }],
    dividers: [],
  },
  streak: {
    width: 370,
    height: 195,
    placements: [{ section: "streak", x: 10, y: 50, w: 350 }],
    dividers: [],
  },
  heatmap: {
    width: 840,
    height: 200,
    placements: [{ section: "heatmap", x: 24, y: 20, w: 792 }],
    dividers: [],
  },
  "profile,solved,streak": {
    width: 840,
    height: 220,
    placements: [
      { section: "profile", x: 24, y: 22, w: 306 },
      { section: "solved", x: 24, y: 78, w: 306 },
      { section: "streak", x: 340, y: 60, w: 470 },
    ],
    dividers: [vline(330, 24, 196)],
  },
  profile: {
    width: 340,
    height: 80,
    placements: [{ section: "profile", x: 24, y: 22, w: 306 }],
    dividers: [],
  },
  skills: {
    width: 840,
    height: 120,
    placements: [{ section: "skills", x: 24, y: 22, w: 792 }],
    dividers: [],
  },
  languages: {
    width: 840,
    height: 120,
    placements: [{ section: "languages", x: 24, y: 22, w: 792 }],
    dividers: [],
  },
};

// ---------------------------------------------------------------------------
// Generic fallback: rows stack top to bottom, height accumulates. Used for any combination not
// in the explicit table above (e.g. "solved,streak", "profile,heatmap", "streak,languages,heatmap").
// ---------------------------------------------------------------------------

const MARGIN = 24;
const CARD_W = 840;
const LEFT_W = 306;
const RIGHT_X = 340;
const RIGHT_W = 470;
const DIVIDER_X = 330;
const PROFILE_H = 56; // vertical space "profile" alone occupies before the next block
const SOLVED_ALONE_H = 116; // height added by "solved" when it opens the left column
const SOLVED_AFTER_PROFILE_H = 118; // height added by "solved" following "profile"
const STREAK_CONTENT_H = 98; // vertical extent of streak's own content
const ROW_GAP = 24;
/** Chip band heights: content bottom is y+42 (1 row) / y+68 (2 rows); the following divider
 * sits 24px below content, the next section 12px after that. */
const CHIPS_1ROW_H = 78;
const CHIPS_2ROW_H = 104;
const HEATMAP_H = 180;

function chipBandHeight(sec: SectionName, hints: LayoutHints): number {
  const rows = sec === "skills" ? hints.skillsRows : hints.languagesRows;
  return rows === 2 ? CHIPS_2ROW_H : CHIPS_1ROW_H;
}

function genericLayout(secs: SectionName[], hints: LayoutHints): CardLayout {
  const leftSecs = secs.filter((s) => s === "profile" || s === "solved");
  const hasStreak = secs.includes("streak");
  const middleSecs = secs.filter((s) => s === "skills" || s === "languages");
  const hasHeatmap = secs.includes("heatmap");

  const placements: SectionPlacement[] = [];
  const dividers: DividerLine[] = [];
  let y = MARGIN;
  let lastKind: "top" | "middle" | "heatmap" | "none" = "none";

  if (leftSecs.length > 0 || hasStreak) {
    const hasP = leftSecs.includes("profile");
    const hasS = leftSecs.includes("solved");
    let leftBottom = y;

    if (leftSecs.length > 0) {
      const profileY = y - 2;
      if (hasP) placements.push({ section: "profile", x: MARGIN, y: profileY, w: LEFT_W });
      const solvedY = hasP ? profileY + 56 : profileY;
      if (hasS) placements.push({ section: "solved", x: MARGIN, y: solvedY, w: LEFT_W });
      leftBottom = hasS
        ? solvedY + (hasP ? SOLVED_AFTER_PROFILE_H : SOLVED_ALONE_H)
        : profileY + PROFILE_H;
    }

    let rightBottom = y;
    if (hasStreak) {
      const streakY =
        leftSecs.length > 0
          ? y + Math.max(6, (leftBottom - y - STREAK_CONTENT_H) / 2)
          : y + 6;
      placements.push({ section: "streak", x: RIGHT_X, y: Math.round(streakY), w: RIGHT_W });
      rightBottom = streakY + STREAK_CONTENT_H;
    }

    const rowBottom = Math.max(leftBottom, rightBottom, y + PROFILE_H);
    if (leftSecs.length > 0 && hasStreak) {
      dividers.push(vline(DIVIDER_X, y, Math.round(rowBottom)));
    }
    y = Math.round(rowBottom) + ROW_GAP;
    lastKind = "top";
  }

  for (const sec of middleSecs) {
    if (lastKind !== "none") dividers.push(hline(y - 12, MARGIN, CARD_W - MARGIN));
    placements.push({ section: sec, x: MARGIN, y, w: CARD_W - MARGIN * 2 });
    y += chipBandHeight(sec, hints);
    lastKind = "middle";
  }

  if (hasHeatmap) {
    if (lastKind !== "none") dividers.push(hline(y - 12, MARGIN, CARD_W - MARGIN));
    placements.push({ section: "heatmap", x: MARGIN, y, w: CARD_W - MARGIN * 2 });
    y += HEATMAP_H;
    lastKind = "heatmap";
  }

  const height = lastKind === "heatmap" ? y : y + 20;
  return { width: CARD_W, height, placements, dividers };
}

export function layout(sections: SectionName[], hints: LayoutHints = {}): CardLayout {
  const secs = sortCanonical(sections);
  if (secs.length === 0) {
    // Defensive: params.ts never produces an empty list, but don't emit a 0x0 SVG if it happened.
    return { width: 340, height: 80, placements: [], dividers: [] };
  }
  const key = secs.join(",");
  const explicit = EXPLICIT[key];
  if (explicit) return explicit;
  return genericLayout(secs, hints);
}
