import { useGetList } from "ra-core";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadSourcePerformance } from "./attributionTypes";

export const LeadSourceAnalytics = ({
  dateFilter,
}: {
  dateFilter: Record<string, string>;
}) => {
  const [sourceFilter, setSourceFilter] = useState("all");
  const { data, isPending } = useGetList<LeadSourcePerformance>(
    "lead_source_performance",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "total_leads", order: "DESC" },
      filter: dateFilter,
    },
  );

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading lead source data...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No lead source data yet</p>
        <p className="text-sm">
          Lead source analytics will appear once leads are created.
        </p>
      </div>
    );
  }

  const sources = [...new Set(data.map((d) => d.source))];
  const filtered =
    sourceFilter === "all"
      ? data
      : data.filter((d) => d.source === sourceFilter);

  // Funnel totals
  const totalLeads = filtered.reduce((s, d) => s + d.total_leads, 0);
  const totalQualified = filtered.reduce((s, d) => s + d.qualified_leads, 0);
  const totalConverted = filtered.reduce((s, d) => s + d.converted_leads, 0);
  const qualifyRate = totalLeads ? ((totalQualified / totalLeads) * 100).toFixed(1) : "0";
  const convertRate = totalQualified
    ? ((totalConverted / totalQualified) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Source filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Filter by source:</span>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
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
      </div>

      {/* Funnel visualization */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-sm font-medium mb-4">Lead Funnel</h4>
          <div className="flex items-center justify-center gap-2">
            <FunnelStage
              label="Total Leads"
              count={totalLeads}
              width="100%"
              color="var(--stage-lead)"
            />
            <div className="text-xs text-muted-foreground shrink-0 px-1">
              {qualifyRate}%
            </div>
            <FunnelStage
              label="Qualified"
              count={totalQualified}
              width="70%"
              color="var(--stage-proposal)"
            />
            <div className="text-xs text-muted-foreground shrink-0 px-1">
              {convertRate}%
            </div>
            <FunnelStage
              label="Converted"
              count={totalConverted}
              width="45%"
              color="var(--stage-delivered)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Detail table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Source</th>
                  <th className="text-left p-3 font-medium">UTM Source</th>
                  <th className="text-left p-3 font-medium">UTM Medium</th>
                  <th className="text-left p-3 font-medium">UTM Campaign</th>
                  <th className="text-right p-3 font-medium">Leads</th>
                  <th className="text-right p-3 font-medium">Qualified</th>
                  <th className="text-right p-3 font-medium">Converted</th>
                  <th className="text-right p-3 font-medium">Conv %</th>
                  <th className="text-right p-3 font-medium">Avg Score</th>
                  <th className="text-right p-3 font-medium">Avg Days</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const key = `${row.source}-${row.utm_source}-${row.utm_medium}-${row.utm_campaign}`;
                  const highConversion =
                    row.conversion_rate != null && row.conversion_rate > 20;
                  return (
                    <tr
                      key={key}
                      className={`border-b last:border-b-0 hover:bg-muted/30 ${highConversion ? "bg-green-500/5" : ""}`}
                    >
                      <td className="p-3 capitalize">
                        {row.source.replace(/_/g, " ")}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {row.utm_source || "—"}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {row.utm_medium || "—"}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {row.utm_campaign || "—"}
                      </td>
                      <td className="p-3 text-right">{row.total_leads}</td>
                      <td className="p-3 text-right">{row.qualified_leads}</td>
                      <td className="p-3 text-right">{row.converted_leads}</td>
                      <td className="p-3 text-right">
                        <Badge
                          variant={highConversion ? "default" : "secondary"}
                          className={
                            highConversion
                              ? "bg-green-600 text-white"
                              : ""
                          }
                        >
                          {row.conversion_rate?.toFixed(1) ?? "0"}%
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {row.avg_lead_score?.toFixed(0) ?? "—"}
                      </td>
                      <td className="p-3 text-right">
                        {row.avg_days_to_convert != null
                          ? `${row.avg_days_to_convert}d`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FunnelStage = ({
  label,
  count,
  width,
  color,
}: {
  label: string;
  count: number;
  width: string;
  color: string;
}) => (
  <div className="flex-1 flex flex-col items-center gap-1">
    <div
      className="rounded-lg flex items-center justify-center py-6 transition-all"
      style={{ backgroundColor: color, width, minWidth: 80 }}
    >
      <span className="text-2xl font-bold text-white">{count}</span>
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);
