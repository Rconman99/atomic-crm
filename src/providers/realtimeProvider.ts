// RC Digital CRM — Supabase Realtime Provider
// Adds live updates to any react-admin resource

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/components/atomic-crm/providers/supabase/supabase";

/**
 * Hook to subscribe to realtime changes on a Supabase table.
 * Automatically invalidates react-admin/TanStack Query cache on changes.
 *
 * Usage in any List or Show component:
 *   useRealtimeSubscription('deals');
 *   useRealtimeSubscription('projects');
 */
export function useRealtimeSubscription(table: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: table,
        },
        () => {
          // Invalidate all queries for this resource so react-admin refetches
          queryClient.invalidateQueries({ queryKey: [table] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryClient]);
}
