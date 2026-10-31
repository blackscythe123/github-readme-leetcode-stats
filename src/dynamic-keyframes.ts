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

export function generateKeyframesCSS(isLight = false, _totalDuration = 150): string {
  const list = palettes as unknown as Palette[];
  const n = list.length;
  // Daily synchronized coprime lockstep
  const slot = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const startIndex = (slot * 7 + 6) % n;
  const pal = list[startIndex];
  const textCol = isLight ? pal.light_text : pal.dark_text;

  return `
  .dyn-fill { fill: #${textCol} !important; }
  .dyn-stroke { stroke: #${textCol} !important; }
`;
}
