# github-readme-leetcode-stats

A composable LeetCode dashboard card for your GitHub README — profile, solved stats, streaks, skills/languages, and a submission heatmap, each section independently toggleable, in 166 themes.

<p align="center">
  <a href="https://github-readme-leetcode-stats.vercel.app/">
    <img src="https://github-readme-leetcode-stats.vercel.app/api/card?sections=profile%2Csolved%2Cstreak%2Cskills%2Clanguages%2Cheatmap&theme=default" alt="LeetCode Stats demo card — all sections, default theme" width="820" />
  </a>
</p>

<p align="center"><sub>⬆ live render from the demo instance, default theme, all six sections — click it to open the interactive demo page</sub></p>

> The card above renders live from `https://github-readme-leetcode-stats.vercel.app`, a single-user demo instance. Once you deploy your own copy (see [Quick start](#quick-start)), replace that domain everywhere in this README with your own deployment's.

## Features

- **Composable sections** — pick any combination of `profile`, `solved`, `streak`, `skills`, `languages`, `heatmap` via `?sections=`; the layout re-flows and the card resizes automatically.
- **166 themes**, ported from [DenverCoder1/github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats), plus per-key color overrides and gradient backgrounds — browse them all in the [theme gallery](docs/themes.md).
- **Real streaks**, computed from your full LeetCode submission calendar (not just the trailing-12-months view), using LeetCode's own UTC day boundary.
- **Load-triggered animations** (progress bars fill, the solved ring sweeps in, numbers pop, the current-streak ring/fire pulse) — these play inside GitHub's `<img>` README embed. Turn them off with `disable_animations=true`.
- **Submission heatmap** with hover tooltips, and a full **interactive demo page** (this project's `/`) with a live control panel and a copy-pasteable embed snippet.
- **Single-user instance, zero database** — one Vercel function, one env var, aggressively cached.

## Quick start

This project is meant to be **deployed as your own instance** — the API only ever serves the one LeetCode user configured via an environment variable, so there's nothing to look up or misuse.

1. **Deploy your own copy:**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fblackscythe123%2Fgithub-readme-leetcode-stats&env=LEETCODE_USERNAME&envDescription=Your%20LeetCode%20username%20%E2%80%94%20the%20card%20will%20only%20ever%20serve%20this%20user%27s%20data)

   Or manually: fork/clone this repo, `vercel link`, then `vercel deploy`.

2. **Set the `LEETCODE_USERNAME` environment variable** in your Vercel project (Settings → Environment Variables) to your LeetCode username. Redeploy if you set it after the first deploy.

3. **Embed the card** in your README:

   ```markdown
   ![LeetCode Stats](https://your-app.vercel.app/api/card)
   ```

4. **Customize it** — open your deployment's root URL (`https://your-app.vercel.app/`) for a live control panel: pick a theme, toggle sections on/off, adjust the border radius, and copy the exact embed snippet for whatever you configure. It falls back to sample data if it can't reach your live API (e.g. before step 2 is done).

## Sections

Every section is optional and composes into the layout independently — the card's width and height adapt to whatever you include. Default (`sections` omitted) is `profile,solved,streak,skills,heatmap`.

| Section | `sections=` value | What it shows |
|---|---|---|
| Profile | `profile` | LeetCode logo, username, global rank, avatar |
| Solved | `solved` | Progress ring (solved / total questions) + Easy/Medium/Hard bars |
| Streak | `streak` | Total submissions · current streak (with fire icon) · highest streak |
| Skills | `skills` | Top problem tags by solved count, as chips (default, part of `sections`' default set). Chip count is capped by `top_skills=` (1–12, default 12). |
| Languages | `languages` | Solved-count chips per programming language (opt-in — not included by default; combine freely with `skills`, e.g. `sections=profile,solved,skills,languages`). Chip count is capped by `top_langs=` (1–12, default 12). |
| Heatmap | `heatmap` | Full submission calendar heatmap (up to 52 weeks) with hover tooltips |

## Options

All query params are validated and clamped server-side — invalid or out-of-range values fall back to defaults rather than erroring.

| Param | Values | Default | Description |
|---|---|---|---|
| `sections` | comma-separated list of `profile`, `solved`, `streak`, `skills`, `languages`, `heatmap` | `profile,solved,streak,skills,heatmap` | Which sections to render. Unknown tokens are dropped; the remaining ones are always rendered in the canonical order above regardless of the order you pass them in. If nothing valid is left, falls back to the default set. |
| `theme` | any theme name from [`src/themes.json`](src/themes.json) (see the [full gallery](docs/themes.md)) | `default` | Case-insensitive; underscores are treated as dashes. Unknown names silently fall back to `default`. |
| `hide_border` | `true` \| `false` | `false` | Makes the card border fully transparent. Combines freely with `transparent` and `border_radius`. |
| `transparent` | `true` \| `false` | `false` | Makes the **card background** fully transparent (`#0000`) regardless of theme — including gradient themes — and overrides any `background=` you also pass. Border, text, and section colors keep their theme values. Combines freely with `hide_border` and `border_radius`. |
| `border_radius` | number, `0`–`60` | `4.5` | Corner rounding in px. `0` = square corners. Non-numeric values fall back to the default. |
| `disable_animations` | `true` \| `false` | `false` | Strips all load-triggered animations (bar fill, ring sweep, number pop-in, streak glow) for a fully static render. |
| `short_numbers` | `true` \| `false` | `false` | Abbreviates large counts, e.g. `1500` → `1.5K`. |
| `top_skills` | integer, `1`–`12` | `12` | Max number of skill chips shown in the `skills` section. Out-of-range values are clamped into `1`–`12`. |
| `top_langs` | integer, `1`–`12` | `12` | Max number of language chips shown in the `languages` section. Out-of-range values are clamped into `1`–`12`. |
| `type` | `svg` \| `json` | `svg` | `svg` returns the card image; `json` returns the raw computed data (used by the demo page and useful for building your own renderer). |
| `background`, `border`, `stroke`, `ring`, `fire`, `currStreakNum`, `sideNums`, `currStreakLabel`, `sideLabels`, `dates`, `excludeDaysLabel` | hex color (`fff`/`ffff`/`ffffff`/`ffffffff`, with or without a leading `#`) or a [standard CSS color name](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color) (e.g. `crimson`) | theme's value | Per-key color overrides on top of the selected `theme`. Invalid values are ignored (the theme's own color is kept). `background` also accepts a gradient: `deg,hex,hex[,hex...]` — a rotation in degrees followed by 2 or more hex color stops, no `#`, e.g. `35,4158d0,c850c0,ffcc70`. |

`true`/`false` flags only recognize the exact lowercase string `true` as "on" — anything else (including the param being omitted) is treated as `false`.

Example combining several options:

```
https://your-app.vercel.app/api/card?theme=github-dark&sections=profile,solved,streak&hide_border=true&border_radius=12&short_numbers=true
```

More examples:

```
# Only the skills section, top 5 chips
https://your-app.vercel.app/api/card?sections=skills&top_skills=5

# Languages instead of skills, top 8 chips, transparent background
https://your-app.vercel.app/api/card?sections=profile,languages&top_langs=8&transparent=true

# A custom gradient background over the tokyonight theme, no border
https://your-app.vercel.app/api/card?theme=tokyonight&background=35,4158d0,c850c0,ffcc70&hide_border=true

# Raw JSON instead of an SVG card
https://your-app.vercel.app/api/card?type=json
```

## Themes

166 themes are available via `?theme=<name>`, ported (with attribution) from `github-readme-streak-stats`. Four popular ones:

| `default` | `dark` | `github-dark` | `tokyonight` |
|---|---|---|---|
| ![default](https://github-readme-leetcode-stats.vercel.app/api/card?sections=profile%2Csolved%2Cstreak%2Cskills%2Clanguages%2Cheatmap&theme=default) | ![dark](https://github-readme-leetcode-stats.vercel.app/api/card?sections=profile%2Csolved%2Cstreak%2Cskills%2Clanguages%2Cheatmap&theme=dark) | ![github-dark](https://github-readme-leetcode-stats.vercel.app/api/card?sections=profile%2Csolved%2Cstreak%2Cskills%2Clanguages%2Cheatmap&theme=github-dark) | ![tokyonight](https://github-readme-leetcode-stats.vercel.app/api/card?sections=profile%2Csolved%2Cstreak%2Cskills%2Clanguages%2Cheatmap&theme=tokyonight) |

### 🎨 [See all 166 themes →](docs/themes.md)

The gallery links above render live from the demo instance with every section enabled, in alphabetical order — pick any `theme` key and drop it into `?theme=<name>` on your own deployment.

## Honest notes

A few things worth knowing before you rely on this:

- **Single-user lock**: the API only ever serves the user configured in the `LEETCODE_USERNAME` env var — any `user=` query param is ignored. This is by design (no database, no per-request LeetCode lookups for strangers, minimal load on LeetCode's API). If the env var isn't set, the endpoint renders a small in-card error message rather than failing the image request.
- **Animations play in GitHub's README embed** (`<img>` tags do run SVG/CSS animations), but **hover interactions do not** — GitHub proxies embedded images through its camo cache as static-ish content, so hover-only effects can't work there. Hover tooltips and any interactivity are demonstrated on the demo page (`/`), which renders the SVG inline.
- **Heatmap tooltips are visible two ways**: on the demo page (custom hover tooltip), and by opening the card's raw SVG URL directly in a browser tab, where each cell has a native `<title>` element browsers show on hover. They will not appear inside the README `<img>` embed itself.
- **Streaks use UTC**, matching LeetCode's own submission-calendar day boundaries. If your local timezone is ahead of UTC, a day that "feels" like today locally may already be tomorrow in UTC (and vice versa) — this is intentional parity with LeetCode's own streak display, not a bug.
- **Data honesty**: every value is computed live from your current LeetCode data on every cache miss — there's no seeded or placeholder data in the deployed card itself (the demo page's *sample-mode* fallback, used only when it can't reach your live API, is clearly labeled as such in its banner).

## Self-hosting & rate limits

- The card endpoint is cached hard (`Cache-Control` with a multi-hour `s-maxage` and a day-long `stale-while-revalidate`) since a single-user instance has a tiny key space — most requests never reach LeetCode at all.
- LeetCode's GraphQL endpoint is unauthenticated but not officially public; be a good citizen — don't script high-frequency requests against your own deployment, and don't remove the caching headers.
- If you self-host somewhere LeetCode blocks (some cloud egress ranges get Cloudflare-challenged), you can proxy through a self-hosted alternative (e.g. `alfa-leetcode-api`) or run this from an unblocked host.

## Local development

No Vercel CLI required:

```bash
npm install
LEETCODE_USERNAME=your-username npm run dev
```

This starts a plain Node server on `http://localhost:3178` that serves the demo page at `/` and adapts requests to the same handler Vercel runs in production at `/api/card` (`/api/card?type=json` for the raw data). Without `LEETCODE_USERNAME` set, `/api/card` renders the same in-card error message a misconfigured deployment would show.

Other useful scripts:

- `npm test` — vitest
- `npm run typecheck` — `tsc --noEmit`
- `npm run port-themes` — regenerates `src/themes.json` from upstream `github-readme-streak-stats`
- `npx tsx scripts/gen-theme-docs.ts` — regenerates [`docs/themes.md`](docs/themes.md)'s preview gallery from `src/themes.json` (run this after `npm run port-themes` if the theme catalog changed)

## Attribution

Card chrome (border/clip/gradient rendering), the theme catalog, and the overall visual language are adapted from [DenverCoder1/github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats) (MIT License, © Jonah Lawrence) — see [`LICENSE`](./LICENSE) for the full notice. LeetCode-specific data, layout composition, streak computation, and the section system in this project are original.

## License

[MIT](./LICENSE)
