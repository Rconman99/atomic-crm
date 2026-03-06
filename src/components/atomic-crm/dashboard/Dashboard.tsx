import {
  Building2,
  DollarSign,
  FolderKanban,
  Handshake,
  Users,
} from "lucide-react";
import { useGetList } from "ra-core";

import type { Contact, ContactNote, Deal } from "../types";
import { DashboardActivityLog } from "./DashboardActivityLog";
import { DashboardStepper } from "./DashboardStepper";
import { DealsChart } from "./DealsChart";
import { HotContacts } from "./HotContacts";
import { MetricCard } from "./MetricCard";
import { TasksList } from "./TasksList";
import { Welcome } from "./Welcome";

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
    </div>
  );
};
