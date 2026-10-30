import palettes from "./palettes.json";

export interface Palette {
  id: number;
  name: string;
  dark_text: string;
  light_text: string;
  dark_wave_start: string;
  dark_wave_mid: string;
  light_wave_start: string;
  light_wave_mid: string;
}

export function generateKeyframesCSS(isLight = false, totalDuration = 150): string {
  const list = palettes as unknown as Palette[];
  const n = list.length;
  const p = 100 / n;
  const hold = p * 0.82;

  // Daily synchronized coprime lockstep (never desyncs mid-day across Camo caches)
  const slot = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const startIndex = (slot * 7 + 6) % n;
  const activePalettes = [...list.slice(startIndex), ...list.slice(0, startIndex)];

  let fillKfs = "";
  let strokeKfs = "";

  activePalettes.forEach((pal, i) => {
    const p1 = (i * p).toFixed(2);
    const p2 = (i * p + hold).toFixed(2);
    const textCol = isLight ? pal.light_text : pal.dark_text;

    fillKfs += `    ${p1}%, ${p2}% { fill: #${textCol}; }\n`;
    strokeKfs += `    ${p1}%, ${p2}% { stroke: #${textCol}; }\n`;
  });

  const firstText = isLight ? activePalettes[0].light_text : activePalettes[0].dark_text;
  fillKfs += `    100% { fill: #${firstText}; }\n`;
  strokeKfs += `    100% { stroke: #${firstText}; }\n`;

  const animName = isLight ? "dyn_light" : "dyn_dark";

  return `
  @keyframes ${animName}_fill {
${fillKfs}  }
  @keyframes ${animName}_stroke {
${strokeKfs}  }
  .dyn-fill { animation: ${animName}_fill ${totalDuration}s linear infinite !important; }
  .dyn-stroke { animation: ${animName}_stroke ${totalDuration}s linear infinite !important; }
`;
}
