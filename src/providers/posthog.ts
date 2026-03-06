// RC Digital CRM — PostHog Analytics Integration

import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

/**
 * Initialize PostHog. Safe to call multiple times — only runs once.
 * Does nothing if VITE_POSTHOG_KEY is not set.
 */
export function initPostHog() {
  if (initialized || !POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });

  initialized = true;
}

/**
 * Identify a user after login.
 */
export function identifyUser(user: {
  id: string | number;
  email?: string;
  fullName?: string;
}) {
  if (!POSTHOG_KEY) return;
  posthog.identify(String(user.id), {
    email: user.email,
    name: user.fullName,
  });
}

/**
 * Reset identity on logout.
 */
export function resetUser() {
  if (!POSTHOG_KEY) return;
  posthog.reset();
}

function capture(event: string, properties?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

// Pre-defined CRM event helpers
export const analytics = {
  dealCreated: (data: {
    stage: string;
    category: string;
    amount: number;
  }) => capture("deal_created", data),

  dealStageChanged: (data: {
    dealId: number;
    from: string;
    to: string;
    amount: number;
  }) => capture("deal_stage_changed", data),

  dealWon: (data: {
    dealId: number;
    amount: number;
    daysInPipeline: number;
  }) => capture("deal_won", data),

  projectStarted: (data: {
    projectType: string;
    contractValue: number;
  }) => capture("project_started", data),

  projectDelivered: (data: {
    projectId: number;
    daysToComplete: number;
    contractValue: number;
  }) => capture("project_delivered", data),

  invoiceSent: (data: { amount: number; projectType: string }) =>
    capture("invoice_sent", data),

  invoicePaid: (data: { amount: number; daysToPay: number }) =>
    capture("invoice_paid", data),

  leadCreated: (data: { source: string; utm_source?: string }) =>
    capture("lead_created", data),

  leadStatusChanged: (data: {
    leadId: number;
    from: string;
    to: string;
  }) => capture("lead_status_changed", data),

  leadConverted: (data: {
    leadId: number;
    contactId: number;
    dealId?: number;
    timeToConvertDays: number;
  }) => capture("lead_converted", data),

  leadScoreChanged: (data: {
    leadId: number;
    oldScore: number;
    newScore: number;
    activityType: string;
  }) => capture("lead_score_changed", data),

  attributionDashboardViewed: (data: { tab_name: string }) =>
    capture("attribution_dashboard_viewed", data),

  customerJourneyExpanded: (data: {
    lead_id: number;
    touchpoint_count: number;
  }) => capture("customer_journey_expanded", data),

  attributionModelToggled: (data: { model_type: string }) =>
    capture("attribution_model_toggled", data),
};

export default posthog;
