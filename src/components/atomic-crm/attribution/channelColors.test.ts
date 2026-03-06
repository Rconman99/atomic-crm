import { describe, it, expect } from "vitest";
import { channelColors, channelBarColors, channelLabel } from "./channelColors";

describe("channelColors", () => {
  const expectedChannels = [
    "organic_search",
    "paid_search",
    "social_organic",
    "social_paid",
    "email",
    "referral",
    "direct",
    "display",
    "affiliate",
    "offline",
  ];

  it("has all 10 standard channels defined", () => {
    for (const channel of expectedChannels) {
      expect(channelColors[channel]).toBeDefined();
    }
  });

  it("each channel has bg (rgba) and text (hex) colors", () => {
    for (const channel of expectedChannels) {
      expect(channelColors[channel].bg).toMatch(/^rgba/);
      expect(channelColors[channel].text).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("organic_search is green", () => {
    expect(channelColors.organic_search.text).toBe("#4CAF50");
  });

  it("paid_search is blue", () => {
    expect(channelColors.paid_search.text).toBe("#2196F3");
  });
});

describe("channelBarColors", () => {
  it("has matching keys with channelColors", () => {
    const colorKeys = Object.keys(channelColors);
    const barKeys = Object.keys(channelBarColors);
    expect(barKeys.sort()).toEqual(colorKeys.sort());
  });

  it("all values are hex colors", () => {
    for (const color of Object.values(channelBarColors)) {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe("channelLabel", () => {
  it("converts organic_search to Organic Search", () => {
    expect(channelLabel("organic_search")).toBe("Organic Search");
  });

  it("converts paid_search to Paid Search", () => {
    expect(channelLabel("paid_search")).toBe("Paid Search");
  });

  it("converts single word to Title Case", () => {
    expect(channelLabel("email")).toBe("Email");
  });

  it("converts social_organic to Social Organic", () => {
    expect(channelLabel("social_organic")).toBe("Social Organic");
  });

  it("handles direct", () => {
    expect(channelLabel("direct")).toBe("Direct");
  });
});
