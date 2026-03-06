export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualifying", label: "Qualifying" },
  { value: "qualified", label: "Qualified" },
  { value: "unqualified", label: "Unqualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
] as const;

export const LEAD_SOURCES = [
  { value: "manual", label: "Manual" },
  { value: "website_form", label: "Website Form" },
  { value: "landing_page", label: "Landing Page" },
  { value: "referral", label: "Referral" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "cold_outbound", label: "Cold Outbound" },
  { value: "google_ads", label: "Google Ads" },
  { value: "social_media", label: "Social Media" },
  { value: "event", label: "Event" },
  { value: "partner", label: "Partner" },
] as const;

export const KANBAN_STATUSES = ["new", "contacted", "qualifying", "qualified", "converted"] as const;

export const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contacted: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  qualifying: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  unqualified: "bg-muted text-muted-foreground",
  converted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};
