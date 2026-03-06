import { describe, it, expect } from "vitest";
import { getDealsByStage } from "./stages";
import type { Deal } from "../types";

const makeStages = (values: string[]) =>
  values.map((v) => ({ value: v, label: v }));

const makeDeal = (overrides: Partial<Deal> & { id: number }): Deal => ({
  name: "Test Deal",
  company_id: 1,
  contact_ids: [],
  category: "Website Build",
  stage: "lead",
  description: "",
  amount: 1000,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  expected_closing_date: "2026-06-01",
  sales_id: 1,
  index: 0,
  ...overrides,
});

describe("getDealsByStage", () => {
  const stages = makeStages(["lead", "proposal-sent", "signed", "paid"]);

  it("creates empty arrays for all stages when there are no deals", () => {
    const result = getDealsByStage([], stages);
    expect(Object.keys(result)).toEqual([
      "lead",
      "proposal-sent",
      "signed",
      "paid",
    ]);
    expect(result["lead"]).toEqual([]);
    expect(result["proposal-sent"]).toEqual([]);
  });

  it("groups deals by their stage", () => {
    const deals = [
      makeDeal({ id: 1, stage: "lead", index: 0 }),
      makeDeal({ id: 2, stage: "signed", index: 0 }),
      makeDeal({ id: 3, stage: "lead", index: 1 }),
    ];
    const result = getDealsByStage(deals, stages);
    expect(result["lead"]).toHaveLength(2);
    expect(result["signed"]).toHaveLength(1);
    expect(result["proposal-sent"]).toHaveLength(0);
  });

  it("sorts deals within each stage by index", () => {
    const deals = [
      makeDeal({ id: 1, stage: "lead", index: 3 }),
      makeDeal({ id: 2, stage: "lead", index: 1 }),
      makeDeal({ id: 3, stage: "lead", index: 2 }),
    ];
    const result = getDealsByStage(deals, stages);
    expect(result["lead"].map((d) => d.id)).toEqual([2, 3, 1]);
  });

  it("assigns deals with unknown stages to the first stage", () => {
    const deals = [makeDeal({ id: 1, stage: "nonexistent", index: 0 })];
    const result = getDealsByStage(deals, stages);
    expect(result["lead"]).toHaveLength(1);
    expect(result["lead"][0].id).toBe(1);
  });

  it("returns empty object when dealStages is empty/falsy", () => {
    const result = getDealsByStage([], []);
    expect(result).toEqual({});
  });
});
