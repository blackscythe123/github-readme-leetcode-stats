// Generates docs/themes.md + docs/previews/<theme>.svg — a STATIC preview gallery of every
// theme in src/themes.json.
//
// Run: npm run gen-theme-docs   (or: npx tsx scripts/gen-theme-docs.ts)
//
// The cards are rendered locally by the same renderer the API uses (one LeetCode fetch for
// live data, then 166 in-process renders) and committed as static SVGs. GitHub serves them
// directly, so browsing the gallery costs the deployed instance ZERO function invocations —
// previously each themes.md view fired ~166 live API calls.
//
// Re-run whenever src/themes.json or the renderer changes.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { fetchRawData } from "../src/leetcode";
import { computeStreaks, epochDayNow } from "../src/stats";
import { parseParams } from "../src/params";
import { generateOutput } from "../src/output";
import type { CardData } from "../src/types";

// CJS package (no "type": "module") — __dirname is the Node built-in here.
const THEMES_PATH = resolve(__dirname, "../src/themes.json");
const DOCS_DIR = resolve(__dirname, "../docs");
const PREVIEWS_DIR = resolve(DOCS_DIR, "previews");
const OUT_PATH = resolve(DOCS_DIR, "themes.md");

const USERNAME = process.env.LEETCODE_USERNAME ?? "blackscythe123";
const ALL_SECTIONS = "profile,solved,streak,skills,languages,heatmap";

async function main(): Promise<void> {
  const raw = readFileSync(THEMES_PATH, "utf8");
  const themes = JSON.parse(raw) as Record<string, unknown>;
  const names = Object.keys(themes).sort((a, b) => a.localeCompare(b));

  if (names.length === 0) {
    throw new Error(
      "gen-theme-docs: src/themes.json has no themes — refusing to write an empty gallery.",
    );
  }

  console.log(`gen-theme-docs: fetching live data for ${USERNAME} (single API call) ...`);
  const rawData = await fetchRawData(USERNAME);
  const data: CardData = { ...rawData, ...computeStreaks(rawData.calendar, epochDayNow()) };
  // Don't bake the owner's photo into 166 committed files — the initial-letter fallback
  // renders instead. Live cards still show the real avatar.
  data.avatarDataUri = null;

  if (!existsSync(PREVIEWS_DIR)) {
    mkdirSync(PREVIEWS_DIR, { recursive: true });
  }

  console.log(`gen-theme-docs: rendering ${names.length} theme previews locally ...`);
  for (const name of names) {
    const params = parseParams({ sections: ALL_SECTIONS, theme: name });
    const { body } = generateOutput(data, params);
    if (!body.startsWith("<svg")) {
      throw new Error(`gen-theme-docs: theme "${name}" did not render an SVG.`);
    }
    writeFileSync(resolve(PREVIEWS_DIR, `${name}.svg`), body, "utf8");
  }

  const lines: string[] = [];
  lines.push("# Theme gallery");
  lines.push("");
  lines.push(
    `Every theme in [\`src/themes.json\`](../src/themes.json) — **${names.length} themes** — ` +
      "previewed below with every section turned on " +
      "(`sections=profile,solved,streak,skills,languages,heatmap`).",
  );
  lines.push("");
  lines.push(
    "The previews are static SVGs pre-rendered by " +
      "[`scripts/gen-theme-docs.ts`](../scripts/gen-theme-docs.ts) and committed to the repo, " +
      "so browsing this page puts **zero load** on the live instance. They're regenerated " +
      "whenever the themes or the renderer change, and live cards additionally show your " +
      "avatar. For an interactive preview with your own toggles, use the " +
      "[live demo](https://github-readme-leetcode-stats.vercel.app/).",
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
    lines.push(`| \`${name}\` | ![${name}](previews/${name}.svg) |`);
  }

  lines.push("");
  writeFileSync(OUT_PATH, lines.join("\n"), "utf8");

  // Verify: every theme must have a table row AND a preview file on disk.
  const written = readFileSync(OUT_PATH, "utf8");
  const missing = names.filter(
    (name) =>
      !written.includes(`| \`${name}\` |`) ||
      !existsSync(resolve(PREVIEWS_DIR, `${name}.svg`)),
  );
  if (missing.length > 0) {
    throw new Error(
      `gen-theme-docs: ${missing.length} theme(s) missing a row or preview file: ` +
        missing.join(", "),
    );
  }

  console.log(
    `docs/themes.md + ${names.length} static previews written to docs/previews/ (verified).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
