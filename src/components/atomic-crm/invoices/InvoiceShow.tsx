import { ShowBase, useShowContext } from "ra-core";
import { EditButton } from "@/components/admin/edit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReferenceField } from "@/components/admin/reference-field";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Invoice } from "../types";

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Viewed: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Cancelled: "bg-muted text-muted-foreground",
};

const currency = (val: number | undefined | null) =>
  val != null
    ? Number(val).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "—";

export const InvoiceShow = () => (
  <ShowBase>
    <InvoiceShowContent />
  </ShowBase>
);

const InvoiceShowContent = () => {
  const { record, isPending } = useShowContext<Invoice>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Invoice {record.invoice_number}
                </h2>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${statusColors[record.status] || ""}`}
                >
                  {record.status}
                </Badge>
              </div>
              <div className="flex gap-2">
                <EditButton />
                <DeleteButton />
              </div>
            </div>

            {record.description && (
              <p className="text-sm text-muted-foreground mb-6">
                {record.description}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <MetricCard label="Amount" value={currency(record.amount)} />
              <MetricCard
                label="Tax"
                value={`${currency(record.tax_amount)} (${record.tax_rate}%)`}
              />
              <MetricCard
                label="Total"
                value={currency(record.total_amount)}
                bold
              />
              <MetricCard
                label="Payment Method"
                value={record.payment_method || "—"}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
              <MetricCard
                label="Issue Date"
                value={
                  record.issue_date
                    ? new Date(record.issue_date).toLocaleDateString()
                    : "—"
                }
              />
              <MetricCard
                label="Due Date"
                value={
                  record.due_date
                    ? new Date(record.due_date).toLocaleDateString()
                    : "—"
                }
              />
              <MetricCard
                label="Paid Date"
                value={
                  record.paid_date
                    ? new Date(record.paid_date).toLocaleDateString()
                    : "—"
                }
              />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">
                  Linked to
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <ReferenceField
                    source="company_id"
                    reference="companies"
                    link="show"
                  >
                    <LinkLabel prefix="Company" />
                  </ReferenceField>
                  {record.project_id && (
                    <ReferenceField
                      source="project_id"
                      reference="projects"
                      link="show"
                    >
                      <LinkLabel prefix="Project" />
                    </ReferenceField>
                  )}
                  {record.deal_id && (
                    <ReferenceField
                      source="deal_id"
                      reference="deals"
                      link="show"
                    >
                      <LinkLabel prefix="Deal" />
                    </ReferenceField>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">
                  Notes & Terms
                </h3>
                {record.notes && (
                  <div className="mb-3">
                    <span className="text-xs text-muted-foreground">Notes:</span>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {record.notes}
                    </p>
                  </div>
                )}
                {record.terms && (
                  <div>
                    <span className="text-xs text-muted-foreground">Terms:</span>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {record.terms}
                    </p>
                  </div>
                )}
                {record.payment_reference && (
                  <div className="mt-3">
                    <span className="text-xs text-muted-foreground">
                      Payment ref:{" "}
                    </span>
                    <span className="text-sm">{record.payment_reference}</span>
                  </div>
                )}
              </div>
            </div>

            {record.line_items?.length > 0 && (
              <>
                <Separator className="my-4" />
                <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">
                  Line Items
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 font-medium">Description</th>
                        <th className="text-right p-2 font-medium">Qty</th>
                        <th className="text-right p-2 font-medium">Rate</th>
                        <th className="text-right p-2 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.line_items.map((item, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                          <td className="p-2">{item.description}</td>
                          <td className="p-2 text-right">{item.quantity}</td>
                          <td className="p-2 text-right">{currency(item.rate)}</td>
                          <td className="p-2 text-right">{currency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div>
    <span className="text-xs text-muted-foreground tracking-wide">{label}</span>
    <p className={`text-sm mt-0.5 ${bold ? "font-semibold" : "font-medium"}`}>
      {value}
    </p>
  </div>
);

const LinkLabel = ({ prefix }: { prefix: string }) => (
  <span className="text-sm text-primary hover:underline">View {prefix}</span>
);
