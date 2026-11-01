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

// Per-visitor starting palette. Every card service uses this same rule, so all the cards
// of one page load (fetched within a second or two) start on the same palette and stay
// in lockstep, while a visit a minute later starts on the next one. Whole palette steps
// only (150 s / 30 = 5 s), so a card never starts mid-fade.
export function startOffsetSec(totalDuration = 150, now: number = Date.now()): number {
  const n = (palettes as unknown as Palette[]).length;
  return (Math.floor(now / 60000) % n) * (totalDuration / n);
}

export function generateKeyframesCSS(isLight = false, totalDuration = 150): string {
  const list = palettes as unknown as Palette[];
  const n = list.length;
  const offset = startOffsetSec(totalDuration);
  const p = 100 / n;
  const hold = p * 0.82;

  // Fixed master synchronized sequence (Camo-immune lockstep)
  const activePalettes = list;

  let fillKfs = "";
  let strokeKfs = "";

  activePalettes.forEach((pal, i) => {
    const p1 = (i * p).toFixed(2);
    const p2 = (i * p + hold).toFixed(2);
    const textCol = isLight ? pal.light_text : pal.dark_text;

    fillKfs += `    ${p1}%, ${p2}% { fill: #${textCol}; color: #${textCol}; }\n`;
    strokeKfs += `    ${p1}%, ${p2}% { stroke: #${textCol}; }\n`;
  });

  const firstText = isLight ? activePalettes[0].light_text : activePalettes[0].dark_text;
  fillKfs += `    100% { fill: #${firstText}; color: #${firstText}; }\n`;
  strokeKfs += `    100% { stroke: #${firstText}; }\n`;

  const animName = isLight ? "dyn_light" : "dyn_dark";

  return `
  @keyframes ${animName}_fill {
${fillKfs}  }
  @keyframes ${animName}_stroke {
${strokeKfs}  }
  .dyn-fill { animation: ${animName}_fill ${totalDuration}s linear infinite !important; }
  .dyn-stroke { animation: ${animName}_stroke ${totalDuration}s linear infinite !important; }
  .dyn-fill, .dyn-stroke { animation-delay: -${offset}s !important; }
`;
}
