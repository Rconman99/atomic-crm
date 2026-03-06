export const channelColors: Record<string, { bg: string; text: string }> = {
  organic_search: { bg: "rgba(76, 175, 80, 0.12)", text: "#4CAF50" },
  paid_search: { bg: "rgba(33, 150, 243, 0.12)", text: "#2196F3" },
  social_organic: { bg: "rgba(124, 94, 233, 0.12)", text: "#7C5EE9" },
  social_paid: { bg: "rgba(233, 30, 99, 0.12)", text: "#E91E63" },
  email: { bg: "rgba(255, 152, 0, 0.12)", text: "#FF9800" },
  referral: { bg: "rgba(0, 188, 212, 0.12)", text: "#00BCD4" },
  direct: { bg: "rgba(156, 163, 175, 0.12)", text: "#9CA3AF" },
  display: { bg: "rgba(255, 235, 59, 0.15)", text: "#F9A825" },
  affiliate: { bg: "rgba(63, 81, 181, 0.12)", text: "#3F51B5" },
  offline: { bg: "rgba(121, 85, 72, 0.12)", text: "#795548" },
};

export const channelBarColors: Record<string, string> = {
  organic_search: "#4CAF50",
  paid_search: "#2196F3",
  social_organic: "#7C5EE9",
  social_paid: "#E91E63",
  email: "#FF9800",
  referral: "#00BCD4",
  direct: "#9CA3AF",
  display: "#F9A825",
  affiliate: "#3F51B5",
  offline: "#795548",
};

export const channelLabel = (channel: string) =>
  channel
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
