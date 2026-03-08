# Phase 9: Testing & Hardening

Read CLAUDE-CODE-MASTER-PROMPT.md and execute Phase 9 precisely.

## Quick Reference

### Error Boundaries
Add React Error Boundaries around:
- DealPipeline (Kanban board)
- ProjectList
- InvoiceList
- Dashboard

Each boundary should show a user-friendly error message with a "Try Again" button.

### Unit Tests (Vitest)
1. Invoice total calculations — verify tax_amount and total_amount math
2. Deal stage validation — verify stage transitions are valid
3. Pipeline stage configuration — verify all 8 stages are present

### Security Checklist
Run and verify each:
- [ ] All tables have RLS enabled
- [ ] No service role key in frontend code (grep for it)
- [ ] Storage bucket `attachments` is private
- [ ] Edge functions validate auth tokens
- [ ] No hardcoded API keys anywhere (grep for patterns)

### Full Flow Test
Manually walk through or write an integration test:
1. Sign up / Sign in with Google OAuth
2. Create a company
3. Create a contact linked to that company
4. Create a deal → move through pipeline stages
5. Create a project linked to the deal
6. Log analytics for the project
7. Create an invoice for the project
8. Mark invoice as paid
9. Verify dashboard reflects all changes

## Rules
- Use Vitest (already in the project) for unit tests
- Put tests in `src/__tests__/` or co-located `*.test.ts` files
- Commit when done: "test: add error boundaries, unit tests, and security hardening"
