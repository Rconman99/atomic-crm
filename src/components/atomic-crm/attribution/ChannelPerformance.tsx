import { ResponsiveBar } from "@nivo/bar";
import { useGetList } from "ra-core";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceErrorBoundary } from "../misc/ResourceErrorBoundary";
import {
  AttributionModelToggle,
  type AttributionModel,
} from "./AttributionModelToggle";
import {
  CHANNEL_COLORS,
  CHANNEL_LABELS,
  type ChannelAttribution,
} from "./attributionTypes";
import { analytics } from "@/providers/posthog";

export const ChannelPerformance = ({
  dateFilter,
}: {
  dateFilter: Record<string, string>;
}) => {
  const [model, setModel] = useState<AttributionModel>("first_touch");
  const { data, isPending } = useGetList<ChannelAttribution>(
    "channel_attribution_summary",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "leads_generated", order: "DESC" },
      filter: dateFilter,
    },
  );

  const handleModelToggle = (newModel: AttributionModel) => {
    setModel(newModel);
    analytics.attributionModelToggled({ model_type: newModel });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading channel data...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No attribution data yet</p>
        <p className="text-sm">
          Touchpoints will appear here once tracking is active.
        </p>
      </div>
    );
  }

  const chartData = data.slice(0, 10).map((d) => ({
    channel: CHANNEL_LABELS[d.channel] || d.channel,
    leads: d.leads_generated,
    color: CHANNEL_COLORS[d.channel] || "#9E9E9E",
  }));

  return (
    <ResourceErrorBoundary>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Attribution Model
        </h3>
        <AttributionModelToggle value={model} onChange={handleModelToggle} />
      </div>

      {/* Horizontal bar chart */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-3">Leads by Channel</h4>
          <div className="h-[300px]">
            <ResponsiveBar
              data={chartData}
              indexBy="channel"
              keys={["leads"]}
              layout="horizontal"
              colors={(d) => d.data.color as string}
              margin={{ top: 10, right: 30, bottom: 30, left: 130 }}
              padding={0.3}
              enableLabel
              labelTextColor="#fff"
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                style: {
                  ticks: {
                    text: { fill: "var(--color-muted-foreground)" },
                  },
                },
              }}
              axisBottom={{
                tickSize: 0,
                tickPadding: 8,
                style: {
                  ticks: {
                    text: { fill: "var(--color-muted-foreground)" },
                  },
                },
              }}
              tooltip={({ indexValue, value }) => (
                <div className="p-2 bg-secondary rounded shadow text-secondary-foreground text-sm">
                  <strong>{indexValue}:</strong> {value} leads
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Revenue comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.slice(0, 6).map((d) => (
          <Card key={d.channel + d.source}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: CHANNEL_COLORS[d.channel] || "#9E9E9E",
                  }}
                />
                <span className="text-sm font-medium">
                  {CHANNEL_LABELS[d.channel] || d.channel}
                  {d.source ? ` (${d.source})` : ""}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={
                    model === "first_touch"
                      ? "bg-primary/10 rounded p-2"
                      : "p-2"
                  }
                >
                  <p className="text-muted-foreground">First Touch Rev</p>
                  <p className="font-semibold text-base">
                    ${(d.first_touch_revenue || 0).toLocaleString()}
                  </p>
                </div>
                <div
                  className={
                    model === "last_touch"
                      ? "bg-primary/10 rounded p-2"
                      : "p-2"
                  }
                >
                  <p className="text-muted-foreground">Last Touch Rev</p>
                  <p className="font-semibold text-base">
                    ${(d.last_touch_revenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Channel</th>
                  <th className="text-left p-3 font-medium">Source</th>
                  <th className="text-right p-3 font-medium">Leads</th>
                  <th className="text-right p-3 font-medium">Contacts</th>
                  <th className="text-right p-3 font-medium">Deals</th>
                  <th className="text-right p-3 font-medium">1st Touch</th>
                  <th className="text-right p-3 font-medium">Last Touch</th>
                  <th className="text-right p-3 font-medium">1st Rev</th>
                  <th className="text-right p-3 font-medium">Last Rev</th>
                  <th className="text-right p-3 font-medium">Touchpoints</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.channel + row.source}
                    className="border-b last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="p-3 flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            CHANNEL_COLORS[row.channel] || "#9E9E9E",
                        }}
                      />
                      {CHANNEL_LABELS[row.channel] || row.channel}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {row.source || "—"}
                    </td>
                    <td className="p-3 text-right">{row.leads_generated}</td>
                    <td className="p-3 text-right">{row.contacts_touched}</td>
                    <td className="p-3 text-right">{row.deals_influenced}</td>
                    <td className="p-3 text-right">{row.first_touch_leads}</td>
                    <td className="p-3 text-right">{row.last_touch_deals}</td>
                    <td className="p-3 text-right">
                      ${(row.first_touch_revenue || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      ${(row.last_touch_revenue || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-right">{row.total_touchpoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
    </ResourceErrorBoundary>
  );
};
