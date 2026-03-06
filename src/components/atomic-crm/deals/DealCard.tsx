import { Draggable } from "@hello-pangea/dnd";
import { useRedirect, RecordContextProvider } from "ra-core";
import { ReferenceField } from "@/components/admin/reference-field";
import { Card, CardContent } from "@/components/ui/card";

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

  const categoryLabel = dealCategories.find(
    (c) => c.value === deal.category,
  )?.label;

  return (
    <div
      className="cursor-pointer"
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      onClick={handleClick}
    >
      <RecordContextProvider value={deal}>
        <Card
          className={`py-2.5 transition-all duration-200 rounded-lg border ${
            snapshot?.isDragging
              ? "opacity-90 rotate-1 shadow-lg scale-[1.02]"
              : "shadow-sm hover:shadow-md"
          }`}
        >
          <CardContent className="px-3 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <ReferenceField
                source="company_id"
                reference="companies"
                link={false}
              >
                <CompanyAvatar width={28} height={28} />
              </ReferenceField>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{deal.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  <ReferenceField
                    source="company_id"
                    reference="companies"
                    link={false}
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">
                {deal.amount.toLocaleString("en-US", {
                  notation: "compact",
                  style: "currency",
                  currency: "USD",
                  currencyDisplay: "narrowSymbol",
                  minimumSignificantDigits: 3,
                })}
              </span>
              {categoryLabel && (
                <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {categoryLabel}
                </span>
              )}
            </div>
            {deal.expected_closing_date && (
              <p className="text-[11px] text-muted-foreground">
                Close:{" "}
                {new Date(deal.expected_closing_date).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}
              </p>
            )}
          </CardContent>
        </Card>
      </RecordContextProvider>
    </div>
  );
};
