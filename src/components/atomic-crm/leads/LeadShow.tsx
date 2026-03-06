import {
  ShowBase,
  useShowContext,
  useGetList,
  useUpdate,
  useNotify,
  useRefresh,
  useDataProvider,
  useRedirect,
} from "ra-core";
import {
  Eye,
  FileText,
  Mail,
  MailOpen,
  MousePointerClick,
  Phone,
  Handshake,
  StickyNote,
  RefreshCw,
  ArrowRightLeft,
  Linkedin,
} from "lucide-react";
import { EditButton } from "@/components/admin/edit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, LeadActivity } from "../types";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { LeadConvert } from "./LeadConvert";
import { LEAD_STATUSES, statusColors } from "./leadConstants";
import { useState } from "react";

export const LeadShow = () => (
  <ShowBase>
    <LeadShowContent />
  </ShowBase>
);

const activityIcons: Record<string, typeof Eye> = {
  page_view: Eye,
  form_submit: FileText,
  email_open: MailOpen,
  email_click: MousePointerClick,
  email_sent: Mail,
  call: Phone,
  meeting: Handshake,
  note: StickyNote,
  status_change: ArrowRightLeft,
  score_change: RefreshCw,
};

const LeadShowContent = () => {
  const { record, isPending } = useShowContext<Lead>();
  const [convertOpen, setConvertOpen] = useState(false);
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const { data: activities } = useGetList<LeadActivity>("lead_activities", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "created_at", order: "DESC" },
    filter: record ? { lead_id: record.id } : {},
  }, { enabled: !!record });

  if (isPending || !record) return null;

  const handleStatusChange = (newStatus: string) => {
    update(
      "leads",
      {
        id: record.id,
        data: { status: newStatus },
        previousData: record,
      },
      {
        onSuccess: () => {
          notify("Status updated");
          refresh();
        },
      },
    );
  };

  return (
    <div className="mt-2 flex gap-6">
      {/* Main content — 60% */}
      <div className="flex-1 min-w-0">
        <Card>
          <CardContent>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {record.first_name} {record.last_name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className={statusColors[record.status] || ""}
                  >
                    {LEAD_STATUSES.find((s) => s.value === record.status)?.label}
                  </Badge>
                  <LeadScoreBadge score={record.lead_score} />
                </div>
              </div>
              <div className="flex gap-2">
                <EditButton />
                <DeleteButton />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {record.email && (
                <InfoRow label="Email" value={record.email} />
              )}
              {record.phone && (
                <InfoRow label="Phone" value={record.phone} />
              )}
              {record.company_name && (
                <InfoRow label="Company" value={record.company_name} />
              )}
              {record.job_title && (
                <InfoRow label="Title" value={record.job_title} />
              )}
              {record.linkedin_url && (
                <div>
                  <span className="text-xs text-muted-foreground">LinkedIn</span>
                  <p className="text-sm flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5" />
                    <a
                      href={record.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      Profile
                    </a>
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Source Info */}
            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
              Source & Attribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <InfoRow label="Source" value={record.source.replace(/_/g, " ")} />
              {record.source_detail && (
                <InfoRow label="Detail" value={record.source_detail} />
              )}
              {record.utm_source && (
                <InfoRow label="UTM Source" value={record.utm_source} />
              )}
              {record.utm_medium && (
                <InfoRow label="UTM Medium" value={record.utm_medium} />
              )}
              {record.utm_campaign && (
                <InfoRow label="UTM Campaign" value={record.utm_campaign} />
              )}
              {record.landing_page_url && (
                <InfoRow label="Landing Page" value={record.landing_page_url} />
              )}
            </div>

            <Separator className="my-4" />

            {/* Activity Timeline */}
            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3">
              Activity Timeline
            </h3>
            {activities && activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => {
                  const Icon = activityIcons[activity.activity_type] ?? StickyNote;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30"
                    >
                      <div className="mt-0.5 w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          {activity.description || activity.activity_type.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                      {activity.score_delta !== 0 && (
                        <span
                          className={`text-xs font-medium ${
                            activity.score_delta > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {activity.score_delta > 0 ? "+" : ""}
                          {activity.score_delta}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No activities recorded yet.
              </p>
            )}

            {record.notes && (
              <>
                <Separator className="my-4" />
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">
                  Notes
                </h3>
                <p className="text-sm whitespace-pre-line">{record.notes}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar — 40% */}
      <div className="w-72 shrink-0 space-y-4">
        <Card>
          <CardContent className="py-4 px-4 space-y-4">
            <h3 className="text-sm font-semibold">Quick Actions</h3>

            <div>
              <label className="text-xs text-muted-foreground">Change Status</label>
              <Select
                value={record.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {record.status !== "converted" && (
              <Button
                className="w-full"
                onClick={() => setConvertOpen(true)}
              >
                Convert to Contact
              </Button>
            )}

            {record.converted_contact_id && (
              <div className="text-xs text-muted-foreground">
                Converted on{" "}
                {record.converted_at
                  ? new Date(record.converted_at).toLocaleDateString()
                  : "—"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 px-4">
            <h3 className="text-sm font-semibold mb-2">Lead Score Breakdown</h3>
            <div className="text-3xl font-bold mb-1">{record.lead_score}</div>
            {activities && activities.filter((a) => a.score_delta !== 0).length > 0 ? (
              <div className="space-y-1 mt-2">
                {activities
                  .filter((a) => a.score_delta !== 0)
                  .slice(0, 10)
                  .map((a) => (
                    <div key={a.id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground capitalize">
                        {a.activity_type.replace(/_/g, " ")}
                      </span>
                      <span
                        className={
                          a.score_delta > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {a.score_delta > 0 ? "+" : ""}
                        {a.score_delta}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No scoring activities yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <LeadConvert
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        lead={record}
      />
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-xs text-muted-foreground">{label}</span>
    <p className="text-sm capitalize">{value}</p>
  </div>
);
