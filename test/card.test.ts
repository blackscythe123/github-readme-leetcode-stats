// Tests for src/card.ts (+ light coverage of output.ts, since it composes card.ts directly).
// Run with: npx vitest run test/card.test.ts
//
// Node has no DOMParser, so "well-formed" is checked with a small hand-rolled scanner instead
// of a real XML parser: no unescaped `&`, balanced double-quotes, and a tag-name stack that must
// end empty (every opening tag has a matching close; self-closing tags are skipped).

import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ALL_SECTIONS, RenderableError } from "../src/types";
import type { CardData, CardParams, SectionName, ThemeColors } from "../src/types";
import { renderCard, renderErrorCard } from "../src/card";
import { convertHexColors, generateOutput, removeAnimations } from "../src/output";
import { computeStreaks, epochDayNow } from "../src/stats";

const THEMES_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "themes.json",
);
const hasThemes = existsSync(THEMES_PATH);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const DEFAULT_THEME: ThemeColors = {
  background: "#FFFEFE",
  border: "#E4E2E2",
  stroke: "#E4E2E2",
  ring: "#FB8C00",
  fire: "#FB8C00",
  currStreakNum: "#151515",
  sideNums: "#151515",
  currStreakLabel: "#FB8C00",
  sideLabels: "#151515",
  dates: "#464646",
  excludeDaysLabel: "#464646",
};

// A theme whose colors deliberately use alpha-hex (4/8 digit), mirroring real entries found in
// themes.json (e.g. carbonfox.ring="#25BE6AC8"). Exercises the fill/stroke-opacity vs. our own
// decorative `opacity` attribute interaction without producing duplicate XML attributes.
const ALPHA_THEME: ThemeColors = {
  ...DEFAULT_THEME,
  ring: "#25BE6AC8",
  stroke: "#75857555",
  border: "#310C69C5",
};

const today = epochDayNow();
const RECENT_COUNTS = [
  2, 3, 3, 11, 4, 1, 9, 1, 4, 1, 3, 1, 2, 2, 2, 2, 2, 2, 6, 3, 1, 7, 1, 1, 1, 0, 0, 5, 2,
];
const calendar: Record<number, number> = {};
RECENT_COUNTS.forEach((count, i) => {
  const day = today - (RECENT_COUNTS.length - 1 - i);
  if (count > 0) calendar[day] = count;
});
const streaks = computeStreaks(calendar, today);

function buildData(overrides: Partial<CardData> = {}): CardData {
  return {
    username: "blackscythe123",
    realName: "simiyon",
    rank: 2733015,
    avatarDataUri: null,
    solved: {
      easy: { solved: 44, total: 954 },
      medium: { solved: 2, total: 2083 },
      hard: { solved: 0, total: 952 },
      total: 46,
      totalQuestions: 3989,
    },
    totalSubmissions: 105,
    skills: [
      { name: "Array", count: 37 },
      { name: "Hash Table", count: 13 },
      { name: "Sorting", count: 10 },
      { name: "Two Pointers", count: 8 },
      { name: "String", count: 7 },
      { name: "Binary Search", count: 5 },
      { name: "Math", count: 5 },
    ],
    languages: [
      { name: "Python3", count: 44 },
      { name: "Java", count: 4 },
    ],
    calendar,
    reportedStreak: streaks.highestStreak,
    reportedActiveDays: streaks.totalActiveDays,
    ...streaks,
    ...overrides,
  };
}

const BASE_DATA = buildData();

