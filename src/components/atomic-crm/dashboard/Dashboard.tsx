import {
  Building2,
  DollarSign,
  FolderKanban,
  Handshake,
  Users,
} from "lucide-react";
import { useGetList } from "ra-core";
import { Link } from "react-router";

import { ResourceErrorBoundary } from "../misc/ResourceErrorBoundary";
import type { Contact, ContactNote, Deal, Lead } from "../types";
import type { ChannelAttribution } from "../attribution/attributionTypes";
import { CHANNEL_COLORS, CHANNEL_LABELS } from "../attribution/attributionTypes";
import { DashboardActivityLog } from "./DashboardActivityLog";
import { DashboardStepper } from "./DashboardStepper";
import { DealsChart } from "./DealsChart";
import { HotContacts } from "./HotContacts";
import { MetricCard } from "./MetricCard";
import { TasksList } from "./TasksList";
import { Welcome } from "./Welcome";
import { Card, CardContent } from "@/components/ui/card";

export const Dashboard = () => {
  const {
    data: dataContact,
    total: totalContact,
    isPending: isPendingContact,
  } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalContactNotes, isPending: isPendingContactNotes } =
    useGetList<ContactNote>("contact_notes", {
      pagination: { page: 1, perPage: 1 },
    });

  const {
    data: dealData,
    total: totalDeal,
    isPending: isPendingDeal,
  } = useGetList<Deal>("deals", {
    pagination: { page: 1, perPage: 100 },
  });

  const { total: totalCompanies } = useGetList("companies", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalProjects } = useGetList("projects", {
    pagination: { page: 1, perPage: 1 },
  });

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const { data: recentLeads } = useGetList<Lead>("leads", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "created_at", order: "DESC" },
    filter: { "created_at@gte": weekAgo },
  });

  const { data: topChannels } = useGetList<ChannelAttribution>(
    "channel_attribution_summary",
    {
      pagination: { page: 1, perPage: 3 },
      sort: { field: "leads_generated", order: "DESC" },
    },
  );

  const isPending = isPendingContact || isPendingContactNotes || isPendingDeal;

  if (isPending) {
    return null;
  }

  if (!totalContact) {
    return <DashboardStepper step={1} />;
  }

  if (!totalContactNotes) {
    return <DashboardStepper step={2} contactId={dataContact?.[0]?.id} />;
  }

  const pipelineValue =
    dealData
      ?.filter((d) => !["won", "lost"].includes(d.stage))
      .reduce((sum, d) => sum + (d.amount || 0), 0) ?? 0;

  return (
    <ResourceErrorBoundary>
    <div className="space-y-6 mt-1">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          icon={DollarSign}
          iconBg="var(--rc-success)"
          label="Pipeline Value"
          value={pipelineValue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
            minimumSignificantDigits: 3,
          })}
          subtext="Active deals"
        />
        <MetricCard
          icon={Handshake}
          iconBg="var(--stage-lead)"
          label="Total Deals"
          value={totalDeal ?? 0}
        />
        <MetricCard
          icon={Building2}
          iconBg="var(--rc-accent)"
          label="Companies"
          value={totalCompanies ?? 0}
        />
        <MetricCard
          icon={Users}
          iconBg="var(--rc-highlight)"
          label="Contacts"
          value={totalContact ?? 0}
        />
        <MetricCard
          icon={FolderKanban}
          iconBg="var(--stage-build)"
          label="Projects"
          value={totalProjects ?? 0}
        />
      </div>

      {import.meta.env.VITE_IS_DEMO === "true" ? <Welcome /> : null}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <HotContacts />
        </div>
        <div className="md:col-span-6">
          <div className="flex flex-col gap-6">
            {totalDeal ? <DealsChart /> : null}
            <DashboardActivityLog />
          </div>
        </div>
        <div className="md:col-span-3">
          <TasksList />
        </div>
      </div>

      {/* Lead Pipeline + Top Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeadPipelineCard leads={recentLeads} />
        <TopChannelsCard channels={topChannels} />
      </div>
    </div>
    </ResourceErrorBoundary>
  );
};

const LeadPipelineCard = ({ leads }: { leads?: Lead[] }) => {
  const newCount = leads?.filter((l) => l.status === "new").length ?? 0;
  const qualifiedCount =
    leads?.filter((l) => l.status === "qualified").length ?? 0;
  const convertedCount =
    leads?.filter((l) => l.status === "converted").length ?? 0;
  const total = leads?.length ?? 0;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Lead Pipeline (This Week)</h3>
          <Link
            to="/leads"
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FunnelBar
            label="New"
            count={newCount}
            total={total}
            color="var(--stage-lead)"
          />
          <span className="text-muted-foreground text-xs shrink-0">→</span>
          <FunnelBar
            label="Qualified"
            count={qualifiedCount}
            total={total}
            color="var(--stage-proposal)"
          />
          <span className="text-muted-foreground text-xs shrink-0">→</span>
          <FunnelBar
            label="Converted"
            count={convertedCount}
            total={total}
            color="var(--stage-delivered)"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const FunnelBar = ({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) => (
  <div className="flex-1 text-center">
    <div
      className="rounded py-3 mb-1"
      style={{
        backgroundColor: color,
        opacity: total > 0 ? 0.3 + (count / Math.max(total, 1)) * 0.7 : 0.3,
      }}
    >
      <span className="text-lg font-bold text-white">{count}</span>
    </div>
    <span className="text-[11px] text-muted-foreground">{label}</span>
  </div>
);

const TopChannelsCard = ({
  channels,
}: {
  channels?: ChannelAttribution[];
}) => {
  if (!channels?.length) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Top Channels (30 days)</h3>
            <Link
              to="/attribution"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <p className="text-sm text-muted-foreground py-4 text-center">
            No channel data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Top Channels (30 days)</h3>
          <Link
            to="/attribution"
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {channels.map((ch) => (
            <div key={ch.channel} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: CHANNEL_COLORS[ch.channel] || "#9E9E9E",
                }}
              />
              <span className="text-sm flex-1">
                {CHANNEL_LABELS[ch.channel] || ch.channel}
              </span>
              <span className="text-sm font-medium">
                {ch.leads_generated} leads
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
