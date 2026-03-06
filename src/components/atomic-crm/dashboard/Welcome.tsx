import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Welcome = () => (
  <Card>
    <CardHeader className="px-4">
      <CardTitle>Welcome to RC Digital CRM</CardTitle>
    </CardHeader>
    <CardContent className="px-4">
      <p className="text-sm mb-4">
        Your agency command center for managing clients, deals, projects, and
        invoices — all in one place.
      </p>
      <p className="text-sm">
        Track your pipeline from lead to paid, monitor project deliverables,
        and keep every client relationship organized.
      </p>
    </CardContent>
  </Card>
);
