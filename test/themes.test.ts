import { describe, expect, it } from "vitest";
import themes from "../src/themes.json";
import type { ThemeColors } from "../src/types";

const THEME_KEYS = [
  "background",
  "border",
  "stroke",
  "ring",
  "fire",
  "currStreakNum",
  "sideNums",
  "currStreakLabel",
  "sideLabels",
  "dates",
  "excludeDaysLabel",
] as const;

const MIN_THEME_COUNT = 160;

const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/;
const GRADIENT_RE = /^-?\d+(,[0-9a-fA-F]{3,8}){2,}$/;

const themeEntries = Object.entries(themes as Record<string, ThemeColors>);

describe("src/themes.json integrity", () => {
  it("has at least the minimum expected number of themes", () => {
    expect(themeEntries.length).toBeGreaterThanOrEqual(MIN_THEME_COUNT);
  });

  it("includes the 'default' theme", () => {
    expect(themes).toHaveProperty("default");
  });

  it("is sorted by theme name", () => {
    const names = themeEntries.map(([name]) => name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("every theme has exactly the 11 expected keys", () => {
    for (const [name, theme] of themeEntries) {
      const keys = Object.keys(theme).sort();
      expect(keys, `theme "${name}" keys`).toEqual([...THEME_KEYS].sort());
    }
  });

  it("every value is a valid hex color, except background which may also be a gradient", () => {
    for (const [name, theme] of themeEntries) {
      for (const key of THEME_KEYS) {
        const value = theme[key];
        expect(typeof value, `theme "${name}".${key} type`).toBe("string");

        const isHex = HEX_COLOR_RE.test(value);
        const isGradient = key === "background" && GRADIENT_RE.test(value);

        expect(
          isHex || isGradient,
          `theme "${name}".${key} = ${JSON.stringify(value)} is neither a valid hex color nor (for background) a valid gradient`,
        ).toBe(true);
      }
    }
  });

  it("non-background keys are never gradients", () => {
    for (const [name, theme] of themeEntries) {
      for (const key of THEME_KEYS) {
        if (key === "background") continue;
        expect(
          HEX_COLOR_RE.test(theme[key]),
          `theme "${name}".${key} = ${JSON.stringify(theme[key])} must be a hex color, not a gradient`,
        ).toBe(true);
      }
    }
  });

  it("github-dark background is #0D1117", () => {
    expect(themes).toHaveProperty("github-dark");
    expect((themes as Record<string, ThemeColors>)["github-dark"]?.background).toBe("#0D1117");
  });
});
