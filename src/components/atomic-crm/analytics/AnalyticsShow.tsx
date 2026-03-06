import { ShowBase, useShowContext } from "ra-core";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReferenceField } from "@/components/admin/reference-field";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProjectAnalytic } from "../types";

const currency = (val: number | undefined | null) =>
  val != null
    ? Number(val).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      })
    : "—";

export const AnalyticsShow = () => (
  <ShowBase>
    <AnalyticsShowContent />
  </ShowBase>
);

const AnalyticsShowContent = () => {
  const { record, isPending } = useShowContext<ProjectAnalytic>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Analytics — {new Date(record.date).toLocaleDateString()}
                </h2>
                <div className="mt-2">
                  <ReferenceField
                    source="project_id"
                    reference="projects"
                    link="show"
                  >
                    <ProjectLink />
                  </ReferenceField>
                </div>
              </div>
              <DeleteButton />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <MetricCard label="Organic Traffic" value={String(record.organic_traffic || 0)} />
              <MetricCard label="Domain Authority" value={String(record.domain_authority ?? "—")} />
              <MetricCard label="Backlinks" value={String(record.backlinks_count || 0)} />
              <MetricCard label="PageSpeed" value={record.page_speed_score != null ? `${record.page_speed_score}/100` : "—"} />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <MetricCard label="Leads Generated" value={String(record.leads_generated || 0)} />
              <MetricCard label="Form Submissions" value={String(record.form_submissions || 0)} />
              <MetricCard label="Phone Calls" value={String(record.phone_calls || 0)} />
              <MetricCard label="Revenue from Leads" value={currency(record.revenue_from_leads)} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <MetricCard label="Estimated Lead Value" value={currency(record.estimated_lead_value)} />
              <MetricCard label="Uptime" value={`${record.uptime_percent ?? 100}%`} />
              <div>
                <span className="text-xs text-muted-foreground tracking-wide">
                  Bonus Eligible
                </span>
                <div className="mt-0.5">
                  {record.performance_bonus_eligible ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Yes — {currency(record.bonus_amount)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">No</span>
                  )}
                </div>
              </div>
            </div>

            {record.bonus_notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <span className="text-xs text-muted-foreground">Bonus Notes:</span>
                  <p className="text-sm mt-1">{record.bonus_notes}</p>
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
    <p className="text-lg font-semibold mt-0.5">{value}</p>
  </div>
);

const ProjectLink = () => (
  <span className="text-sm text-primary hover:underline">View Project</span>
);
