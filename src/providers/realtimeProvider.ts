// RC Digital CRM — Supabase Realtime Provider
// Adds live updates to any react-admin resource

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../components/atomic-crm/providers/supabase/supabase";

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
        (payload) => {
          console.log(`[Realtime] ${table} ${payload.eventType}:`, payload);

          // Invalidate all queries for this resource so react-admin refetches
          queryClient.invalidateQueries({ queryKey: [table] });

          // Also invalidate the specific record if we have the ID
          if (payload.new && "id" in payload.new) {
            queryClient.invalidateQueries({
              queryKey: [table, "getOne", { id: String(payload.new.id) }],
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryClient]);
}

/**
 * Subscribe to multiple tables at once.
 *
 * Usage:
 *   useRealtimeSubscriptions(['deals', 'projects', 'invoices']);
 */
export function useRealtimeSubscriptions(tables: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channels = tables.map((table) =>
      supabase
        .channel(`${table}-changes`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: [table] });
            if (payload.new && "id" in payload.new) {
              queryClient.invalidateQueries({
                queryKey: [table, "getOne", { id: String(payload.new.id) }],
              });
            }
          },
        )
        .subscribe(),
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [tables.join(","), queryClient]);
}
