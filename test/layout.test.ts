import { describe, expect, it } from "vitest";

import { layout } from "../src/layout";
import { chipRowCount } from "../src/sections/skills";
import type { NamedCount } from "../src/types";

const ALL_SIX = [
  "profile",
  "solved",
  "streak",
  "skills",
  "languages",
  "heatmap",
] as const;

describe("layout chip-row hints (regression: divider sliced through row-2 chips)", () => {
  it("gives a 2-row skills band enough height that nothing crosses its chips", () => {
    const l = layout([...ALL_SIX], { skillsRows: 2, languagesRows: 1 });
    const skills = l.placements.find((p) => p.section === "skills");
    const langs = l.placements.find((p) => p.section === "languages");
    expect(skills && langs).toBeTruthy();
    expect(langs!.y - skills!.y).toBe(104);
    // Chips occupy skills.y+22 .. skills.y+68 — no horizontal divider may cross that band.
    for (const d of l.dividers.filter((d) => d.kind === "h")) {
      const crosses = d.a > skills!.y + 20 && d.a < skills!.y + 70;
      expect(crosses).toBe(false);
    }
  });

  it("keeps 1-row bands compact", () => {
    const l = layout(["skills", "languages"], { skillsRows: 1, languagesRows: 1 });
    const skills = l.placements.find((p) => p.section === "skills");
    const langs = l.placements.find((p) => p.section === "languages");
    expect(langs!.y - skills!.y).toBe(78);
  });

  it("defaults to 1-row height when hints are absent", () => {
    const l = layout(["skills", "languages"]);
    const skills = l.placements.find((p) => p.section === "skills");
    const langs = l.placements.find((p) => p.section === "languages");
    expect(langs!.y - skills!.y).toBe(78);
  });
});

describe("chipRowCount mirrors the renderer's wrap math", () => {
  const chip = (name: string, count = 1): NamedCount => ({ name, count });

  it("single short chip → 1 row", () => {
    expect(chipRowCount([chip("Array", 37)], 12, 792)).toBe(1);
  });

  it("wraps exactly when cumulative width exceeds the band", () => {
    // Each "Aaaaaaaa ×1" label: 11 chars * 6.2 + 18 = 86.2 wide, +8 gap → 94.2 per chip.
    // 9 chips ≈ 848 > 792 → must wrap; 8 chips ≈ 754 (last chip ends 745.8) → fits.
    const eight = Array.from({ length: 8 }, (_, i) => chip("Aaaaaaaa", 1));
    const nine = Array.from({ length: 9 }, (_, i) => chip("Aaaaaaaa", 1));
    expect(chipRowCount(eight, 12, 792)).toBe(1);
    expect(chipRowCount(nine, 12, 792)).toBe(2);
  });

  it("respects the cap", () => {
    const many = Array.from({ length: 12 }, () => chip("Aaaaaaaa", 1));
    expect(chipRowCount(many, 3, 792)).toBe(1);
  });
});
