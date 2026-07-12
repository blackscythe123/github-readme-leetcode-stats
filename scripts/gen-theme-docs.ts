// Generates docs/themes.md — a live preview gallery of every theme in src/themes.json.
//
// Run: npx tsx scripts/gen-theme-docs.ts
//
// Each row's preview image is a live URL against the hosted demo instance, so the gallery
// always reflects the actual current render (not a checked-in screenshot). Re-run this script
// whenever src/themes.json changes (e.g. after `npm run port-themes`).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// CJS package (no "type": "module") — __dirname is the Node built-in here.
const THEMES_PATH = resolve(__dirname, "../src/themes.json");
const DOCS_DIR = resolve(__dirname, "../docs");
const OUT_PATH = resolve(DOCS_DIR, "themes.md");

// The single-user demo instance these previews render from. Self-hosters swap this for their
// own deployment's domain (see the generated header below).
const DEMO_BASE_URL = "https://github-readme-leetcode-stats.vercel.app";
// All sections enabled, comma-separated and percent-encoded, matching what the README's
// "Options" section documents for `sections=`.
const ALL_SECTIONS_QS = "profile%2Csolved%2Cstreak%2Cskills%2Clanguages%2Cheatmap";

function previewUrl(theme: string): string {
  return `${DEMO_BASE_URL}/api/card?sections=${ALL_SECTIONS_QS}&theme=${theme}`;
}

function main(): void {
  const raw = readFileSync(THEMES_PATH, "utf8");
  const themes = JSON.parse(raw) as Record<string, unknown>;
  const names = Object.keys(themes).sort((a, b) => a.localeCompare(b));

  if (names.length === 0) {
    throw new Error(
      "gen-theme-docs: src/themes.json has no themes — refusing to write an empty gallery.",
    );
  }

  const lines: string[] = [];
  lines.push("# Theme gallery");
  lines.push("");
  lines.push(
    `Every theme in [\`src/themes.json\`](../src/themes.json) — **${names.length} themes** — ` +
      "previewed live below.",
  );
  lines.push("");
  lines.push(
    "These preview images render **live** from the hosted demo instance " +
      `(\`${DEMO_BASE_URL}\`) with every section turned on ` +
      "(`sections=profile,solved,streak,skills,languages,heatmap`), so what you see here is " +
      "exactly what that theme looks like right now against real data — not a static, " +
      "possibly-stale screenshot.",
  );
  lines.push("");
  lines.push(
    "**Self-hosting your own instance?** Every image/link below points at the demo domain — " +
      `\`${DEMO_BASE_URL}\`. Swap that for your own deployment's domain (e.g. ` +
      "`https://your-app.vercel.app/api/card?theme=<name>`) and the rest of the URL works " +
      "unchanged. Drop or reorder `sections=` to match whichever sections you actually use — " +
      "it doesn't have to be all six.",
  );
  lines.push("");
  lines.push(
    "Pick a theme name from the table below, then pass it as `?theme=<name>` on your own " +
      "card URL. See the [main README](../README.md#options) for the full list of query params.",
  );
  lines.push("");
  lines.push("| Theme | Preview |");
  lines.push("|---|---|");

  for (const name of names) {
    lines.push(`| \`${name}\` | ![${name}](${previewUrl(name)}) |`);
  }

  lines.push("");

  if (!existsSync(DOCS_DIR)) {
    mkdirSync(DOCS_DIR, { recursive: true });
  }

  const output = lines.join("\n");
  writeFileSync(OUT_PATH, output, "utf8");

  // Verify: every theme name from themes.json must actually appear (as a table row) in the
  // file we just wrote. Fail loudly rather than silently shipping a partial gallery.
  const written = readFileSync(OUT_PATH, "utf8");
  const missing = names.filter((name) => !written.includes(`| \`${name}\` |`));
  if (missing.length > 0) {
    throw new Error(
      `gen-theme-docs: docs/themes.md is missing ${missing.length} theme(s) after generation: ` +
        missing.join(", "),
    );
  }

  console.log(`docs/themes.md written with all ${names.length} themes (verified).`);
}

main();
