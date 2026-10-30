// Theme resolution: name -> base ThemeColors (from themes.json) + per-key overrides + hide_border.
import type { ThemeColors } from "./types";
import themesData from "./themes.json";
import { getDynamicPalette } from "./dynamic-theme";

const themes = themesData as unknown as Record<string, ThemeColors>;

/** All known theme names, as they appear as keys in themes.json. */
export function themeNames(): string[] {
  return Object.keys(themes);
}

function normalizeThemeName(name: string): string {
  return (name ?? "").trim().toLowerCase().replace(/_/g, "-");
}

/**
 * Resolve a theme name to a full ThemeColors, applying per-key overrides and hide_border.
 */
export function resolveTheme(
  name: string,
  overrides: Partial<ThemeColors>,
  hideBorder: boolean,
): ThemeColors {
  const normalized = normalizeThemeName(name);

  let base: ThemeColors;
  if (normalized.startsWith("dynamic")) {
    const isLight = normalized.includes("light");
    const pal = getDynamicPalette(15);
    if (isLight) {
      base = {
        background: "#f6f8fa",
        border: "#d0d7de",
        stroke: "#d0d7de",
        ring: "#" + pal.light_text,
        fire: "#FFA500",
        currStreakNum: "#FFA500",
        currStreakLabel: "#FFA500",
        sideNums: "#1f2328",
        sideLabels: "#" + pal.light_text,
        dates: "#57606a",
        excludeDaysLabel: "#57606a",
      };
    } else {
      base = {
        background: "#161b22",
        border: "#30363d",
        stroke: "#30363d",
        ring: "#" + pal.dark_text,
        fire: "#FFA500",
        currStreakNum: "#FFA500",
        currStreakLabel: "#FFA500",
        sideNums: "#ffffff",
        sideLabels: "#" + pal.dark_text,
        dates: "#8b949e",
        excludeDaysLabel: "#8b949e",
      };
    }
  } else {
    base = Object.prototype.hasOwnProperty.call(themes, normalized)
      ? themes[normalized]
      : themes["default"];
  }

  if (!base) {
    throw new Error(
      "theme.ts: themes.json is missing a 'default' theme entry — cannot resolve any theme.",
    );
  }

  const resolved: ThemeColors = { ...base, ...overrides };

  if (hideBorder) {
    resolved.border = "#0000";
  }

  return resolved;
}
