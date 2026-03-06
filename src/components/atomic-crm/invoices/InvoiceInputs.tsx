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

const invoiceStatuses = [
  { id: "Draft", name: "Draft" },
  { id: "Sent", name: "Sent" },
  { id: "Viewed", name: "Viewed" },
  { id: "Paid", name: "Paid" },
  { id: "Overdue", name: "Overdue" },
  { id: "Cancelled", name: "Cancelled" },
];

const paymentMethods = [
  { id: "Stripe", name: "Stripe" },
  { id: "PayPal", name: "PayPal" },
  { id: "Zelle", name: "Zelle" },
  { id: "Check", name: "Check" },
  { id: "Cash", name: "Cash" },
  { id: "Wire", name: "Wire" },
  { id: "Crypto", name: "Crypto" },
];

const saleOptionRenderer = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;

export const InvoiceInputs = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-4 p-1">
      <InvoiceInfoInputs />
      <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
        <InvoiceLinkedToInputs />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <InvoicePaymentInputs />
      </div>
    </div>
  );
};

const InvoiceInfoInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <div className="flex gap-4">
      <TextInput
        source="invoice_number"
        label="Invoice #"
        validate={required()}
        helperText={false}
        className="flex-1"
      />
      <SelectInput
        source="status"
        choices={invoiceStatuses}
        validate={required()}
        helperText={false}
        className="flex-1"
      />
    </div>
    <TextInput source="description" multiline rows={2} helperText={false} />
    <div className="flex gap-4">
      <NumberInput
        source="amount"
        label="Amount ($)"
        validate={required()}
        helperText={false}
        className="flex-1"
      />
      <NumberInput
        source="tax_rate"
        label="Tax rate (%)"
        helperText={false}
        className="flex-1"
      />
    </div>
  </div>
);

const InvoiceLinkedToInputs = () => (
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
    <ReferenceInput source="project_id" reference="projects">
      <AutocompleteInput
        label="Project"
        optionText="name"
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

const InvoicePaymentInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <h6 className="text-lg font-semibold">Dates & Payment</h6>
    <DateInput source="issue_date" label="Issue date" helperText={false} />
    <DateInput source="due_date" label="Due date" helperText={false} />
    <DateInput source="paid_date" label="Paid date" helperText={false} />
    <SelectInput
      source="payment_method"
      label="Payment method"
      choices={paymentMethods}
      helperText={false}
    />
    <TextInput source="payment_reference" label="Payment reference" helperText={false} />
    <TextInput source="notes" multiline rows={2} helperText={false} />
    <TextInput source="terms" multiline rows={2} helperText={false} />
  </div>
);
