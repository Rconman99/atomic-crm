# Phase 7: Integrations

Read CLAUDE-CODE-MASTER-PROMPT.md and execute Phase 7 precisely.

## Quick Reference

### PostHog Setup
1. `npm install posthog-js`
2. Init in main entry with `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`
3. Track these events:
   - `deal_created`, `deal_stage_changed`, `deal_won`
   - `project_started`, `project_delivered`
   - `invoice_sent`, `invoice_paid`
4. Identify users on login

### Supabase Realtime
1. Create `src/providers/realtimeProvider.ts`
2. Build `useRealtimeSubscription(tableName)` hook
3. Subscribe to `postgres_changes` channel
4. Invalidate TanStack Query cache on changes
5. Use in deal, project, and invoice list views

### Gmail & Calendar
- Mark as TODO for Phase 2 development — skip for now

## Rules
- Follow existing provider patterns in src/providers/
- Use environment variables for all keys (VITE_ prefix)
- Commit when done with message: "feat: add PostHog analytics and Supabase Realtime"
