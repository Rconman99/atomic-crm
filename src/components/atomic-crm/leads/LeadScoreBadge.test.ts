import { describe, it, expect } from "vitest";
import { getScoreConfig } from "./LeadScoreBadge";

describe("LeadScoreBadge — getScoreConfig", () => {
  it("score 0 returns Cold (gray)", () => {
    const config = getScoreConfig(0);
    expect(config.label).toBe("Cold");
    expect(config.text).toBe("#9CA3AF");
  });

  it("score 10 returns Cold", () => {
    expect(getScoreConfig(10).label).toBe("Cold");
  });

  it("score 20 returns Cold (boundary)", () => {
    expect(getScoreConfig(20).label).toBe("Cold");
  });

  it("score 21 returns Warming (blue)", () => {
    const config = getScoreConfig(21);
    expect(config.label).toBe("Warming");
    expect(config.text).toBe("#2196F3");
  });

  it("score 50 returns Warming", () => {
    expect(getScoreConfig(50).label).toBe("Warming");
  });

  it("score 51 returns Warm (orange)", () => {
    const config = getScoreConfig(51);
    expect(config.label).toBe("Warm");
    expect(config.text).toBe("#FF9800");
  });

  it("score 75 returns Warm", () => {
    expect(getScoreConfig(75).label).toBe("Warm");
  });

  it("score 76 returns Hot (green)", () => {
    const config = getScoreConfig(76);
    expect(config.label).toBe("Hot");
    expect(config.text).toBe("#4CAF50");
  });

  it("score 100 returns Hot", () => {
    expect(getScoreConfig(100).label).toBe("Hot");
  });

  it("all configs have bg and text colors", () => {
    for (const score of [0, 21, 51, 76]) {
      const config = getScoreConfig(score);
      expect(config.bg).toMatch(/^rgba/);
      expect(config.text).toMatch(/^#/);
    }
  });
});
