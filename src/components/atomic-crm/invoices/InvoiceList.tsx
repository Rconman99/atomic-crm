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
import type { Invoice } from "../types";

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Viewed: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Cancelled: "bg-muted text-muted-foreground line-through",
};

export const InvoiceList = () => {
  const { identity } = useGetIdentity();
  if (!identity) return null;
  return (
    <ResourceErrorBoundary>
      <List
        title={false}
        perPage={25}
        sort={{ field: "created_at", order: "DESC" }}
        actions={<InvoiceListActions />}
        pagination={<ListPagination rowsPerPageOptions={[10, 25, 50]} />}
      >
        <InvoiceListContent />
      </List>
    </ResourceErrorBoundary>
  );
};

const InvoiceListContent = () => {
  const { data, isPending } = useListContext<Invoice>();
  if (isPending) return null;
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No invoices yet</p>
        <p className="text-sm">Create your first invoice to start billing.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium">Invoice #</th>
            <th className="text-left p-3 font-medium">Description</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-right p-3 font-medium">Amount</th>
            <th className="text-right p-3 font-medium">Total</th>
            <th className="text-left p-3 font-medium">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <td className="p-3">
                <Link
                  to={`/invoices/${invoice.id}/show`}
                  className="font-medium hover:underline"
                >
                  {invoice.invoice_number}
                </Link>
              </td>
              <td className="p-3 text-muted-foreground truncate max-w-[250px]">
                {invoice.description || "—"}
              </td>
              <td className="p-3">
                <Badge
                  variant="secondary"
                  className={statusColors[invoice.status] || ""}
                >
                  {invoice.status}
                </Badge>
              </td>
              <td className="p-3 text-right">
                {Number(invoice.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td className="p-3 text-right font-medium">
                {Number(invoice.total_amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td className="p-3 text-muted-foreground">
                {invoice.due_date
                  ? new Date(invoice.due_date).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InvoiceListActions = () => (
  <TopToolbar>
    <SortButton fields={["invoice_number", "created_at", "status", "total_amount", "due_date"]} />
    <ExportButton />
    <CreateButton label="New Invoice" />
  </TopToolbar>
);
