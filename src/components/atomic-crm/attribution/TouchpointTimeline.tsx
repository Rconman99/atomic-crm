import {
  Eye,
  FileText,
  MousePointerClick,
  Search,
  Share2,
  Mail,
  MailOpen,
  Link2,
  Globe,
  Phone,
  Handshake,
  Presentation,
  Send,
  PenLine,
  Flag,
  Target,
  Star,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResourceErrorBoundary } from "../misc/ResourceErrorBoundary";
import { CHANNEL_COLORS, CHANNEL_LABELS } from "./attributionTypes";
import type { Touchpoint } from "./attributionTypes";

const TOUCHPOINT_ICONS: Record<string, typeof Eye> = {
  page_view: Eye,
  form_submit: FileText,
  ad_click: MousePointerClick,
  organic_search: Search,
  social_click: Share2,
  email_open: MailOpen,
  email_click: Mail,
  referral: Link2,
  direct: Globe,
  call: Phone,
  meeting: Handshake,
  demo: Presentation,
  proposal_sent: Send,
  contract_signed: PenLine,
};

export const TouchpointTimeline = ({
  touchpoints,
}: {
  touchpoints: Touchpoint[];
}) => {
  if (!touchpoints?.length) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No touchpoints recorded yet.
      </p>
    );
  }

  const sorted = [...touchpoints].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <ResourceErrorBoundary>
    <TooltipProvider>
      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
        {sorted.map((tp) => {
          const Icon = TOUCHPOINT_ICONS[tp.touchpoint_type] || Globe;
          const channelColor = CHANNEL_COLORS[tp.channel] || "#9E9E9E";

          return (
            <div key={tp.id} className="relative flex gap-3 pb-4">
              <div
                className="absolute left-[-13px] top-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 border-background"
                style={{ backgroundColor: channelColor }}
              >
                <Icon className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0"
                    style={{
                      borderColor: channelColor,
                      color: channelColor,
                    }}
                  >
                    {CHANNEL_LABELS[tp.channel] || tp.channel}
                  </Badge>
                  {tp.source && (
                    <span className="text-[11px] text-muted-foreground">
                      {tp.source}
                      {tp.campaign ? ` / ${tp.campaign}` : ""}
                    </span>
                  )}
                </div>
                {tp.page_url && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-xs">
                        {tp.page_url.replace(/^https?:\/\//, "").slice(0, 50)}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>{tp.page_url}</TooltipContent>
                  </Tooltip>
                )}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(tp.created_at).toLocaleString()}
                  </span>
                  {tp.is_first_touch && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 gap-0.5"
                    >
                      <Flag className="w-2.5 h-2.5" /> First Touch
                    </Badge>
                  )}
                  {tp.is_last_touch && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 gap-0.5"
                    >
                      <Target className="w-2.5 h-2.5" /> Last Touch
                    </Badge>
                  )}
                  {tp.is_lead_creation_touch && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 gap-0.5"
                    >
                      <Star className="w-2.5 h-2.5" /> Lead Created
                    </Badge>
                  )}
                  {tp.is_deal_creation_touch && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1 py-0 gap-0.5"
                    >
                      <DollarSign className="w-2.5 h-2.5" /> Deal Created
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
    </ResourceErrorBoundary>
  );
};
