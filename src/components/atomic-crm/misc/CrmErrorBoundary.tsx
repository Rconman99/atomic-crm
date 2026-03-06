import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CrmErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CRM Error Boundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/50 bg-destructive/5 my-4">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <AlertTriangle className="w-10 h-10 text-destructive" />
            <h3 className="text-lg font-semibold">
              {this.props.fallbackTitle ?? "Something went wrong"}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {this.state.error?.message ??
                "An unexpected error occurred. Please try again."}
            </p>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
