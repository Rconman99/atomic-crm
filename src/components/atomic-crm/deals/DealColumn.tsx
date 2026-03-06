import { Droppable } from "@hello-pangea/dnd";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { findDealLabel } from "./deal";
import { DealCard } from "./DealCard";

const stageColorMap: Record<string, string> = {
  lead: "rgba(124, 94, 233, 0.12)",
  "discovery-call": "rgba(124, 94, 233, 0.12)",
  "proposal-sent": "rgba(0, 188, 212, 0.12)",
  signed: "rgba(0, 188, 212, 0.12)",
  "in-build": "rgba(255, 152, 0, 0.12)",
  review: "rgba(255, 152, 0, 0.12)",
  delivered: "rgba(76, 175, 80, 0.12)",
  paid: "rgba(76, 175, 80, 0.12)",
  // Fallback for original stages
  opportunity: "rgba(124, 94, 233, 0.12)",
  "in-negociation": "rgba(0, 188, 212, 0.12)",
  won: "rgba(76, 175, 80, 0.12)",
  lost: "rgba(233, 69, 96, 0.12)",
  delayed: "rgba(255, 152, 0, 0.12)",
};

const stageTextColorMap: Record<string, string> = {
  lead: "#7C5EE9",
  "discovery-call": "#7C5EE9",
  "proposal-sent": "#00BCD4",
  signed: "#00BCD4",
  "in-build": "#FF9800",
  review: "#FF9800",
  delivered: "#4CAF50",
  paid: "#4CAF50",
  opportunity: "#7C5EE9",
  "in-negociation": "#00BCD4",
  won: "#4CAF50",
  lost: "#e94560",
  delayed: "#FF9800",
};

export const DealColumn = ({
  stage,
  deals,
}: {
  stage: string;
  deals: Deal[];
}) => {
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const { dealStages } = useConfigurationContext();

  const bgColor = stageColorMap[stage] ?? "rgba(156, 163, 175, 0.12)";
  const textColor = stageTextColorMap[stage] ?? "#999999";

  return (
    <div className="flex-1 pb-8 min-w-[240px]">
      <div className="twenty-kanban-header">
        <span className="twenty-kanban-header__title">
          {findDealLabel(dealStages, stage)}
        </span>
        <span
          className="twenty-kanban-header__value"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {totalAmount.toLocaleString("en-US", {
            notation: "compact",
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
            minimumSignificantDigits: 3,
          })}
        </span>
      </div>
      <Droppable droppableId={stage}>
        {(droppableProvided, snapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={`flex flex-col rounded-xl mt-1 gap-2 min-h-[80px] p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-muted/60" : ""
            }`}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
