import { describe, it, expect } from "vitest";
import { CHANNEL_COLORS, CHANNEL_LABELS } from "./attributionTypes";

// Simulate the set_attribution_flags trigger logic
function setAttributionFlags(
  existingTouchpoints: { id: number; is_first_touch: boolean; is_last_touch: boolean; lead_id: number }[],
  newTouchpoint: { id: number; lead_id: number },
) {
  const sameLeadTouchpoints = existingTouchpoints.filter(
    (t) => t.lead_id === newTouchpoint.lead_id && t.id !== newTouchpoint.id,
  );

  const isFirstTouch = sameLeadTouchpoints.length === 0;

  // Clear previous last_touch
  const updated = existingTouchpoints.map((t) => ({
    ...t,
    is_last_touch:
      t.lead_id === newTouchpoint.lead_id ? false : t.is_last_touch,
  }));

  return {
    touchpoints: updated,
    newFlags: {
      is_first_touch: isFirstTouch,
      is_last_touch: true,
    },
  };
}

// Simulate channel_attribution_summary aggregation
function aggregateChannelAttribution(
  touchpoints: {
    channel: string;
    source: string;
    lead_id: number | null;
    contact_id: number | null;
    deal_id: number | null;
    is_first_touch: boolean;
    is_last_touch: boolean;
  }[],
) {
  const groups = new Map<
    string,
    {
      channel: string;
      source: string;
      leads: Set<number>;
      contacts: Set<number>;
      deals: Set<number>;
      firstTouchLeads: Set<number>;
      lastTouchDeals: Set<number>;
      totalTouchpoints: number;
    }
  >();

  for (const tp of touchpoints) {
    const key = `${tp.channel}:${tp.source}`;
    if (!groups.has(key)) {
      groups.set(key, {
        channel: tp.channel,
        source: tp.source,
        leads: new Set(),
        contacts: new Set(),
        deals: new Set(),
        firstTouchLeads: new Set(),
        lastTouchDeals: new Set(),
        totalTouchpoints: 0,
      });
    }
    const g = groups.get(key)!;
    if (tp.lead_id) g.leads.add(tp.lead_id);
    if (tp.contact_id) g.contacts.add(tp.contact_id);
    if (tp.deal_id) g.deals.add(tp.deal_id);
    if (tp.is_first_touch && tp.lead_id) g.firstTouchLeads.add(tp.lead_id);
    if (tp.is_last_touch && tp.deal_id) g.lastTouchDeals.add(tp.deal_id);
    g.totalTouchpoints++;
  }

  return [...groups.values()].map((g) => ({
    channel: g.channel,
    source: g.source,
    leads_generated: g.leads.size,
    contacts_touched: g.contacts.size,
    deals_influenced: g.deals.size,
    first_touch_leads: g.firstTouchLeads.size,
    last_touch_deals: g.lastTouchDeals.size,
    total_touchpoints: g.totalTouchpoints,
  }));
}

// Simulate lead_source_performance conversion rate
function calculateConversionRate(
  leads: { status: string }[],
): number {
  const total = leads.length;
  if (total === 0) return 0;
  const converted = leads.filter((l) => l.status === "converted").length;
  return Math.round((converted / total) * 1000) / 10;
}

describe("Attribution — First/Last Touch Flags", () => {
  it("first touchpoint for a lead gets is_first_touch = true", () => {
    const result = setAttributionFlags([], { id: 1, lead_id: 100 });
    expect(result.newFlags.is_first_touch).toBe(true);
    expect(result.newFlags.is_last_touch).toBe(true);
  });

  it("second touchpoint does not get is_first_touch", () => {
    const existing = [
      { id: 1, is_first_touch: true, is_last_touch: true, lead_id: 100 },
    ];
    const result = setAttributionFlags(existing, { id: 2, lead_id: 100 });
    expect(result.newFlags.is_first_touch).toBe(false);
    expect(result.newFlags.is_last_touch).toBe(true);
  });

  it("new touchpoint clears previous last_touch", () => {
    const existing = [
      { id: 1, is_first_touch: true, is_last_touch: true, lead_id: 100 },
    ];
    const result = setAttributionFlags(existing, { id: 2, lead_id: 100 });
    const prev = result.touchpoints.find((t) => t.id === 1);
    expect(prev?.is_last_touch).toBe(false);
  });

  it("touchpoints for different leads don't affect each other", () => {
    const existing = [
      { id: 1, is_first_touch: true, is_last_touch: true, lead_id: 100 },
    ];
    const result = setAttributionFlags(existing, { id: 2, lead_id: 200 });
    expect(result.newFlags.is_first_touch).toBe(true);
    // Lead 100's last_touch should be unaffected
    const lead100 = result.touchpoints.find((t) => t.id === 1);
    expect(lead100?.is_last_touch).toBe(true);
  });
});

describe("Attribution — Channel Summary Aggregation", () => {
  it("aggregates touchpoints by channel correctly", () => {
    const touchpoints = [
      { channel: "organic_search", source: "google", lead_id: 1, contact_id: null, deal_id: null, is_first_touch: true, is_last_touch: false },
      { channel: "organic_search", source: "google", lead_id: 1, contact_id: null, deal_id: null, is_first_touch: false, is_last_touch: true },
      { channel: "paid_search", source: "google", lead_id: 2, contact_id: null, deal_id: 10, is_first_touch: true, is_last_touch: true },
    ];
    const result = aggregateChannelAttribution(touchpoints);
    const organic = result.find((r) => r.channel === "organic_search");
    expect(organic?.leads_generated).toBe(1);
    expect(organic?.total_touchpoints).toBe(2);
    expect(organic?.first_touch_leads).toBe(1);

    const paid = result.find((r) => r.channel === "paid_search");
    expect(paid?.leads_generated).toBe(1);
    expect(paid?.deals_influenced).toBe(1);
    expect(paid?.last_touch_deals).toBe(1);
  });
});

describe("Attribution — Lead Source Conversion Rate", () => {
  it("calculates conversion rate correctly", () => {
    const leads = [
      { status: "new" },
      { status: "converted" },
      { status: "qualified" },
      { status: "converted" },
    ];
    expect(calculateConversionRate(leads)).toBe(50);
  });

  it("returns 0 for empty leads", () => {
    expect(calculateConversionRate([])).toBe(0);
  });

  it("returns 0 when no leads are converted", () => {
    const leads = [{ status: "new" }, { status: "qualified" }];
    expect(calculateConversionRate(leads)).toBe(0);
  });

  it("returns 100 when all leads are converted", () => {
    const leads = [{ status: "converted" }, { status: "converted" }];
    expect(calculateConversionRate(leads)).toBe(100);
  });
});

describe("Attribution — Channel Constants", () => {
  it("all channels have colors defined", () => {
    const channels = [
      "organic_search", "paid_search", "social_organic", "social_paid",
      "email", "referral", "direct", "display", "affiliate", "offline",
    ];
    for (const ch of channels) {
      expect(CHANNEL_COLORS[ch]).toBeTruthy();
    }
  });

  it("all channels have labels defined", () => {
    const channels = [
      "organic_search", "paid_search", "social_organic", "social_paid",
      "email", "referral", "direct", "display", "affiliate", "offline",
    ];
    for (const ch of channels) {
      expect(CHANNEL_LABELS[ch]).toBeTruthy();
    }
  });
});
