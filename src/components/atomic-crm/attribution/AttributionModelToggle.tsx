import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type AttributionModel = "first_touch" | "last_touch";

export const AttributionModelToggle = ({
  value,
  onChange,
}: {
  value: AttributionModel;
  onChange: (model: AttributionModel) => void;
}) => {
  const models: {
    id: AttributionModel | string;
    label: string;
    disabled?: boolean;
  }[] = [
    { id: "first_touch", label: "First Touch" },
    { id: "last_touch", label: "Last Touch" },
    { id: "linear", label: "Linear", disabled: true },
    { id: "time_decay", label: "Time Decay", disabled: true },
    { id: "u_shaped", label: "U-Shaped", disabled: true },
  ];

  return (
    <TooltipProvider>
      <div className="inline-flex rounded-lg border bg-muted/50 p-0.5">
        {models.map((model) =>
          model.disabled ? (
            <Tooltip key={model.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs opacity-40 cursor-not-allowed"
                  disabled
                >
                  {model.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Coming soon</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              key={model.id}
              variant={value === model.id ? "secondary" : "ghost"}
              size="sm"
              className="text-xs"
              onClick={() => onChange(model.id as AttributionModel)}
            >
              {model.label}
            </Button>
          ),
        )}
      </div>
    </TooltipProvider>
  );
};
