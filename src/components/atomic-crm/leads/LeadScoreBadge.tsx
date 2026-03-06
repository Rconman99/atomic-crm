import { Badge } from "@/components/ui/badge";

const scoreConfig = [
  { min: 76, label: "Hot", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { min: 51, label: "Warm", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  { min: 21, label: "Warming", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { min: 0, label: "Cold", className: "bg-muted text-muted-foreground" },
];

export const LeadScoreBadge = ({ score }: { score: number }) => {
  const config = scoreConfig.find((c) => score >= c.min) ?? scoreConfig[3];
  return (
    <Badge variant="secondary" className={config.className}>
      {score} — {config.label}
    </Badge>
  );
};
