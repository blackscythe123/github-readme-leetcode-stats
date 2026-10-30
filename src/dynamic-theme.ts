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

export function getDynamicPalette(windowSeconds = 15): Palette {
  const list = palettes as unknown as Palette[];
  const index = Math.floor(Date.now() / (windowSeconds * 1000)) % list.length;
  return list[index];
}
