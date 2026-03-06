import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { InvoiceInputs } from "./InvoiceInputs";
import { FormToolbar } from "../layout/FormToolbar";

export const InvoiceEdit = () => (
  <EditBase actions={false} redirect="show">
    <div className="mt-2 flex">
      <Form className="flex flex-1 flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <InvoiceInputs />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </div>
  </EditBase>
);
