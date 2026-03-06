import type { ConfigurationContextValue } from "./ConfigurationContext";

export const defaultDarkModeLogo = "./logos/logo_rc_digital_dark.svg";
export const defaultLightModeLogo = "./logos/logo_rc_digital_light.svg";

export const defaultTitle = "RC Digital CRM";

export const defaultCompanySectors = [
  { value: "healthcare", label: "Healthcare" },
  { value: "legal", label: "Legal" },
  { value: "real-estate", label: "Real Estate" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail" },
  { value: "tech-startup", label: "Tech Startup" },
  { value: "construction", label: "Construction" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
];

export const defaultDealStages = [
  { value: "lead", label: "Lead" },
  { value: "discovery-call", label: "Discovery Call" },
  { value: "proposal-sent", label: "Proposal Sent" },
  { value: "signed", label: "Signed" },
  { value: "in-build", label: "In Build" },
  { value: "review", label: "Review" },
  { value: "delivered", label: "Delivered" },
  { value: "paid", label: "Paid" },
];

export const defaultDealPipelineStatuses = ["paid"];

export const defaultDealCategories = [
  { value: "website-build", label: "Website Build" },
  { value: "app-development", label: "App Development" },
  { value: "redesign", label: "Redesign" },
  { value: "maintenance", label: "Maintenance" },
  { value: "consulting", label: "Consulting" },
];

export const defaultNoteStatuses = [
  { value: "cold", label: "Cold", color: "#7dbde8" },
  { value: "warm", label: "Warm", color: "#e8cb7d" },
  { value: "hot", label: "Hot", color: "#e94560" },
  { value: "in-contract", label: "In Contract", color: "#a4e87d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "None" },
  { value: "email", label: "Email" },
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
  { value: "follow-up", label: "Follow-up" },
  { value: "demo", label: "Demo" },
  { value: "proposal", label: "Proposal" },
  { value: "review", label: "Review" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
