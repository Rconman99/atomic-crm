import { CreateBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";
import { AnalyticsInputs } from "./AnalyticsInputs";

export const AnalyticsCreate = () => (
  <CreateBase redirect="show">
    <div className="mt-2 flex lg:mr-72">
      <div className="flex-1">
        <Form
          defaultValues={{
            date: new Date().toISOString().split("T")[0],
            organic_traffic: 0,
            leads_generated: 0,
            form_submissions: 0,
            phone_calls: 0,
            revenue_from_leads: 0,
            estimated_lead_value: 0,
            backlinks_count: 0,
            uptime_percent: 100,
            performance_bonus_eligible: false,
            bonus_amount: 0,
          }}
        >
          <Card>
            <CardContent>
              <AnalyticsInputs />
              <div
                role="toolbar"
                className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
              >
                <CancelButton />
                <SaveButton label="Log Metrics" />
              </div>
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  </CreateBase>
);
