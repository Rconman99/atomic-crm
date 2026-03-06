import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectInputs } from "./ProjectInputs";
import { FormToolbar } from "../layout/FormToolbar";

export const ProjectEdit = () => (
  <EditBase
    actions={false}
    redirect="show"
    transform={(values) => {
      if (typeof values.tech_stack === "string") {
        values.tech_stack = values.tech_stack
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      return values;
    }}
  >
    <div className="mt-2 flex">
      <Form className="flex flex-1 flex-col gap-4 pb-2">
        <Card>
          <CardContent>
            <ProjectInputs />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </div>
  </EditBase>
);
