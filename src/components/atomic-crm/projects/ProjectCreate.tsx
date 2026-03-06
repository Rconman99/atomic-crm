import { CreateBase, Form, useGetIdentity } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";
import { ProjectInputs } from "./ProjectInputs";

export const ProjectCreate = () => {
  const { identity } = useGetIdentity();
  return (
    <CreateBase
      redirect="show"
      transform={(values) => {
        // Convert comma-separated tech_stack string to array
        if (typeof values.tech_stack === "string") {
          values.tech_stack = values.tech_stack
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
        return values;
      }}
    >
      <div className="mt-2 flex lg:mr-72">
        <div className="flex-1">
          <Form
            defaultValues={{
              sales_id: identity?.id,
              status: "Not Started",
              project_type: "Website Build",
              tech_stack: [],
              contact_ids: [],
            }}
          >
            <Card>
              <CardContent>
                <ProjectInputs />
                <div
                  role="toolbar"
                  className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
                >
                  <CancelButton />
                  <SaveButton label="Create Project" />
                </div>
              </CardContent>
            </Card>
          </Form>
        </div>
      </div>
    </CreateBase>
  );
};
