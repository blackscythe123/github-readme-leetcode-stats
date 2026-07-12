# github-readme-leetcode-stats

A composable LeetCode dashboard card for your GitHub README — profile, solved stats, streaks, skills/languages, and a submission heatmap, each section independently toggleable, in 160+ themes.

<p align="center">
  <img src="https://YOUR-DEPLOYMENT.vercel.app/api/card" alt="LeetCode Stats" width="820" />
</p>

> Replace `YOUR-DEPLOYMENT.vercel.app` everywhere in this README with your own deployment's domain once you've deployed your own instance (see [Quick start](#quick-start)).

## Features

- **Composable sections** — pick any combination of `profile`, `solved`, `streak`, `skills`, `languages`, `heatmap` via `?sections=`; the layout re-flows and the card resizes automatically.
- **160+ themes**, ported from [DenverCoder1/github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats), plus per-key color overrides and gradient backgrounds.
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
| Skills | `skills` | Top problem tags by solved count, as chips (default, part of `sections`' default set) |
| Languages | `languages` | Solved-count chips per programming language (opt-in — not included by default; combine freely with `skills`, e.g. `sections=profile,solved,skills,languages`) |
| Heatmap | `heatmap` | Full submission calendar heatmap (up to 52 weeks) with hover tooltips |

## Options

All query params are validated and clamped server-side — invalid values fall back to defaults rather than erroring.

| Param | Values | Default | Description |
|---|---|---|---|
| `sections` | comma-separated list from the table above | `profile,solved,streak,skills,heatmap` | Which sections to render, and in what order. |
| `theme` | any theme name from `src/themes.json` | `default` | Unknown names silently fall back to `default`. |
| `hide_border` | `true` \| `false` | `false` | Makes the card border fully transparent. Combines freely with `transparent` and `border_radius`. |
| `transparent` | `true` \| `false` | `false` | Makes the **card background** fully transparent (`#0000`) regardless of theme — including gradient themes. Border, text, and section colors keep their theme values. Combines freely with `hide_border` and `border_radius`. |
| `border_radius` | number, `0`–`60` | `4.5` | Corner rounding in px. `0` = square corners. |
| `disable_animations` | `true` \| `false` | `false` | Strips all load-triggered animations (bar fill, ring sweep, number pop-in, streak glow) for a fully static render. |
| `short_numbers` | `true` \| `false` | `false` | Abbreviates large counts, e.g. `1500` → `1.5K`. |
| `type` | `svg` \| `json` | `svg` | `svg` returns the card image; `json` returns the raw computed data (used by the demo page and useful for building your own renderer). |
| `background`, `border`, `stroke`, `ring`, `fire`, `currStreakNum`, `sideNums`, `currStreakLabel`, `sideLabels`, `dates`, `excludeDaysLabel` | hex color (3/4/6/8-digit) | theme's value | Per-key color overrides on top of the selected `theme`. `background` also accepts a gradient: `deg,hex,hex[,hex...]` (e.g. `35,4158D0,C850C0,FFCC70`). |

Example combining several options:

```
https://your-app.vercel.app/api/card?theme=github-dark&sections=profile,solved,streak&hide_border=true&border_radius=12&short_numbers=true
```

## Theme gallery

The full catalog (166 themes, ported with attribution from `github-readme-streak-stats`) lives in [`src/themes.json`](./src/themes.json) — pass any key from that file as `?theme=`. A sample:

| Theme | Preview |
|---|---|
| `default` | `?theme=default` |
| `dark` | `?theme=dark` |
| `radical` | `?theme=radical` |
| `merko` | `?theme=merko` |
| `gruvbox` | `?theme=gruvbox` |
| `tokyonight` | `?theme=tokyonight` |
| `onedark` | `?theme=onedark` |
| `cobalt` | `?theme=cobalt` |
| `synthwave` | `?theme=synthwave` |
| `highcontrast` | `?theme=highcontrast` |
| `dracula` | `?theme=dracula` |
| `algolia` | `?theme=algolia` |
| `gotham` | `?theme=gotham` |
| `monokai` | `?theme=monokai` |
| `nord` | `?theme=nord` |
| `shades-of-purple` | `?theme=shades-of-purple` |
| `vue` | `?theme=vue` |
| `react` | `?theme=react` |
| `github-dark` | `?theme=github-dark` |
| `ambient-gradient` (gradient background) | `?theme=ambient-gradient` |

Each preview link is `https://your-app.vercel.app/api/card?theme=<name>` — swap in your own deployment domain. Browse and live-preview **all 166 themes** interactively on your deployment's demo page (`/`), which also shows every section-composition option.

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

Other useful scripts: `npm test` (vitest), `npm run typecheck` (`tsc --noEmit`), `npm run port-themes` (regenerates `src/themes.json` from upstream).

## Attribution

Card chrome (border/clip/gradient rendering), the theme catalog, and the overall visual language are adapted from [DenverCoder1/github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats) (MIT License, © Jonah Lawrence) — see [`LICENSE`](./LICENSE) for the full notice. LeetCode-specific data, layout composition, streak computation, and the section system in this project are original.

## License

[MIT](./LICENSE)
