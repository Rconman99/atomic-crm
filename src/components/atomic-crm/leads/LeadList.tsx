import { useGetIdentity, useListContext } from "ra-core";
import { Link } from "react-router";
import { CreateButton } from "@/components/admin/create-button";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { ListPagination } from "@/components/admin/list-pagination";
import { SortButton } from "@/components/admin/sort-button";
import { Badge } from "@/components/ui/badge";
import { ResourceErrorBoundary } from "../misc/ResourceErrorBoundary";
import { TopToolbar } from "../layout/TopToolbar";
import type { Lead } from "../types";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { statusColors, LEAD_STATUSES } from "./leadConstants";

export const LeadList = () => {
  const { identity } = useGetIdentity();
  if (!identity) return null;
  return (
    <ResourceErrorBoundary>
      <List
        title={false}
        perPage={25}
        sort={{ field: "lead_score", order: "DESC" }}
        actions={<LeadListActions />}
        pagination={<ListPagination rowsPerPageOptions={[10, 25, 50]} />}
      >
        <LeadListContent />
      </List>
    </ResourceErrorBoundary>
  );
};

const LeadListContent = () => {
  const { data, isPending } = useListContext<Lead>();
  if (isPending) return null;
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No leads yet</p>
        <p className="text-sm">Add your first lead to start tracking prospects.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium">Company</th>
            <th className="text-left p-3 font-medium">Source</th>
            <th className="text-left p-3 font-medium">Score</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map((lead) => (
            <tr
              key={lead.id}
              className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <td className="p-3">
                <Link
                  to={`/leads/${lead.id}/show`}
                  className="font-medium hover:underline"
                >
                  {lead.first_name} {lead.last_name}
                </Link>
                {lead.email && (
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                )}
              </td>
              <td className="p-3 text-muted-foreground">
                {lead.company_name || "—"}
              </td>
              <td className="p-3 text-muted-foreground capitalize">
                {lead.source.replace(/_/g, " ")}
              </td>
              <td className="p-3">
                <LeadScoreBadge score={lead.lead_score} />
              </td>
              <td className="p-3">
                <Badge
                  variant="secondary"
                  className={statusColors[lead.status] || ""}
                >
                  {LEAD_STATUSES.find((s) => s.value === lead.status)?.label ?? lead.status}
                </Badge>
              </td>
              <td className="p-3 text-muted-foreground text-xs">
                {new Date(lead.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LeadListActions = () => (
  <TopToolbar>
    <SortButton fields={["lead_score", "created_at", "status", "source"]} />
    <ExportButton />
    <CreateButton label="Add Lead" />
  </TopToolbar>
);
