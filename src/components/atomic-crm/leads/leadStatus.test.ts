import { describe, it, expect } from "vitest";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualifying"
  | "qualified"
  | "unqualified"
  | "converted"
  | "lost";

// Valid status transitions (what the app should enforce)
const VALID_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["contacted", "unqualified", "lost"],
  contacted: ["qualifying", "unqualified", "lost"],
  qualifying: ["qualified", "unqualified", "lost"],
  qualified: ["converted", "lost"],
  unqualified: ["new", "contacted"], // can re-engage
  converted: [], // terminal state
  lost: ["new"], // can re-open
};

function isValidTransition(from: LeadStatus, to: LeadStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

function convertLead(lead: {
  status: LeadStatus;
  converted_at: string | null;
}): {
  status: LeadStatus;
  converted_at: string | null;
} {
  if (lead.status === "converted") {
    throw new Error("Lead already converted");
  }
  return {
    status: "converted",
    converted_at: new Date().toISOString(),
  };
}

describe("Lead Status Transitions", () => {
  it("allows new → contacted", () => {
    expect(isValidTransition("new", "contacted")).toBe(true);
  });

  it("allows contacted → qualifying", () => {
    expect(isValidTransition("contacted", "qualifying")).toBe(true);
  });

  it("allows qualifying → qualified", () => {
    expect(isValidTransition("qualifying", "qualified")).toBe(true);
  });

  it("allows qualified → converted", () => {
    expect(isValidTransition("qualified", "converted")).toBe(true);
  });

  it("does not allow converted → any other state", () => {
    const allStatuses: LeadStatus[] = [
      "new",
      "contacted",
      "qualifying",
      "qualified",
      "unqualified",
      "lost",
    ];
    for (const status of allStatuses) {
      expect(isValidTransition("converted", status)).toBe(false);
    }
  });

  it("does not allow new → qualified (must go through qualifying)", () => {
    expect(isValidTransition("new", "qualified")).toBe(false);
  });

  it("does not allow new → converted (must go through qualified)", () => {
    expect(isValidTransition("new", "converted")).toBe(false);
  });

  it("conversion sets converted_at timestamp", () => {
    const result = convertLead({ status: "qualified", converted_at: null });
    expect(result.status).toBe("converted");
    expect(result.converted_at).toBeTruthy();
    expect(new Date(result.converted_at!).getTime()).toBeGreaterThan(0);
  });

  it("conversion fails for already-converted leads", () => {
    expect(() =>
      convertLead({
        status: "converted",
        converted_at: "2026-01-01T00:00:00Z",
      }),
    ).toThrow("Lead already converted");
  });

  it("allows lost leads to be re-opened", () => {
    expect(isValidTransition("lost", "new")).toBe(true);
  });
});
