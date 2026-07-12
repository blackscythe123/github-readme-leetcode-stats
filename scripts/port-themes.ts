// Ports the ~166 themes from DenverCoder1/github-readme-streak-stats' themes.php
// into src/themes.json, shaped as Record<string, ThemeColors>.
//
// Usage: npx tsx scripts/port-themes.ts
//
// The upstream file is PHP, not JSON, so we parse it with targeted regexes rather
// than a PHP parser. Validation is intentionally strict: any drift in the upstream
// format (renamed/added/removed keys, malformed color values, a big drop in theme
// count) throws immediately instead of silently producing a broken themes.json.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { ThemeColors } from "../src/types";

const THEMES_PHP_URL =
  "https://raw.githubusercontent.com/DenverCoder1/github-readme-streak-stats/main/src/themes.php";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../src/themes.json");

/** The 11 theme color keys, in the canonical order used everywhere in this repo. */
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

/** #rgb, #rgba, #rrggbb, or #rrggbbaa. */
const HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/;
/** "deg,hex,hex[,hex...]" — background-only linear-gradient encoding. */
const GRADIENT_RE = /^-?\d+(,[0-9a-fA-F]{3,8}){2,}$/;

function isValidHex(value: string): boolean {
  return HEX_COLOR_RE.test(value) && [4, 5, 7, 9].includes(value.length);
}

function isValidGradient(value: string): boolean {
  return GRADIENT_RE.test(value);
}

async function fetchThemesPhp(): Promise<string> {
  const res = await fetch(THEMES_PHP_URL);
  if (!res.ok) {
    throw new Error(
      `port-themes: failed to fetch themes.php — HTTP ${res.status} ${res.statusText} (${THEMES_PHP_URL})`,
    );
  }
  return res.text();
}

/**
 * Parses theme blocks shaped like:
 *   "name" => [
 *       "key" => "value",
 *       ...
 *   ],
 * out of the raw themes.php source.
 */
function parseThemes(phpSource: string): Record<string, ThemeColors> {
  const themes: Record<string, ThemeColors> = {};

  // Match each `"themeName" => [ ...block... ]` at the top level of the returned array.
  // Non-greedy match up to the first `],` that closes this theme's array.
  const blockRe = /"([a-zA-Z0-9_-]+)"\s*=>\s*\[([\s\S]*?)\n\s*\],/g;
  let blockMatch: RegExpExecArray | null;

  while ((blockMatch = blockRe.exec(phpSource)) !== null) {
    const themeName = blockMatch[1];
    const blockBody = blockMatch[2];
    if (themeName === undefined || blockBody === undefined) continue;

    const colors: Partial<Record<(typeof THEME_KEYS)[number], string>> = {};

    // Match each `"key" => "value",` line inside the block.
    const lineRe = /"([a-zA-Z0-9_-]+)"\s*=>\s*"([^"]*)"/g;
    let lineMatch: RegExpExecArray | null;
    while ((lineMatch = lineRe.exec(blockBody)) !== null) {
      const key = lineMatch[1];
      const value = lineMatch[2];
      if (key === undefined || value === undefined) continue;
      (colors as Record<string, string>)[key] = value;
    }

    themes[themeName] = colors as ThemeColors;
  }

  return themes;
}

function validateThemes(themes: Record<string, ThemeColors>): void {
  const names = Object.keys(themes);

  if (names.length < MIN_THEME_COUNT) {
    throw new Error(
      `port-themes: expected at least ${MIN_THEME_COUNT} themes, parsed only ${names.length}. ` +
        `Upstream themes.php format may have changed — inspect the file and update the parser.`,
    );
  }

  if (!("default" in themes)) {
    throw new Error(
      `port-themes: "default" theme is missing from parsed output (${names.length} themes parsed). ` +
        `Upstream themes.php format may have changed.`,
    );
  }

  for (const name of names) {
    const theme = themes[name];
    if (!theme) {
      throw new Error(`port-themes: theme "${name}" parsed to an empty/undefined value.`);
    }

    const presentKeys = Object.keys(theme).sort();
    const expectedKeys = [...THEME_KEYS].sort();
    const missing = expectedKeys.filter((k) => !presentKeys.includes(k));
    const extra = presentKeys.filter((k) => !(expectedKeys as string[]).includes(k));

    if (missing.length > 0 || extra.length > 0) {
      throw new Error(
        `port-themes: theme "${name}" does not have exactly the 11 expected keys. ` +
          `Missing: [${missing.join(", ")}]. Extra: [${extra.join(", ")}]. ` +
          `Parsed keys: [${presentKeys.join(", ")}].`,
      );
    }

    for (const key of THEME_KEYS) {
      const value = theme[key];
      if (typeof value !== "string" || value.length === 0) {
        throw new Error(
          `port-themes: theme "${name}" key "${key}" has an invalid/empty value: ${JSON.stringify(value)}.`,
        );
      }

      const validHex = isValidHex(value);
      const validGradient = key === "background" && isValidGradient(value);

      if (!validHex && !validGradient) {
        throw new Error(
          `port-themes: theme "${name}" key "${key}" has value ${JSON.stringify(value)} which is ` +
            `neither a valid hex color (^#[0-9a-fA-F]{3,8}$) nor` +
            (key === "background" ? ` a valid gradient (^-?\\d+(,[0-9a-fA-F]{3,8}){2,}$).` : ` allowed (gradients are background-only).`),
        );
      }
    }
  }
}

function sortThemesByName(themes: Record<string, ThemeColors>): Record<string, ThemeColors> {
  const sorted: Record<string, ThemeColors> = {};
  for (const name of Object.keys(themes).sort((a, b) => a.localeCompare(b))) {
    const theme = themes[name];
    if (!theme) continue;
    sorted[name] = theme;
  }
  return sorted;
}

async function main(): Promise<void> {
  console.log(`port-themes: fetching ${THEMES_PHP_URL} ...`);
  const phpSource = await fetchThemesPhp();

  console.log("port-themes: parsing theme blocks ...");
  const themes = parseThemes(phpSource);

  console.log(`port-themes: parsed ${Object.keys(themes).length} themes, validating ...`);
  validateThemes(themes);

  const sorted = sortThemesByName(themes);

  writeFileSync(OUTPUT_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf-8");

  console.log(
    `port-themes: OK — wrote ${Object.keys(sorted).length} themes to ${OUTPUT_PATH}`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
