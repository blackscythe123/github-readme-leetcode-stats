// Local dev server: serves public/index.html at "/" and adapts plain Node (req, res) to the
// Vercel serverless handler for "/api/card" — so the whole card + demo page can be exercised
// locally with `npm run dev`, no `vercel dev` / Vercel CLI required.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import cardHandler from "../api/card";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = 3178;

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

// public/index.html's footer links to "./README.md", but the real README.md lives at the repo
// root, not under public/ (serveStatic below only ever resolves paths under PUBLIC_DIR). Rather
// than duplicating README.md into public/ (drift risk) or broadening serveStatic's traversal
// guard, allowlist this one root-level file explicitly so the demo page's link resolves locally.
const ROOT_FILES = new Set(["README.md"]);

/** Build a Vercel-shaped query object: repeated keys become arrays, single keys stay strings. */
function buildQuery(searchParams: URLSearchParams): Record<string, string | string[] | undefined> {
  const query: Record<string, string | string[] | undefined> = {};
  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key);
    query[key] = values.length > 1 ? values : values[0];
  }
  return query;
}

/** Minimal (req, res) -> (VercelRequest, VercelResponse) adapter, just enough for api/card.ts. */
function toVercel(
  req: IncomingMessage,
  res: ServerResponse,
  query: Record<string, string | string[] | undefined>,
): { vReq: VercelRequest; vRes: VercelResponse } {
  const vReq = Object.assign(req, { query, cookies: {}, body: undefined }) as unknown as VercelRequest;

  let statusCode = 200;
  const vRes = Object.assign(res, {
    status(code: number) {
      statusCode = code;
      res.statusCode = code;
      return vRes;
    },
    json(payload: unknown) {
      if (!res.getHeader("Content-Type")) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
      }
      res.statusCode = statusCode;
      res.end(JSON.stringify(payload));
      return vRes;
    },
    send(payload: unknown) {
      res.statusCode = statusCode;
      if (typeof payload === "string" || Buffer.isBuffer(payload)) {
        res.end(payload);
      } else {
        res.end(JSON.stringify(payload));
      }
      return vRes;
    },
  }) as unknown as VercelResponse;

  return { vReq, vRes };
}

async function serveStatic(req: IncomingMessage, res: ServerResponse, pathname: string): Promise<boolean> {
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");

  const baseDir = ROOT_FILES.has(relative) ? ROOT : PUBLIC_DIR;
  const filePath = path.join(baseDir, relative);

  // Guard against path traversal escaping the resolved base directory.
  if (!filePath.startsWith(baseDir)) return false;
  if (!existsSync(filePath)) return false;

  const ext = path.extname(filePath);
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const body = await readFile(filePath);
  res.setHeader("Content-Type", contentType);
  res.statusCode = 200;
  res.end(body);
  return true;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (url.pathname === "/api/card") {
      const query = buildQuery(url.searchParams);
      const { vReq, vRes } = toVercel(req, res, query);
      await cardHandler(vReq, vRes);
      return;
    }

    const served = await serveStatic(req, res, url.pathname);
    if (!served) {
      res.statusCode = 404;
      res.end("Not found");
    }
  } catch (err) {
    res.statusCode = 500;
    res.end(`dev-server error: ${err instanceof Error ? err.message : String(err)}`);
  }
});

server.listen(PORT, () => {
  console.log(`dev-server: http://localhost:${PORT}  (demo page: /, card endpoint: /api/card)`);
});
