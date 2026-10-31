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

export function getDynamicPalette(): Palette {
  const list = palettes as unknown as Palette[];
  const n = list.length;
  const slot = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const startIndex = (slot * 7 + 6) % n;
  return list[startIndex];
}
