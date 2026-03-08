# Phase 11: Lead Management — UI Components

Read CLAUDE.md for project context. This phase builds the lead management frontend.

## Lead List Page (Kanban + Table View)

Create `src/leads/` directory with these components:

### LeadList.tsx
- Default view: Kanban board (same pattern as DealList) with columns for each lead status: New → Contacted → Qualifying → Qualified → Converted
- Toggle button to switch between Kanban and Table view
- Table view shows: Name, Company, Source, Score (with color badge), Status, Created date, Assigned to
- Sort by: lead_score DESC (default), created_at, status
- Filter by: status, source, score range, date range
- Bulk actions: change status, assign, delete
- "Add Lead" button opens LeadCreate form
- Wrap in CrmErrorBoundary

### LeadCreate.tsx
- Form fields: First Name, Last Name, Email, Phone, Company Name, Job Title, LinkedIn URL
- Source dropdown with all source options
- UTM fields (collapsible "Advanced" section): utm_source, utm_medium, utm_campaign, utm_term, utm_content
- Landing page URL, Referrer URL
- Notes textarea
- Tags multi-select
- Auto-assigns to current user's sales_id
- On submit: create lead + log 'note' activity with "Lead created manually"

### LeadShow.tsx (Detail Page)
- Header: Lead name, company, score badge, status badge
- Contact info section: email, phone, LinkedIn, job title
- Source info section: source, source_detail, UTMs, landing page, referrer
- **Activity Timeline** (most important): chronological list of all lead_activities
  - Each activity shows: icon by type, description, timestamp, score delta (if any)
  - Activity types get distinct icons: 📄 page_view, 📝 form_submit, 📧 email, 📞 call, 🤝 meeting, 📌 note, 🔄 status_change
- Quick actions sidebar:
  - Change status dropdown
  - Log activity button (call, email, meeting, note)
  - "Convert to Contact" button (opens modal)
- Lead score breakdown: show which activities contributed what points

### LeadConvert.tsx (Modal)
- Pre-fills from lead data: name, email, company
- Option to create deal during conversion: deal name, amount, stage
- "Convert" button calls the `convert_lead_to_contact` database function
- On success: redirect to new contact page, show toast
- On error: show error message, keep modal open

### LeadScoreBadge.tsx
- Reusable component showing lead score with color coding:
  - 0-20: gray (cold)
  - 21-50: blue (warming)
  - 51-75: orange (warm)
  - 76+: green (hot)
- Shows score number + temperature label

## Sidebar Navigation
- Add "Leads" to the sidebar navigation, positioned ABOVE "Contacts"
- Icon: use a funnel or magnet icon from lucide-react (e.g., `Filter` or `Magnet`)
- Add lead count badge showing number of 'new' leads

## Data Provider
- Add lead resources to the existing dataProvider pattern
- getList, getOne, create, update, delete for leads
- Custom method: convertLead(leadId, dealName?, dealAmount?) — calls the RPC function

## PostHog Events
Add tracking for:
- `lead_created` — source, utm_source
- `lead_status_changed` — from_status, to_status
- `lead_converted` — lead_id, contact_id, deal_id, time_to_convert_days
- `lead_score_changed` — old_score, new_score, activity_type

## Realtime
- Wire leads table into the existing realtimeProvider pattern
- Lead list auto-updates when new leads come in or scores change

## Rules
- Follow existing component patterns (look at DealList, ContactShow for reference)
- Use existing UI components from src/components/ui/
- TailwindCSS v4 for all styling — match the dark sidebar Twenty-inspired theme
- All new components get error boundaries
- Commit: "feat: add lead management UI with Kanban, timeline, and conversion flow"
