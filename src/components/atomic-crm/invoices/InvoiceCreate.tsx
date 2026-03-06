import { CreateBase, Form, useGetIdentity } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";
import { InvoiceInputs } from "./InvoiceInputs";

export const InvoiceCreate = () => {
  const { identity } = useGetIdentity();
  return (
    <CreateBase redirect="show">
      <div className="mt-2 flex lg:mr-72">
        <div className="flex-1">
          <Form
            defaultValues={{
              sales_id: identity?.id,
              status: "Draft",
              tax_rate: 0,
              amount: 0,
              total_amount: 0,
              tax_amount: 0,
              issue_date: new Date().toISOString().split("T")[0],
              terms: "Payment due within 30 days of invoice date.",
            }}
          >
            <Card>
              <CardContent>
                <InvoiceInputs />
                <div
                  role="toolbar"
                  className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
                >
                  <CancelButton />
                  <SaveButton label="Create Invoice" />
                </div>
              </CardContent>
            </Card>
          </Form>
        </div>
      </div>
    </CreateBase>
  );
};
