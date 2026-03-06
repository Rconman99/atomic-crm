import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <Card className="m-4 border-destructive/50">
    <CardContent className="flex flex-col items-center gap-3 py-8">
      <CircleAlert className="w-8 h-8 text-destructive" />
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="text-xs text-muted-foreground max-w-md text-center">
        {error?.message || "An unexpected error occurred."}
      </p>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
        Try again
      </Button>
    </CardContent>
  </Card>
);

export const ResourceErrorBoundary = ({
  children,
}: {
  children: ReactNode;
}) => <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
