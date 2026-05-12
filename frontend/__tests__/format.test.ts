import { describe, expect, it } from "vitest";

import {
  engagementBand,
  formatCompact,
  formatShareAsPercent,
  formatShortDate,
  vibeDescription,
  vibeLabel
} from "@/lib/format";

describe("formatCompact", () => {
  it("returns plain numbers under 1k", () => {
    expect(formatCompact(0)).toBe("0");
    expect(formatCompact(42)).toBe("42");
    expect(formatCompact(999)).toBe("999");
  });

  it("formats thousands with a k suffix", () => {
    expect(formatCompact(1_500)).toBe("1.5k");
    expect(formatCompact(42_000)).toBe("42k");
  });

  it("formats millions with an M suffix", () => {
    expect(formatCompact(1_500_000)).toBe("1.5M");
    expect(formatCompact(42_000_000)).toBe("42M");
  });
});

describe("formatShareAsPercent", () => {
  it("rounds to whole percentages", () => {
    expect(formatShareAsPercent(0.5)).toBe("50%");
    expect(formatShareAsPercent(0.337)).toBe("34%");
  });
});

describe("engagementBand", () => {
  it("maps scores to low/medium/high", () => {
    expect(engagementBand(10)).toBe("low");
    expect(engagementBand(40)).toBe("medium");
    expect(engagementBand(70)).toBe("high");
    expect(engagementBand(99.9)).toBe("high");
  });
});

describe("vibe copy helpers", () => {
  it("returns a non-empty label and description for every vibe", () => {
    for (const v of ["chaotic", "wholesome", "productive", "creative"] as const) {
      expect(vibeLabel(v).length).toBeGreaterThan(0);
      expect(vibeDescription(v).length).toBeGreaterThan(0);
    }
  });
});

describe("formatShortDate", () => {
  it("formats ISO dates as weekday month day", () => {
    const formatted = formatShortDate("2026-05-12");
    expect(formatted).toMatch(/Tue/);
    expect(formatted).toMatch(/May/);
    expect(formatted).toMatch(/12/);
  });
});
