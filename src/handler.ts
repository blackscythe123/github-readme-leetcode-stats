import type { VercelRequest, VercelResponse } from "@vercel/node";

import { RenderableError, type CardData } from "./types";
import { parseParams } from "./params";
import { fetchRawData } from "./leetcode";
import { computeStreaks, epochDayNow } from "./stats";
import { generateOutput } from "./output";

// Single-user instance — one origin fetch per 30 min costs nothing, so keep the shared
// (camo) cache aligned with the browser cache instead of holding stats stale for 6h.
const SUCCESS_CACHE_CONTROL =
  "public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400";
const ERROR_CACHE_CONTROL = "public, s-maxage=300";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Query values arrive as string | string[] | undefined from Vercel; that's exactly what
  // parseParams expects.
  const params = parseParams(
    (req.query ?? {}) as Record<string, string | string[] | undefined>,
  );

  try {
    // Single-user locked instance: the username always comes from the env var. Any `?user=`
    // query param is ignored by design — this endpoint never serves anyone else's data.
    const username = process.env.LEETCODE_USERNAME;
    if (!username) {
      throw new RenderableError(
        "Set the LEETCODE_USERNAME environment variable on this deployment.",
        500,
      );
    }

    const raw = await fetchRawData(username);
    const streaks = computeStreaks(raw.calendar, epochDayNow());
    const data: CardData = { ...raw, ...streaks };

    const { body, contentType } = generateOutput(data, params);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", SUCCESS_CACHE_CONTROL);
    res.status(200).send(body);
  } catch (err) {
    const renderable =
      err instanceof RenderableError
        ? err
        : new RenderableError("Something went wrong rendering this card.", 500);

    const { body, contentType } = generateOutput(renderable, params);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
    // Always HTTP 200 so GitHub's camo proxy renders the (error) card instead of showing a
    // broken image / propagating a 4xx/5xx to the README.
    res.status(200).send(body);
  }
}
