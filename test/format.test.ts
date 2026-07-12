import { describe, expect, it } from "vitest";
import { displayDate, escapeXml, fillAttrs, formatNumber, isoFromEpochDay } from "../src/format";

describe("escapeXml", () => {
  it("escapes ampersand, angle brackets, and quotes", () => {
    expect(escapeXml(`& < > " '`)).toBe("&amp; &lt; &gt; &quot; &apos;");
  });

  it("escapes an XSS-shaped payload fully (no raw tag survives)", () => {
    const out = escapeXml(`"><script>alert(1)</script>`);
    expect(out).not.toContain("<script>");
    expect(out).not.toContain('"');
    expect(out).toBe("&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("leaves plain text untouched", () => {
    expect(escapeXml("blackscythe123")).toBe("blackscythe123");
  });

  it("coerces non-string-shaped values passed at runtime", () => {
    // @ts-expect-error - exercising runtime robustness against non-string input
    expect(escapeXml(5)).toBe("5");
  });
});

describe("fillAttrs", () => {
  it("renders 3-digit hex by doubling each channel, no opacity", () => {
    expect(fillAttrs("#abc", "fill")).toBe('fill="#aabbcc"');
  });

  it("renders 4-digit hex by doubling then splitting alpha", () => {
    // "#0000" -> expand -> "00000000" -> rgb 000000, alpha 00/255 = 0.00
    expect(fillAttrs("#0000", "fill")).toBe('fill="#000000" fill-opacity="0.00"');
    // "#f00f" -> expand -> "ff0000ff" -> rgb ff0000, alpha ff/255 = 1.00
    expect(fillAttrs("#f00f", "stroke")).toBe('stroke="#ff0000" stroke-opacity="1.00"');
  });

  it("renders plain 6-digit hex verbatim", () => {
    expect(fillAttrs("#39D353", "fill")).toBe('fill="#39D353"');
  });

  it("renders 8-digit hex as rgb + 2dp opacity", () => {
    // 0x80 / 255 = 0.5019... -> "0.50"
    expect(fillAttrs("#39D35380", "fill")).toBe('fill="#39D353" fill-opacity="0.50"');
    expect(fillAttrs("#000000FF", "stroke")).toBe('stroke="#000000" stroke-opacity="1.00"');
    expect(fillAttrs("#00000000", "fill")).toBe('fill="#000000" fill-opacity="0.00"');
  });

  it("passes non-# values through verbatim (e.g. gradient url refs)", () => {
    expect(fillAttrs("url(#g_1)", "fill")).toBe('fill="url(#g_1)"');
  });

  it("passes bare named CSS colors through verbatim", () => {
    expect(fillAttrs("cornflowerblue", "fill")).toBe('fill="cornflowerblue"');
  });

  it('treats the literal "transparent" like "#0000"', () => {
    expect(fillAttrs("transparent", "fill")).toBe('fill="#000000" fill-opacity="0.00"');
    expect(fillAttrs("TRANSPARENT", "stroke")).toBe('stroke="#000000" stroke-opacity="0.00"');
  });
});

describe("formatNumber", () => {
  it("uses Intl en-US grouping when short=false", () => {
    expect(formatNumber(999, false)).toBe("999");
    expect(formatNumber(12345, false)).toBe("12,345");
    expect(formatNumber(1000000, false)).toBe("1,000,000");
    expect(formatNumber(0, false)).toBe("0");
  });

  it("leaves sub-1000 numbers alone when short=true", () => {
    expect(formatNumber(999, true)).toBe("999");
    expect(formatNumber(0, true)).toBe("0");
  });

  it("abbreviates thousands with 1 decimal, trimming .0", () => {
    expect(formatNumber(1500, true)).toBe("1.5K");
    expect(formatNumber(1000, true)).toBe("1K");
    expect(formatNumber(2000, true)).toBe("2K");
  });

  it("abbreviates millions/billions and trims trailing .0", () => {
    expect(formatNumber(1000000, true)).toBe("1M");
    expect(formatNumber(2500000, true)).toBe("2.5M");
    expect(formatNumber(1000000000, true)).toBe("1B");
  });

  it("handles non-finite input defensively", () => {
    expect(formatNumber(NaN, false)).toBe("0");
    expect(formatNumber(Infinity, true)).toBe("0");
  });
});

describe("isoFromEpochDay", () => {
  it("converts a UTC epoch day to YYYY-MM-DD", () => {
    // 1970-01-01 = epoch day 0
    expect(isoFromEpochDay(0)).toBe("1970-01-01");
    // 2025-07-07 UTC -> epoch seconds 1751846400 / 86400 = 20276 exactly
    expect(isoFromEpochDay(20276)).toBe("2025-07-07");
  });
});

describe("displayDate", () => {
  it('omits the year when it matches today\'s year: "Jul 7"', () => {
    expect(displayDate("2026-07-07", "2026-07-12")).toBe("Jul 7");
  });

  it('includes the year when it differs from today\'s year: "Jul 7, 2025"', () => {
    expect(displayDate("2025-07-07", "2026-07-12")).toBe("Jul 7, 2025");
  });

  it("handles single-digit days and month boundaries", () => {
    expect(displayDate("2026-01-01", "2026-12-31")).toBe("Jan 1");
    expect(displayDate("2024-12-31", "2026-01-01")).toBe("Dec 31, 2024");
  });
});
