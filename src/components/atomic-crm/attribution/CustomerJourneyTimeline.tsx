import { useGetList } from "ra-core";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  MousePointerClick,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResourceErrorBoundary } from "../misc/ResourceErrorBoundary";
import type { CustomerJourney, Touchpoint } from "./attributionTypes";
import { TouchpointTimeline } from "./TouchpointTimeline";
import { analytics } from "@/providers/posthog";

const SORT_OPTIONS = [
  { value: "days_in_funnel", label: "Days in Funnel" },
  { value: "deal_amount", label: "Deal Amount" },
  { value: "total_touchpoints", label: "Touchpoints" },
];

export const CustomerJourneyTimeline = ({
  dateFilter,
}: {
  dateFilter: Record<string, string>;
}) => {
  const [sortField, setSortField] = useState("days_in_funnel");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const { data, isPending } = useGetList<CustomerJourney>(
    "customer_journeys",
    {
      pagination: { page: 1, perPage: 50 },
      sort: { field: sortField, order: "DESC" },
      filter: dateFilter,
    },
  );

  // Fetch touchpoints for expanded journey
  const { data: touchpoints } = useGetList<Touchpoint>("touchpoints", {
    pagination: { page: 1, perPage: 200 },
    sort: { field: "created_at", order: "ASC" },
    filter: expandedId
      ? {
          "lead_id@eq":
            data?.find((j) => j.id === expandedId)?.lead_id ?? undefined,
        }
      : {},
    enabled: !!expandedId,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading customer journeys...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No customer journeys yet</p>
        <p className="text-sm">
          Journeys will appear once leads are created and tracked.
        </p>
      </div>
    );
  }

  const sources = [...new Set(data.map((d) => d.lead_source).filter(Boolean))];
  const stages = [
    ...new Set(data.map((d) => d.deal_stage).filter(Boolean)),
  ] as string[];

  const filtered = data.filter((j) => {
    if (sourceFilter !== "all" && j.lead_source !== sourceFilter) return false;
    if (stageFilter !== "all" && j.deal_stage !== stageFilter) return false;
    return true;
  });

  const handleExpand = (id: string | number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const journey = data.find((j) => j.id === id);
      if (journey) {
        analytics.customerJourneyExpanded({
          lead_id: Number(journey.lead_id),
          touchpoint_count: journey.total_touchpoints,
        });
      }
    }
  };

  return (
    <ResourceErrorBoundary>
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Lead Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Deal Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortField} onValueChange={setSortField}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Journey cards */}
      <div className="space-y-3">
        {filtered.map((journey) => {
          const isExpanded = expandedId === journey.id;
          return (
            <Card key={journey.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto shrink-0 mt-0.5"
                    onClick={() => handleExpand(journey.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">
                        {journey.person_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {journey.email}
                      </span>
                      {journey.lead_source && (
                        <Badge variant="outline" className="text-[10px]">
                          {journey.lead_source.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </div>

                    {/* Timeline bar */}
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                      <TimelineStep
                        label="Lead"
                        date={journey.lead_created}
                        active
                      />
                      <div className="h-px flex-1 bg-border min-w-2" />
                      <TimelineStep
                        label="Converted"
                        date={journey.converted_at}
                        active={!!journey.converted_at}
                      />
                      <div className="h-px flex-1 bg-border min-w-2" />
                      <TimelineStep
                        label="Deal"
                        date={journey.deal_created}
                        active={!!journey.deal_id}
                      />
                      {journey.deal_stage && (
                        <>
                          <div className="h-px flex-1 bg-border min-w-2" />
                          <Badge
                            variant="secondary"
                            className="text-[9px] capitalize"
                          >
                            {journey.deal_stage.replace(/-/g, " ")}
                          </Badge>
                        </>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3" />
                        {journey.total_touchpoints} touchpoints
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.round(journey.days_in_funnel || 0)}d in funnel
                      </span>
                      {journey.deal_amount != null && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />$
                          {journey.deal_amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded touchpoint timeline */}
                {isExpanded && (
                  <div className="mt-4 ml-8 border-t pt-4">
                    <TouchpointTimeline touchpoints={touchpoints ?? []} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
    </ResourceErrorBoundary>
  );
};

const TimelineStep = ({
  label,
  date,
  active,
}: {
  label: string;
  date: string | null;
  active: boolean;
}) => (
  <div className="flex flex-col items-center gap-0.5">
    <div
      className={`w-2 h-2 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`}
    />
    <span className={active ? "text-foreground" : ""}>{label}</span>
    {date && (
      <span className="text-[9px]">
        {new Date(date).toLocaleDateString()}
      </span>
    )}
  </div>
);
