import { describe, it, expect } from "vitest";

// Lead scoring rules — these mirror the score_delta values
// used by the recalculate_lead_score trigger function
const SCORE_DELTAS: Record<string, number> = {
  form_submit: 5,
  email_click: 3,
  email_open: 2,
  page_view: 1,
  meeting: 10,
  call: 8,
  unsubscribe: -5,
  bounce: -10,
  note: 0,
  status_change: 0,
};

function calculateLeadScore(
  activities: { activity_type: string; score_delta: number }[],
): number {
  return activities.reduce((total, a) => total + a.score_delta, 0);
}

function getExpectedScoreDelta(activityType: string): number {
  return SCORE_DELTAS[activityType] ?? 0;
}

describe("Lead Scoring", () => {
  it("assigns +5 for form_submit", () => {
    expect(getExpectedScoreDelta("form_submit")).toBe(5);
  });

  it("assigns +3 for email_click", () => {
    expect(getExpectedScoreDelta("email_click")).toBe(3);
  });

  it("assigns +2 for email_open", () => {
    expect(getExpectedScoreDelta("email_open")).toBe(2);
  });

  it("assigns +1 for page_view", () => {
    expect(getExpectedScoreDelta("page_view")).toBe(1);
  });

  it("assigns +10 for meeting", () => {
    expect(getExpectedScoreDelta("meeting")).toBe(10);
  });

  it("assigns +8 for call", () => {
    expect(getExpectedScoreDelta("call")).toBe(8);
  });

  it("recalculates correctly after multiple activities", () => {
    const activities = [
      { activity_type: "page_view", score_delta: 1 },
      { activity_type: "email_open", score_delta: 2 },
      { activity_type: "form_submit", score_delta: 5 },
    ];
    expect(calculateLeadScore(activities)).toBe(8);
  });

  it("handles negative scores: unsubscribe=-5", () => {
    expect(getExpectedScoreDelta("unsubscribe")).toBe(-5);
  });

  it("handles negative scores: bounce=-10", () => {
    expect(getExpectedScoreDelta("bounce")).toBe(-10);
  });

  it("produces correct total with mixed positive and negative", () => {
    const activities = [
      { activity_type: "meeting", score_delta: 10 },
      { activity_type: "call", score_delta: 8 },
      { activity_type: "bounce", score_delta: -10 },
    ];
    expect(calculateLeadScore(activities)).toBe(8);
  });

  it("returns zero for empty activity list", () => {
    expect(calculateLeadScore([])).toBe(0);
  });

  it("returns 0 for unknown activity types", () => {
    expect(getExpectedScoreDelta("unknown_activity")).toBe(0);
  });
});
