import { Draggable } from "@hello-pangea/dnd";
import { useRedirect, RecordContextProvider } from "ra-core";
import { ReferenceField } from "@/components/admin/reference-field";
import { NumberField } from "@/components/admin/number-field";
import { SelectField } from "@/components/admin/select-field";
import { Calendar } from "lucide-react";

import { CompanyAvatar } from "../companies/CompanyAvatar";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";

export const DealCard = ({ deal, index }: { deal: Deal; index: number }) => {
  if (!deal) return null;

  return (
    <Draggable draggableId={String(deal.id)} index={index}>
      {(provided, snapshot) => (
        <DealCardContent provided={provided} snapshot={snapshot} deal={deal} />
      )}
    </Draggable>
  );
};

export const DealCardContent = ({
  provided,
  snapshot,
  deal,
}: {
  provided?: any;
  snapshot?: any;
  deal: Deal;
}) => {
  const { dealCategories } = useConfigurationContext();
  const redirect = useRedirect();
  const handleClick = () => {
    redirect(`/deals/${deal.id}/show`, undefined, undefined, undefined, {
      _scrollToTop: false,
    });
  };

  return (
    <div
      className="cursor-pointer"
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      onClick={handleClick}
    >
      <RecordContextProvider value={deal}>
        <div
          className={`bg-card rounded-lg border border-border p-3.5 transition-all duration-200 ${
            snapshot?.isDragging
              ? "opacity-90 rotate-1 shadow-lg scale-[1.02]"
              : "shadow-sm hover:shadow-md"
          }`}
        >
          {/* Top row: Company logo + deal name */}
          <div className="flex items-start gap-2.5 mb-2.5">
            <ReferenceField
              source="company_id"
              reference="companies"
              link={false}
            >
              <CompanyAvatar width={28} height={28} />
            </ReferenceField>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {deal.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                <ReferenceField
                  source="company_id"
                  reference="companies"
                  link={false}
                />
              </p>
            </div>
          </div>

          {/* Amount - bold */}
          <p className="text-base font-bold text-foreground mb-2">
            <NumberField
              source="amount"
              options={{
                notation: "compact",
                style: "currency",
                currency: "USD",
                currencyDisplay: "narrowSymbol",
                minimumSignificantDigits: 3,
              }}
            />
          </p>

          {/* Bottom row: category + expected close */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              <SelectField
                source="category"
                choices={dealCategories}
                optionText="label"
                optionValue="value"
              />
            </span>
            {deal.expected_closing_date && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(deal.expected_closing_date).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}
              </span>
            )}
          </div>
        </div>
      </RecordContextProvider>
    </div>
  );
};
