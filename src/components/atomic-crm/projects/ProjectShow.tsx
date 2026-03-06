import { ShowBase, useShowContext } from "ra-core";
import { Link } from "react-router";
import { EditButton } from "@/components/admin/edit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReferenceField } from "@/components/admin/reference-field";
import type { Project } from "../types";

const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "In Review": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Delivered": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Maintenance": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const currency = (val: number | undefined | null) =>
  val
    ? Number(val).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      })
    : "—";

export const ProjectShow = () => (
  <ShowBase>
    <ProjectShowContent />
  </ShowBase>
);

const ProjectShowContent = () => {
  const { record, isPending } = useShowContext<Project>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{record.name}</h2>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className={statusColors[record.status] || ""}
                  >
                    {record.status}
                  </Badge>
                  <Badge variant="outline">{record.project_type}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <EditButton />
                <DeleteButton />
              </div>
            </div>

            {record.description && (
              <div className="mb-6">
                <span className="text-xs text-muted-foreground tracking-wide uppercase">
                  Description
                </span>
                <p className="text-sm leading-6 mt-1 whitespace-pre-line">
                  {record.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <MetricCard label="Contract Value" value={currency(record.contract_value)} />
              <MetricCard label="Monthly Retainer" value={currency(record.monthly_retainer)} />
              <MetricCard label="Total Paid" value={currency(record.total_paid)} />
              <MetricCard
                label="Timeline"
                value={
                  record.start_date
                    ? `${new Date(record.start_date).toLocaleDateString()}${record.target_end_date ? ` → ${new Date(record.target_end_date).toLocaleDateString()}` : ""}`
                    : "—"
                }
              />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">
                  Links
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <ReferenceField source="company_id" reference="companies" link="show">
                    <CompanyLink />
                  </ReferenceField>
                  {record.deal_id && (
                    <ReferenceField source="deal_id" reference="deals" link="show">
                      <DealLink />
                    </ReferenceField>
                  )}
                </div>
                {record.domain && (
                  <div className="mt-3">
                    <span className="text-xs text-muted-foreground">Domain: </span>
                    <span className="text-sm">{record.domain}</span>
                  </div>
                )}
                {record.production_url && (
                  <div className="mt-1">
                    <span className="text-xs text-muted-foreground">Production: </span>
                    <span className="text-sm">{record.production_url}</span>
                  </div>
                )}
                {record.staging_url && (
                  <div className="mt-1">
                    <span className="text-xs text-muted-foreground">Staging: </span>
                    <span className="text-sm">{record.staging_url}</span>
                  </div>
                )}
                {record.repo_url && (
                  <div className="mt-1">
                    <span className="text-xs text-muted-foreground">Repo: </span>
                    <span className="text-sm">{record.repo_url}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">
                  Tech & Delivery
                </h3>
                {record.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {record.tech_stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                {record.deliverables && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Deliverables: </span>
                    <p className="text-sm mt-1 whitespace-pre-line">{record.deliverables}</p>
                  </div>
                )}
                {record.value_delivered && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Value Delivered: </span>
                    <p className="text-sm mt-1 whitespace-pre-line">{record.value_delivered}</p>
                  </div>
                )}
              </div>
            </div>

            {record.pm_notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-sm font-semibold mb-2 uppercase text-muted-foreground">
                    PM Notes
                  </h3>
                  <p className="text-sm whitespace-pre-line">{record.pm_notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-xs text-muted-foreground tracking-wide">{label}</span>
    <p className="text-sm font-medium mt-0.5">{value}</p>
  </div>
);

const CompanyLink = () => (
  <span className="text-sm text-primary hover:underline">View Company</span>
);

const DealLink = () => (
  <span className="text-sm text-primary hover:underline">View Deal</span>
);