function buildParams(overrides: Partial<CardParams> = {}): CardParams {
  return {
    sections: [...ALL_SECTIONS],
    theme: "default",
    hideBorder: false,
    transparent: false,
    borderRadius: 4.5,
    colorOverrides: {},
    disableAnimations: false,
    shortNumbers: false,
    output: "svg",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Well-formedness scanner
// ---------------------------------------------------------------------------

function assertWellFormed(svg: string): void {
  expect(svg).toContain("<svg");
  expect(svg).toContain("</svg>");

  // No bare, unescaped '&'.
  expect(svg).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;|#)/);

  // Double quotes (the only quote style our templates use for attribute values) must pair up.
  const quoteCount = (svg.match(/"/g) ?? []).length;
  expect(quoteCount % 2).toBe(0);

  // Tag-name stack must return to empty: every non-self-closing opening tag has a matching close.
  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)(?:\s[^<>]*)?\/?>/g;
  const stack: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(svg))) {
    const whole = m[0];
    const name = m[1] as string;
    if (whole.startsWith("</")) {
      expect(stack.pop()).toBe(name);
    } else if (!whole.endsWith("/>")) {
      stack.push(name);
    }
  }
  expect(stack).toEqual([]);
}

// ---------------------------------------------------------------------------
// Full dashboard
// ---------------------------------------------------------------------------

describe("renderCard — full dashboard", () => {
  const svg = renderCard(BASE_DATA, buildParams(), DEFAULT_THEME);

  it("is well-formed", () => {
    assertWellFormed(svg);
  });

  it("has the mock-specified 840x440 chrome", () => {
    expect(svg).toContain('width="840"');
    expect(svg).toContain('height="440"');
    expect(svg).toContain('viewBox="0 0 840 440"');
  });

  it("contains profile content", () => {
    expect(svg).toContain("blackscythe123");
    expect(svg).toContain("Rank 2,733,015");
  });

  it("contains solved content", () => {
    expect(svg).toContain(">46<");
    expect(svg).toContain("Solved");
    expect(svg).toContain("Easy");
    expect(svg).toContain("Medium");
    expect(svg).toContain("Hard");
  });

  it("contains streak content", () => {
    expect(svg).toContain("Total Submissions");
    expect(svg).toContain("Current Streak");
    expect(svg).toContain("Highest Streak");
  });

  it("contains skills chips", () => {
    expect(svg).toContain("Skills");
    expect(svg).toContain("Array ×37");
  });

  it("contains the heatmap", () => {
    expect(svg).toContain("Submission Heatmap");
    expect(svg).toContain("Less");
    expect(svg).toContain("More");
  });

  it("includes per-cell submission tooltips", () => {
    expect(svg).toMatch(/<title>\d+ submissions? · [A-Z][a-z]{2} \d{1,2}(, \d{4})?<\/title>/);
  });

  it("includes fadein/ring/bar animation keyframes by default", () => {
    expect(svg).toContain("<style>");
    expect(svg).toContain("@keyframes");
    expect(svg).toContain("prefers-reduced-motion");
  });
});

// ---------------------------------------------------------------------------
// Escaping / injection safety
// ---------------------------------------------------------------------------

describe("renderCard — escaping", () => {
  it("escapes a hostile username and skill name", () => {
    const hostile = buildData({
      username: `<script>alert(1)</script>&"'`,
      skills: [{ name: `Foo</text><script>bad()</script>`, count: 3 }],
    });
    const svg = renderCard(hostile, buildParams(), DEFAULT_THEME);
    assertWellFormed(svg);
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
  });
});

// ---------------------------------------------------------------------------
// Single-section layouts (every section the layout table explicitly supports on its own)
// ---------------------------------------------------------------------------

describe("renderCard — single-section layouts", () => {
  const singleSections: SectionName[] = ["profile", "solved", "streak", "skills", "languages", "heatmap"];

  for (const section of singleSections) {
    it(`renders "${section}" alone and stays well-formed`, () => {
      const svg = renderCard(BASE_DATA, buildParams({ sections: [section] }), DEFAULT_THEME);
      assertWellFormed(svg);
      expect(svg).toContain("<svg");
    });
  }
});

// ---------------------------------------------------------------------------
// transparent=true
// ---------------------------------------------------------------------------

describe("renderCard — transparent=true", () => {
  it("makes the background fully transparent while keeping border/text colors", () => {
    // Mirrors what params.ts + theme.ts produce: transparent=true forces the resolved theme's
    // background to "#0000"; every other theme key is untouched.
    const transparentTheme: ThemeColors = { ...DEFAULT_THEME, background: "#0000" };
    const svg = renderCard(
      BASE_DATA,
      buildParams({ transparent: true }),
      transparentTheme,
    );
    assertWellFormed(svg);
    expect(svg).toContain('fill="#000000" fill-opacity="0.00"');
    // Border keeps its normal themed color, not transparent.
    expect(svg).toContain(`stroke="${DEFAULT_THEME.border}"`);
  });

  it("combines with hide_border and a custom border_radius", () => {
    const transparentTheme: ThemeColors = { ...DEFAULT_THEME, background: "#0000", border: "#0000" };
    const svg = renderCard(
      BASE_DATA,
      buildParams({ transparent: true, hideBorder: true, borderRadius: 12 }),
      transparentTheme,
    );
    assertWellFormed(svg);
    expect(svg).toContain('rx="12"');
  });
});

// ---------------------------------------------------------------------------
// Gradient background theme
// ---------------------------------------------------------------------------

describe("renderCard — gradient theme", () => {
  it("emits a linearGradient with rotated transform and evenly spaced stops", () => {
    const gradientTheme: ThemeColors = {
      ...DEFAULT_THEME,
      background: "35,4158D0,C850C0,FFCC70",
      border: "#AE58A1",
    };
    const svg = renderCard(BASE_DATA, buildParams(), gradientTheme);
    assertWellFormed(svg);
    expect(svg).toContain("<linearGradient");
    expect(svg).toContain('gradientTransform="rotate(35)"');
    expect(svg).toContain('stop-color="#4158D0"');
    expect(svg).toContain('stop-color="#C850C0"');
    expect(svg).toContain('stop-color="#FFCC70"');
  });
});

// ---------------------------------------------------------------------------
// Alpha-hex theme colors (no duplicate fill-opacity/stroke-opacity attributes)
// ---------------------------------------------------------------------------

describe("renderCard — alpha-hex theme colors", () => {
  it("stays well-formed and never emits a duplicated *-opacity attribute", () => {
    const svg = renderCard(BASE_DATA, buildParams(), ALPHA_THEME);
    assertWellFormed(svg);
    expect(svg).not.toMatch(/fill-opacity="[^"]*"[^>]*fill-opacity="/);
    expect(svg).not.toMatch(/stroke-opacity="[^"]*"[^>]*stroke-opacity="/);
  });
});

