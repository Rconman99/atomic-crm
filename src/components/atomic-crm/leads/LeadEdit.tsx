import { EditBase, Form, useNotify, useRedirect } from "ra-core";
import { TextInput } from "@/components/admin/text-input";
import { SelectInput } from "@/components/admin/select-input";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";
import { DeleteButton } from "@/components/admin/delete-button";
import { LEAD_SOURCES, LEAD_STATUSES } from "./leadConstants";

export const LeadEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <EditBase
      mutationMode="pessimistic"
      mutationOptions={{
        onSuccess: (_data: any, variables: any) => {
          notify("Lead updated");
          redirect(`/leads/${variables.id}/show`);
        },
      }}
    >
      <div className="mt-2 flex lg:mr-72">
        <div className="flex-1">
          <Form>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit Lead</h2>
                  <DeleteButton />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput source="first_name" label="First Name" />
                  <TextInput source="last_name" label="Last Name" />
                  <TextInput source="email" label="Email" type="email" />
                  <TextInput source="phone" label="Phone" />
                  <TextInput source="company_name" label="Company" />
                  <TextInput source="job_title" label="Job Title" />
                  <TextInput source="linkedin_url" label="LinkedIn URL" />
                  <SelectInput
                    source="source"
                    label="Lead Source"
                    choices={LEAD_SOURCES.map((s) => ({
                      id: s.value,
                      name: s.label,
                    }))}
                  />
                  <SelectInput
                    source="status"
                    label="Status"
                    choices={LEAD_STATUSES.map((s) => ({
                      id: s.value,
                      name: s.label,
                    }))}
                  />
                </div>

                <details className="mt-4">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer">
                    Advanced — UTM & Attribution
                  </summary>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <TextInput source="source_detail" label="Source Detail" />
                    <TextInput source="utm_source" label="UTM Source" />
                    <TextInput source="utm_medium" label="UTM Medium" />
                    <TextInput source="utm_campaign" label="UTM Campaign" />
                    <TextInput source="utm_term" label="UTM Term" />
                    <TextInput source="utm_content" label="UTM Content" />
                    <TextInput source="landing_page_url" label="Landing Page URL" />
                    <TextInput source="referrer_url" label="Referrer URL" />
                  </div>
                </details>

                <div className="mt-4">
                  <TextInput source="qualification_notes" label="Qualification Notes" multiline rows={3} />
                  <TextInput source="notes" label="Notes" multiline rows={3} />
                </div>

                <div
                  role="toolbar"
                  className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
                >
                  <CancelButton />
                  <SaveButton label="Save Lead" />
                </div>
              </CardContent>
            </Card>
          </Form>
        </div>
      </div>
    </EditBase>
  );
};
