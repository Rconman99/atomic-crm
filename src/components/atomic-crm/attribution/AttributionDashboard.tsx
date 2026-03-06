import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { analytics } from "@/providers/posthog";
import { CrmErrorBoundary } from "../misc/CrmErrorBoundary";
import { AttributionModelToggle, type AttributionModel } from "./AttributionModelToggle";
import { ChannelPerformance } from "./ChannelPerformance";
import { LeadSourceAnalytics } from "./LeadSourceAnalytics";
import { CustomerJourneyTimeline } from "./CustomerJourneyTimeline";

export const AttributionDashboard = () => {
  const [attributionModel, setAttributionModel] = useState<AttributionModel>("first_touch");
  const [activeTab, setActiveTab] = useState("channels");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    analytics.attributionDashboardViewed({ tab_name: tab });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-foreground">Attribution</h1>
        <AttributionModelToggle value={attributionModel} onChange={setAttributionModel} />
      </div>

      {/* Tabs */}
      <CrmErrorBoundary fallbackTitle="Attribution dashboard failed to load">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 h-auto">
            <TabsTrigger
              value="channels"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--rc-highlight)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
            >
              Channel Performance
            </TabsTrigger>
            <TabsTrigger
              value="sources"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--rc-highlight)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
            >
              Lead Sources
            </TabsTrigger>
            <TabsTrigger
              value="journeys"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--rc-highlight)] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
            >
              Customer Journeys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="mt-6">
            <ChannelPerformance attributionModel={attributionModel} />
          </TabsContent>

          <TabsContent value="sources" className="mt-6">
            <LeadSourceAnalytics />
          </TabsContent>

          <TabsContent value="journeys" className="mt-6">
            <CustomerJourneyTimeline />
          </TabsContent>
        </Tabs>
      </CrmErrorBoundary>
    </div>
  );
};

export default AttributionDashboard;
