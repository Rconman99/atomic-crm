import { describe, it, expect } from "vitest";
import { getDealsByStage } from "./stages";
import type { Deal } from "../types";

const RC_DIGITAL_STAGES = [
  { value: "lead", label: "Lead" },
  { value: "discovery-call", label: "Discovery Call" },
  { value: "proposal-sent", label: "Proposal Sent" },
  { value: "signed", label: "Signed" },
  { value: "in-build", label: "In Build" },
  { value: "review", label: "Review" },
  { value: "delivered", label: "Delivered" },
  { value: "paid", label: "Paid" },
];

const makeDeal = (overrides: Partial<Deal> = {}): Deal =>
  ({
    id: 1,
    name: "Test Deal",
    amount: 5000,
    stage: "lead",
    index: 0,
    company_id: 1,
    sales_id: 1,
    contact_ids: [],
    created_at: new Date().toISOString(),
    ...overrides,
  }) as Deal;

describe("getDealsByStage", () => {
  it("creates empty arrays for all stages when no deals", () => {
    const result = getDealsByStage([], RC_DIGITAL_STAGES);
    expect(Object.keys(result)).toHaveLength(8);
    RC_DIGITAL_STAGES.forEach((stage) => {
      expect(result[stage.value]).toEqual([]);
    });
  });

  it("assigns deals to correct stages", () => {
    const deals = [
      makeDeal({ id: 1, stage: "lead", index: 0 }),
      makeDeal({ id: 2, stage: "in-build", index: 0 }),
      makeDeal({ id: 3, stage: "paid", index: 0 }),
    ];
    const result = getDealsByStage(deals, RC_DIGITAL_STAGES);
    expect(result["lead"]).toHaveLength(1);
    expect(result["in-build"]).toHaveLength(1);
    expect(result["paid"]).toHaveLength(1);
    expect(result["review"]).toHaveLength(0);
  });

  it("sorts deals within a stage by index", () => {
    const deals = [
      makeDeal({ id: 3, stage: "lead", index: 2 }),
      makeDeal({ id: 1, stage: "lead", index: 0 }),
      makeDeal({ id: 2, stage: "lead", index: 1 }),
    ];
    const result = getDealsByStage(deals, RC_DIGITAL_STAGES);
    expect(result["lead"].map((d) => d.id)).toEqual([1, 2, 3]);
  });

  it("assigns deals with unknown stages to the first stage", () => {
    const deals = [makeDeal({ id: 1, stage: "nonexistent", index: 0 })];
    const result = getDealsByStage(deals, RC_DIGITAL_STAGES);
    expect(result["lead"]).toHaveLength(1);
  });

  it("returns empty object when dealStages is undefined", () => {
    const result = getDealsByStage([], undefined as any);
    expect(result).toEqual({});
  });
});
