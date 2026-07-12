// Final output stage: type=svg|json dispatch, plus the two SVG post-processing safety nets
// ported from the original streak-stats project (convertHexColors, removeAnimations).

import { RenderableError } from "./types";
import type { CardData, CardParams } from "./types";
import { resolveTheme } from "./theme";
import { renderCard, renderErrorCard } from "./card";

/** Convert one 4- or 8-digit hex color into a 6-digit color + separate opacity (0-1, 2dp). */
function convertHexColor(hexDigits: string): { color: string; opacity: string } {
  let hex = hexDigits;
  if (hex.length === 4) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length === 6) {
    return { color: `#${hex}`, opacity: "1.00" };
  }
  // length === 8
  const alphaByte = parseInt(hex.slice(6, 8), 16);
  const alpha = Number.isFinite(alphaByte) ? alphaByte / 255 : 1;
  return { color: `#${hex.slice(0, 6)}`, opacity: alpha.toFixed(2) };
}

/**
 * Post-process any remaining 4/8-digit hex fill/stroke/stop-color values in a rendered SVG,
 * splitting them into a 6-digit color plus a `*-opacity` attribute — some SVG/PNG renderers
 * (and, historically, Inkscape) don't understand 4/8-digit hex colors. Mirrors the original
 * project's `convertHexColors`. Section renderers should never emit raw 4/8-digit hex directly
 * (they go through format.ts's `fillAttrs`, which already splits alpha out at generation time),
 * so this is a safety net for anything that slips through.
 */
export function convertHexColors(svg: string): string {
  let out = svg.replace(/(fill|stroke)=(['"])transparent\2/gi, '$1="#0000"');
  out = out.replace(
    /(fill|stroke|stop-color)=(['"])#([0-9a-fA-F]{4}|[0-9a-fA-F]{8})\2/g,
    (_match, attr: string, _quote: string, hexDigits: string) => {
      const opacityAttr = attr === "stop-color" ? "stop-opacity" : `${attr}-opacity`;
      const { color, opacity } = convertHexColor(hexDigits);
      return `${attr}="${color}" ${opacityAttr}="${opacity}"`;
    },
  );
  return out;
}

/**
 * Strip all animation from a rendered SVG: removes <style> blocks entirely and neutralizes any
 * remaining inline animation/opacity-0 styles to their final ("already finished") state. Section
 * renderers already skip emitting animation markup when `disable_animations=true` is requested
 * (via opts.animate=false) — this is the safety-net second layer, matching the original
 * project's `removeAnimations`.
 */
export function removeAnimations(svg: string): string {
  let out = svg.replace(/<style>[\s\S]*?<\/style>/g, "");
  out = out.replace(/opacity:\s*0;?/g, "opacity: 1;");
  out = out.replace(/animation(-[a-z]+)?:\s*[^;"']+;?/g, "");
  out = out.replace(/transform-origin:\s*[^;"']+;?/g, "");
  return out;
}

export function generateOutput(
  data: CardData | RenderableError,
  params: CardParams,
): { body: string; contentType: string } {
  const isError = data instanceof RenderableError;

  if (params.output === "json") {
    const body = isError
      ? JSON.stringify({ error: data.message, code: data.code })
      : JSON.stringify(data);
    return { body, contentType: "application/json; charset=utf-8" };
  }

  const theme = resolveTheme(params.theme, params.colorOverrides, params.hideBorder);

  let svg = isError
    ? renderErrorCard(data.message, theme, params.borderRadius)
    : renderCard(data, params, theme);

  // Order matches the original project: normalize colors first, then (optionally) strip
  // animations, so the animation-stripping regexes see the final color-normalized markup.
  svg = convertHexColors(svg);
  if (params.disableAnimations) {
    svg = removeAnimations(svg);
  }

  return { body: svg, contentType: "image/svg+xml; charset=utf-8" };
}
