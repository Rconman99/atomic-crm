# Phase 14: Lead + Attribution — Testing & Hardening

Read CLAUDE.md for project context. This phase tests and hardens everything from Phases 10-13.

## Error Boundaries

Add React Error Boundaries (using existing CrmErrorBoundary pattern) around:
- LeadList (Kanban + Table)
- LeadShow (Detail page)
- LeadConvert (Modal)
- AttributionDashboard (all tabs)
- ChannelPerformance
- CustomerJourneyTimeline
- TouchpointTimeline

Each boundary should show a user-friendly error message with a "Try Again" button (same pattern as Phase 9).

## Unit Tests (Vitest)

Add tests in `src/__tests__/` or co-located `*.test.ts` files:

### Lead Scoring Tests
1. Verify `score_delta` values: form_submit=+5, email_click=+3, email_open=+2, page_view=+1, meeting=+10, call=+8
2. Verify lead_score recalculates correctly after multiple activities
3. Verify negative scores work: unsubscribe=-5, bounce=-10

### Lead Status Validation
1. Verify valid status transitions: new → contacted → qualifying → qualified → converted
2. Verify status cannot go from 'converted' back to other states (enforced at app level)
3. Verify conversion sets converted_at timestamp

### Lead Conversion Tests
1. Verify `convert_lead_to_contact` creates a contact with correct field mapping
2. Verify company is found-or-created correctly
3. Verify optional deal creation works when deal_name is provided
4. Verify lead status updates to 'converted' after conversion
5. Verify conversion fails for already-converted leads
6. Verify conversion logs activity with correct metadata

### Attribution Tests
1. Verify first touchpoint for a lead gets `is_first_touch = true`
2. Verify new touchpoints update `is_last_touch` correctly (previous last_touch set to false)
3. Verify channel_attribution_summary aggregates correctly
4. Verify lead_source_performance conversion rates calculate properly

### LeadScoreBadge Tests
1. Score 0-20 renders gray "cold" badge
2. Score 21-50 renders blue "warming" badge
3. Score 51-75 renders orange "warm" badge
4. Score 76+ renders green "hot" badge

## Security Checklist

Run and verify each:
- [ ] `leads` table has RLS enabled with all 4 policies (SELECT, INSERT, UPDATE, DELETE)
- [ ] `lead_activities` table has RLS enabled with SELECT and INSERT policies
- [ ] `touchpoints` table has RLS enabled with SELECT and INSERT policies
- [ ] All views use `WITH (security_invoker=on)`: channel_attribution_summary, lead_source_performance, customer_journeys
- [ ] `convert_lead_to_contact` function uses `SECURITY DEFINER` appropriately
- [ ] `set_attribution_flags` trigger function uses `SECURITY DEFINER` appropriately
- [ ] `recalculate_lead_score` trigger function uses `SECURITY DEFINER` appropriately
- [ ] No service role key in any new frontend code
- [ ] No hardcoded API keys in new files

## Integration Test Flow

Walk through the complete lead-to-revenue journey:
1. Create a new lead (manual source) → verify it appears in LeadList Kanban "New" column
2. Log activities: page_view (+1), email_open (+2), form_submit (+5) → verify score = 8
3. Change lead status: New → Contacted → Qualifying → Qualified
4. Each status change logs activity in timeline
5. Convert lead to contact with deal ($10,000, "opportunity" stage)
6. Verify: contact created, company created, deal created, lead marked converted
7. Check attribution: create touchpoints for the lead → verify first/last touch flags
8. View Attribution Dashboard → verify channel performance shows the data
9. View Customer Journey → verify the full timeline appears
10. Check main Dashboard → verify lead pipeline card shows updated counts

## Performance Check
- LeadList with 100+ leads loads in under 2 seconds
- Attribution Dashboard queries return in under 3 seconds
- Customer Journey timeline with 50+ touchpoints renders smoothly

## Rules
- Use Vitest (already in the project) for all tests
- Put tests in `src/__tests__/` or co-located `*.test.ts` files
- Minimum 20 new tests for lead + attribution features
- All existing tests (81+) must still pass
- Commit: "test: add lead management and attribution tests, error boundaries, and security hardening"
