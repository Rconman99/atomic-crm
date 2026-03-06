import { describe, it, expect } from "vitest";
import { getDateRangeFilter } from "./AttributionDashboard";

describe("Attribution Dashboard - getDateRangeFilter", () => {
  it("returns undefined for 'all' range", () => {
    expect(getDateRangeFilter("all")).toBeUndefined();
  });

  it("returns a date string for '7' range", () => {
    const result = getDateRangeFilter("7");
    expect(result).toBeDefined();
    const date = new Date(result!);
    expect(date.getTime()).toBeLessThan(Date.now());
    // Should be approximately 7 days ago
    const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeGreaterThanOrEqual(6.9);
    expect(diffDays).toBeLessThanOrEqual(7.1);
  });

  it("returns a date string for '30' range", () => {
    const result = getDateRangeFilter("30");
    expect(result).toBeDefined();
    const date = new Date(result!);
    const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeGreaterThanOrEqual(29.9);
    expect(diffDays).toBeLessThanOrEqual(30.1);
  });

  it("returns a date string for '90' range", () => {
    const result = getDateRangeFilter("90");
    expect(result).toBeDefined();
    const date = new Date(result!);
    const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeGreaterThanOrEqual(89.9);
    expect(diffDays).toBeLessThanOrEqual(90.1);
  });

  it("returns a valid ISO date string", () => {
    const result = getDateRangeFilter("30");
    expect(result).toBeDefined();
    expect(new Date(result!).toISOString()).toBe(result);
  });
});
