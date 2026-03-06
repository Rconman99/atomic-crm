import { Droppable } from "@hello-pangea/dnd";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { findDealLabel } from "./deal";
import { DealCard } from "./DealCard";

const stageColors: Record<string, string> = {
  lead: "#7c5ee9",
  "discovery-call": "#7c5ee9",
  "proposal-sent": "#00bcd4",
  signed: "#00bcd4",
  "in-build": "#ff9800",
  review: "#ff9800",
  delivered: "#4caf50",
  paid: "#4caf50",
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
  const color = stageColors[stage] || "#94a3b8";

  return (
    <div className="flex-1 pb-8 min-w-[200px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold">
          {findDealLabel(dealStages, stage)}
        </h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: color }}
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
            className={`flex flex-col rounded-lg mt-1 gap-2 min-h-[60px] p-1 transition-colors ${
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
