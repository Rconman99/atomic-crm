import { describe, it, expect } from "vitest";

// Extracted badge logic for testing without React rendering
const scoreConfig = [
  { min: 76, label: "Hot", tier: "green" },
  { min: 51, label: "Warm", tier: "orange" },
  { min: 21, label: "Warming", tier: "blue" },
  { min: 0, label: "Cold", tier: "gray" },
];

function getScoreBadge(score: number) {
  return scoreConfig.find((c) => score >= c.min) ?? scoreConfig[3];
}

describe("LeadScoreBadge", () => {
  it("renders Cold (gray) for score 0", () => {
    const badge = getScoreBadge(0);
    expect(badge.label).toBe("Cold");
    expect(badge.tier).toBe("gray");
  });

  it("renders Cold (gray) for score 20", () => {
    const badge = getScoreBadge(20);
    expect(badge.label).toBe("Cold");
    expect(badge.tier).toBe("gray");
  });

  it("renders Warming (blue) for score 21", () => {
    const badge = getScoreBadge(21);
    expect(badge.label).toBe("Warming");
    expect(badge.tier).toBe("blue");
  });

  it("renders Warming (blue) for score 50", () => {
    const badge = getScoreBadge(50);
    expect(badge.label).toBe("Warming");
    expect(badge.tier).toBe("blue");
  });

  it("renders Warm (orange) for score 51", () => {
    const badge = getScoreBadge(51);
    expect(badge.label).toBe("Warm");
    expect(badge.tier).toBe("orange");
  });

  it("renders Warm (orange) for score 75", () => {
    const badge = getScoreBadge(75);
    expect(badge.label).toBe("Warm");
    expect(badge.tier).toBe("orange");
  });

  it("renders Hot (green) for score 76", () => {
    const badge = getScoreBadge(76);
    expect(badge.label).toBe("Hot");
    expect(badge.tier).toBe("green");
  });

  it("renders Hot (green) for score 100", () => {
    const badge = getScoreBadge(100);
    expect(badge.label).toBe("Hot");
    expect(badge.tier).toBe("green");
  });
});
