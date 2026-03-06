import { useGetIdentity, useListContext } from "ra-core";
import { Link } from "react-router";
import { CreateButton } from "@/components/admin/create-button";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { ListPagination } from "@/components/admin/list-pagination";
import { SortButton } from "@/components/admin/sort-button";
import { TopToolbar } from "../layout/TopToolbar";
import type { ProjectAnalytic } from "../types";

export const AnalyticsList = () => {
  const { identity } = useGetIdentity();
  if (!identity) return null;
  return (
    <List
      title={false}
      perPage={25}
      sort={{ field: "date", order: "DESC" }}
      actions={<AnalyticsListActions />}
      pagination={<ListPagination rowsPerPageOptions={[10, 25, 50]} />}
    >
      <AnalyticsListContent />
    </List>
  );
};

const AnalyticsListContent = () => {
  const { data, isPending } = useListContext<ProjectAnalytic>();
  if (isPending) return null;
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No analytics entries yet</p>
        <p className="text-sm">Log daily metrics for your projects.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium">Date</th>
            <th className="text-right p-3 font-medium">Traffic</th>
            <th className="text-right p-3 font-medium">Leads</th>
            <th className="text-right p-3 font-medium">Revenue</th>
            <th className="text-right p-3 font-medium">DA</th>
            <th className="text-right p-3 font-medium">PageSpeed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr
              key={entry.id}
              className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <td className="p-3">
                <Link
                  to={`/project_analytics/${entry.id}/show`}
                  className="font-medium hover:underline"
                >
                  {new Date(entry.date).toLocaleDateString()}
                </Link>
              </td>
              <td className="p-3 text-right">{entry.organic_traffic || 0}</td>
              <td className="p-3 text-right">{entry.leads_generated || 0}</td>
              <td className="p-3 text-right">
                {Number(entry.revenue_from_leads || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </td>
              <td className="p-3 text-right">
                {entry.domain_authority ?? "—"}
              </td>
              <td className="p-3 text-right">
                {entry.page_speed_score ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AnalyticsListActions = () => (
  <TopToolbar>
    <SortButton fields={["date", "organic_traffic", "leads_generated", "revenue_from_leads"]} />
    <ExportButton />
    <CreateButton label="Log Metrics" />
  </TopToolbar>
);
