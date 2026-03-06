import type { Identifier, RaRecord } from "ra-core";

export type TouchpointType =
  | "page_view"
  | "form_submit"
  | "ad_click"
  | "organic_search"
  | "social_click"
  | "email_open"
  | "email_click"
  | "referral"
  | "direct"
  | "call"
  | "meeting"
  | "demo"
  | "proposal_sent"
  | "contract_signed";

export type Channel =
  | "organic_search"
  | "paid_search"
  | "social_organic"
  | "social_paid"
  | "email"
  | "referral"
  | "direct"
  | "display"
  | "affiliate"
  | "offline";

export type Touchpoint = {
  lead_id: Identifier | null;
  contact_id: Identifier | null;
  deal_id: Identifier | null;
  anonymous_id: string | null;
  touchpoint_type: TouchpointType;
  channel: Channel;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  page_url: string;
  page_title: string;
  referrer_url: string;
  is_first_touch: boolean;
  is_last_touch: boolean;
  is_lead_creation_touch: boolean;
  is_deal_creation_touch: boolean;
  metadata: Record<string, unknown>;
  sales_id: Identifier;
  created_at: string;
} & Pick<RaRecord, "id">;

export type ChannelAttribution = {
  channel: Channel;
  source: string;
  leads_generated: number;
  contacts_touched: number;
  deals_influenced: number;
  first_touch_leads: number;
  last_touch_deals: number;
  first_touch_revenue: number;
  last_touch_revenue: number;
  total_touchpoints: number;
} & Pick<RaRecord, "id">;

export type LeadSourcePerformance = {
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  total_leads: number;
  qualified_leads: number;
  converted_leads: number;
  conversion_rate: number;
  avg_lead_score: number;
  avg_days_to_convert: number;
} & Pick<RaRecord, "id">;

export type CustomerJourney = {
  person_name: string;
  email: string;
  lead_id: Identifier;
  contact_id: Identifier | null;
  deal_id: Identifier | null;
  lead_source: string;
  lead_created: string;
  converted_at: string | null;
  deal_created: string | null;
  deal_stage: string | null;
  deal_amount: number | null;
  total_touchpoints: number;
  first_touch_date: string | null;
  last_touch_date: string | null;
  days_in_funnel: number;
} & Pick<RaRecord, "id">;

export const CHANNEL_COLORS: Record<string, string> = {
  organic_search: "#4CAF50",
  paid_search: "#2196F3",
  social_organic: "#9C27B0",
  social_paid: "#E91E63",
  email: "#FF9800",
  referral: "#009688",
  direct: "#9E9E9E",
  display: "#FFC107",
  affiliate: "#3F51B5",
  offline: "#795548",
};

export const CHANNEL_LABELS: Record<string, string> = {
  organic_search: "Organic Search",
  paid_search: "Paid Search",
  social_organic: "Social (Organic)",
  social_paid: "Social (Paid)",
  email: "Email",
  referral: "Referral",
  direct: "Direct",
  display: "Display",
  affiliate: "Affiliate",
  offline: "Offline",
};
