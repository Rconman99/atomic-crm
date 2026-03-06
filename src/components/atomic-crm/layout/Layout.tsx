import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Notification } from "@/components/admin/notification";
import { Error } from "@/components/admin/error";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshButton } from "@/components/admin/refresh-button";

import { useConfigurationLoader } from "../root/useConfigurationLoader";
import { CrmSidebar } from "./CrmSidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  useConfigurationLoader();
  return (
    <>
      <CrmSidebar />
      <main
        className="ml-[220px] min-h-screen pt-4 px-6 pb-8"
        id="main-content"
      >
        <div className="flex justify-end mb-2">
          <RefreshButton />
        </div>
        <ErrorBoundary FallbackComponent={Error}>
          <Suspense
            fallback={<Skeleton className="h-12 w-12 rounded-full" />}
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Notification />
    </>
  );
};
