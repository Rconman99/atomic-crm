import { required } from "ra-core";
import { TextInput } from "@/components/admin/text-input";
import { NumberInput } from "@/components/admin/number-input";
import { DateInput } from "@/components/admin/date-input";
import { SelectInput } from "@/components/admin/select-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Sale } from "../types";

const projectTypes = [
  { id: "Website Build", name: "Website Build" },
  { id: "App Development", name: "App Development" },
  { id: "Redesign", name: "Redesign" },
  { id: "Maintenance", name: "Maintenance" },
  { id: "Consulting", name: "Consulting" },
];

const projectStatuses = [
  { id: "Not Started", name: "Not Started" },
  { id: "In Progress", name: "In Progress" },
  { id: "In Review", name: "In Review" },
  { id: "Delivered", name: "Delivered" },
  { id: "Maintenance", name: "Maintenance" },
];

const saleOptionRenderer = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;

export const ProjectInputs = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-4 p-1">
      <ProjectInfoInputs />
      <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
        <ProjectLinkedToInputs />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <ProjectDetailsInputs />
      </div>
    </div>
  );
};

const ProjectInfoInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <TextInput
      source="name"
      label="Project name"
      validate={required()}
      helperText={false}
    />
    <TextInput source="description" multiline rows={3} helperText={false} />
    <div className="flex gap-4">
      <SelectInput
        source="project_type"
        label="Type"
        choices={projectTypes}
        validate={required()}
        helperText={false}
        className="flex-1"
      />
      <SelectInput
        source="status"
        choices={projectStatuses}
        validate={required()}
        helperText={false}
        className="flex-1"
      />
    </div>
  </div>
);

const ProjectLinkedToInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <h6 className="text-lg font-semibold">Linked to</h6>
    <ReferenceInput source="company_id" reference="companies">
      <AutocompleteInput
        label="Company"
        optionText="name"
        validate={required()}
        helperText={false}
      />
    </ReferenceInput>
    <ReferenceInput source="deal_id" reference="deals">
      <AutocompleteInput
        label="Deal"
        optionText="name"
        helperText={false}
      />
    </ReferenceInput>
    <ReferenceInput
      source="sales_id"
      reference="sales"
      filter={{ "disabled@neq": true }}
    >
      <SelectInput
        label="Account manager"
        helperText={false}
        optionText={saleOptionRenderer}
        validate={required()}
      />
    </ReferenceInput>
  </div>
);

const ProjectDetailsInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <h6 className="text-lg font-semibold">Details</h6>
    <div className="flex gap-4">
      <DateInput source="start_date" helperText={false} className="flex-1" />
      <DateInput source="target_end_date" label="Target end" helperText={false} className="flex-1" />
    </div>
    <NumberInput source="contract_value" label="Contract value ($)" helperText={false} />
    <NumberInput source="monthly_retainer" label="Monthly retainer ($)" helperText={false} />
    <TextInput source="domain" helperText={false} />
    <TextInput source="staging_url" label="Staging URL" helperText={false} />
    <TextInput source="production_url" label="Production URL" helperText={false} />
    <TextInput source="repo_url" label="Repo URL" helperText={false} />
    <TextInput source="tech_stack" label="Tech stack (comma-separated)" helperText={false} />
    <TextInput source="pm_notes" label="PM notes" multiline rows={3} helperText={false} />
    <TextInput source="deliverables" multiline rows={2} helperText={false} />
    <TextInput source="value_delivered" label="Value delivered" multiline rows={2} helperText={false} />
  </div>
);
