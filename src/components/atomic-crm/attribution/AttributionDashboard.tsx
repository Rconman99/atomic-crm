import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ResourceErrorBoundary } from "../misc/ResourceErrorBoundary";
import { ChannelPerformance } from "./ChannelPerformance";
import { LeadSourceAnalytics } from "./LeadSourceAnalytics";
import { CustomerJourneyTimeline } from "./CustomerJourneyTimeline";
import { analytics } from "@/providers/posthog";

const DATE_RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

export const AttributionDashboard = () => {
  const [days, setDays] = useState<number>(30);
  const [activeTab, setActiveTab] = useState("channels");

  const dateFilter = useMemo(() => {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return { "created_at@gte": since.toISOString() };
  }, [days]);

  useEffect(() => {
    analytics.attributionDashboardViewed({ tab_name: activeTab });
  }, [activeTab]);

  return (
    <ResourceErrorBoundary>
      <div className="space-y-4 mt-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Attribution</h1>
          <div className="inline-flex rounded-lg border bg-muted/50 p-0.5">
            {DATE_RANGES.map((range) => (
              <Button
                key={range.days}
                variant={days === range.days ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => setDays(range.days)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="channels">Channel Performance</TabsTrigger>
            <TabsTrigger value="sources">Lead Sources</TabsTrigger>
            <TabsTrigger value="journeys">Customer Journeys</TabsTrigger>
          </TabsList>

          <TabsContent value="channels">
            <ChannelPerformance dateFilter={dateFilter} />
          </TabsContent>

          <TabsContent value="sources">
            <LeadSourceAnalytics dateFilter={dateFilter} />
          </TabsContent>

          <TabsContent value="journeys">
            <CustomerJourneyTimeline dateFilter={dateFilter} />
          </TabsContent>
        </Tabs>
      </div>
    </ResourceErrorBoundary>
  );
};