// ---------------------------------------------------------------------------
// disable_animations=true
// ---------------------------------------------------------------------------

describe("renderCard — disable_animations=true", () => {
  it("emits no <style> block and no animation/opacity:0 styling", () => {
    const svg = renderCard(BASE_DATA, buildParams({ disableAnimations: true }), DEFAULT_THEME);
    assertWellFormed(svg);
    expect(svg).not.toContain("<style>");
    expect(svg).not.toContain("animation:");
    expect(svg).not.toContain("opacity:0");
  });
});

// ---------------------------------------------------------------------------
// renderErrorCard
// ---------------------------------------------------------------------------

describe("renderErrorCard", () => {
  it("renders a well-formed 495x195 card with the escaped message and no animation", () => {
    const svg = renderErrorCard(`User "<nobody>" & friends not found`, DEFAULT_THEME);
    assertWellFormed(svg);
    expect(svg).toContain('width="495"');
    expect(svg).toContain('height="195"');
    expect(svg).toContain("&quot;&lt;nobody&gt;&quot;");
    expect(svg).not.toContain("<style>");
  });
});

// ---------------------------------------------------------------------------
// output.ts — convertHexColors / removeAnimations / generateOutput
// ---------------------------------------------------------------------------

describe("output.ts", () => {
  it("convertHexColors splits 4/8-digit hex into 6-digit color + *-opacity", () => {
    const out = convertHexColors(`<rect fill="#0f0a" stroke="#39D353CC"/>`);
    expect(out).toContain('fill="#00ff00" fill-opacity="');
    expect(out).toContain('stroke="#39D353" stroke-opacity="');
    expect(out).not.toMatch(/fill="#0f0a"/);
  });

  it("removeAnimations strips <style> blocks and animation declarations", () => {
    const withAnim = `<svg><style>@keyframes x{}</style><rect style="opacity:0;animation:x 1s both"/></svg>`;
    const out = removeAnimations(withAnim);
    expect(out).not.toContain("<style>");
    expect(out).not.toContain("animation:");
    expect(out).not.toContain("opacity: 0;");
  });

  it("generateOutput returns svg content-type for card data", () => {
    const result = generateOutput(BASE_DATA, buildParams());
    expect(result.contentType).toBe("image/svg+xml; charset=utf-8");
    assertWellFormed(result.body);
  });

  it("generateOutput returns json content-type + full data when type=json", () => {
    const result = generateOutput(BASE_DATA, buildParams({ output: "json" }));
    expect(result.contentType).toBe("application/json; charset=utf-8");
    const parsed = JSON.parse(result.body);
    expect(parsed.username).toBe("blackscythe123");
  });

  it("generateOutput renders an error card (svg) for a RenderableError", () => {
    const err = new RenderableError("Could not find that LeetCode user.", 404);
    const result = generateOutput(err, buildParams());
    expect(result.contentType).toBe("image/svg+xml; charset=utf-8");
    assertWellFormed(result.body);
    expect(result.body).toContain("Could not find that LeetCode user.");
  });

  it("generateOutput returns {error, code} json for a RenderableError", () => {
    const err = new RenderableError("Could not find that LeetCode user.", 404);
    const result = generateOutput(err, buildParams({ output: "json" }));
    const parsed = JSON.parse(result.body);
    expect(parsed).toEqual({ error: "Could not find that LeetCode user.", code: 404 });
  });
});

// ---------------------------------------------------------------------------
// Every theme in themes.json (guarded — themes.json is generated by a parallel agent's script;
// if it hasn't landed yet, skip rather than fail the whole file).
// ---------------------------------------------------------------------------

describe.skipIf(!hasThemes)("renderCard — every theme in themes.json", async () => {
  const { resolveTheme, themeNames } = await import("../src/theme");

  for (const name of themeNames()) {
    it(`renders "${name}" as well-formed XML`, () => {
      const theme = resolveTheme(name, {}, false);
      const svg = renderCard(BASE_DATA, buildParams(), theme);
      assertWellFormed(svg);
    });
  }
});

if (!hasThemes) {
  // eslint-disable-next-line no-console
  console.warn(
    "test/card.test.ts: src/themes.json not found — skipped the every-theme suite. " +
      "Re-run once scripts/port-themes.ts has generated it.",
  );
}
