import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { analytics } from "@/providers/posthog";

export type AttributionModel = "first_touch" | "last_touch";

export const AttributionModelToggle = ({
  value,
  onChange,
}: {
  value: AttributionModel;
  onChange: (model: AttributionModel) => void;
}) => {
  const handleChange = (model: AttributionModel) => {
    onChange(model);
    analytics.attributionModelToggled({ model_type: model });
  };

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        size="sm"
        variant={value === "first_touch" ? "default" : "ghost"}
        className="h-7 text-xs"
        onClick={() => handleChange("first_touch")}
      >
        First Touch
      </Button>
      <Button
        size="sm"
        variant={value === "last_touch" ? "default" : "ghost"}
        className="h-7 text-xs"
        onClick={() => handleChange("last_touch")}
      >
        Last Touch
      </Button>
      <TooltipProvider>
        {["Linear", "Time Decay", "U-Shaped"].map((model) => (
          <Tooltip key={model}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs opacity-40 cursor-not-allowed"
                disabled
              >
                {model}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
