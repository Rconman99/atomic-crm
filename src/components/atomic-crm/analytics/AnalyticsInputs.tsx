import { required } from "ra-core";
import { TextInput } from "@/components/admin/text-input";
import { NumberInput } from "@/components/admin/number-input";
import { DateInput } from "@/components/admin/date-input";
import { BooleanInput } from "@/components/admin/boolean-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export const AnalyticsInputs = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex gap-4">
        <ReferenceInput source="project_id" reference="projects">
          <AutocompleteInput
            label="Project"
            optionText="name"
            validate={required()}
            helperText={false}
          />
        </ReferenceInput>
        <DateInput
          source="date"
          validate={required()}
          helperText={false}
        />
      </div>
      <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
        <SeoInputs />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <LeadInputs />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <PerformanceInputs />
      </div>
    </div>
  );
};

const SeoInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <h6 className="text-lg font-semibold">SEO Metrics</h6>
    <NumberInput source="organic_traffic" label="Organic traffic" helperText={false} />
    <NumberInput source="domain_authority" label="Domain authority" helperText={false} />
    <NumberInput source="backlinks_count" label="Backlinks" helperText={false} />
  </div>
);

const LeadInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <h6 className="text-lg font-semibold">Lead Generation</h6>
    <NumberInput source="leads_generated" label="Leads generated" helperText={false} />
    <NumberInput source="form_submissions" label="Form submissions" helperText={false} />
    <NumberInput source="phone_calls" label="Phone calls" helperText={false} />
    <NumberInput source="revenue_from_leads" label="Revenue from leads ($)" helperText={false} />
    <NumberInput source="estimated_lead_value" label="Estimated lead value ($)" helperText={false} />
  </div>
);

const PerformanceInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <h6 className="text-lg font-semibold">Site Performance</h6>
    <NumberInput source="page_speed_score" label="PageSpeed score (0-100)" helperText={false} />
    <NumberInput source="uptime_percent" label="Uptime %" helperText={false} />
    <BooleanInput source="performance_bonus_eligible" label="Bonus eligible" helperText={false} />
    <NumberInput source="bonus_amount" label="Bonus amount ($)" helperText={false} />
    <TextInput source="bonus_notes" label="Bonus notes" multiline rows={2} helperText={false} />
  </div>
);
