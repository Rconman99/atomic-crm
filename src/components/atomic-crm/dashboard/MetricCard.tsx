import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const MetricCard = ({
  icon: Icon,
  iconBg,
  label,
  value,
  subtext,
}: {
  icon: LucideIcon;
  iconBg: string;
  label: string;
  value: string | number;
  subtext?: string;
}) => (
  <Card className="py-4">
    <CardContent className="px-4 flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground truncate">{subtext}</p>
        )}
      </div>
    </CardContent>
  </Card>
);
