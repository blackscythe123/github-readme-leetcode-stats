import type { VercelRequest, VercelResponse } from "@vercel/node";

import { RenderableError, type CardData } from "./types";
import { parseParams } from "./params";
import { fetchRawData } from "./leetcode";
import { computeStreaks, epochDayNow } from "./stats";
import { generateOutput } from "./output";

const SUCCESS_CACHE_CONTROL =
  "public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400";
const ERROR_CACHE_CONTROL = "public, s-maxage=300";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const params = parseParams(
    (req.query ?? {}) as Record<string, string | string[] | undefined>,
  );

  try {
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
    const isDynamic = params.theme.startsWith("dynamic");
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      isDynamic ? "public, max-age=0, s-maxage=5, must-revalidate" : SUCCESS_CACHE_CONTROL,
    );
    res.status(200).send(body);
  } catch (err) {
    const renderable =
      err instanceof RenderableError
        ? err
        : new RenderableError("Something went wrong rendering this card.", 500);

    const { body, contentType } = generateOutput(renderable, params);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", ERROR_CACHE_CONTROL);
    res.status(200).send(body);
  }
}
