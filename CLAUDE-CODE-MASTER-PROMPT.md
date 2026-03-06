# RC DIGITAL CRM — MASTER BUILD PROMPT FOR CLAUDE CODE

> **Copy everything below this line and paste it into Claude Code after forking the repo.**

---

You are building a custom CRM for **RC Digital LLC**, a website and app development agency. The owner (Ryan) is an intermediate vibecoder with no coding skills — you must handle ALL code autonomously with zero hand-holding. Build phase by phase, commit after each phase, and confirm what was done before moving to the next.

## FOUNDATION
Fork **marmelab/atomic-crm** (MIT license). This is a React 19 + Supabase + Vite + TailwindCSS v4 + shadcn/ui CRM built on the **react-admin** framework (ra-core 5.x with ra-supabase-core 3.x). It has 8 tables (companies, contacts, deals, contact_notes, deal_notes, sales, tags, tasks), 6 Edge Functions, Google OAuth, and a Kanban pipeline.

## WHAT TO BUILD (9 Phases)

### PHASE 1: Setup
1. Clone the fork into `rc-digital-crm`, run `npm install` (requires Node 22)
2. Verify project structure — main code is in `src/components/atomic-crm/`
3. Create a `CLAUDE.md` in the root with project context (stack, brand, pipeline stages, file structure)

### PHASE 2: Supabase Setup
1. Link to Supabase project via CLI: `supabase link --project-ref PROJECT_REF`
2. Push existing Atomic CRM migrations: `supabase db push`
3. Enable extensions: `http`, `pg_net`, `pgcrypto`
4. Create storage bucket `attachments` (private, authenticated access only)
5. **ASK RYAN** for his Supabase project ref and API keys before proceeding

### PHASE 3: Custom Database Schema
Run these migrations in order:

**Migration 1 — Custom Pipeline Stages:**
```sql
UPDATE configuration SET value = '{
  "dealStages": ["Lead", "Discovery Call", "Proposal Sent", "Signed", "In Build", "Review", "Delivered", "Paid"],
  "dealCategories": ["Website Build", "App Development", "Redesign", "Maintenance", "Consulting"],
  "noteStatuses": ["Cold Call", "Email", "Meeting Notes", "Follow Up", "Proposal Draft", "Contract Signed"],
  "taskTypes": ["Follow Up", "Send Proposal", "Schedule Call", "Review Design", "Deploy Site", "Invoice Client", "Check Analytics"],
  "companySectors": ["Healthcare", "Real Estate", "E-Commerce", "Restaurant/Food", "Professional Services", "Construction", "Fitness/Wellness", "Education", "Non-Profit", "Technology", "Other"],
  "contactStatuses": ["hot", "warm", "cold", "inactive"]
}'::jsonb WHERE key = 'deals';
```

**Migration 2 — Projects Table:**
```sql
CREATE TABLE IF NOT EXISTS projects (
  id bigserial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  name text NOT NULL,
  description text,
  project_type text NOT NULL DEFAULT 'Website Build',
  company_id bigint NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  deal_id bigint REFERENCES deals(id) ON DELETE SET NULL,
  contact_ids bigint[] DEFAULT '{}',
  sales_id bigint NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
  tech_stack text[],
  domain text,
  staging_url text,
  production_url text,
  repo_url text,
  start_date date,
  target_end_date date,
  actual_end_date date,
  status text NOT NULL DEFAULT 'Not Started',
  pm_notes text,
  action_items jsonb DEFAULT '[]'::jsonb,
  contract_value numeric(15,2),
  monthly_retainer numeric(15,2) DEFAULT 0,
  total_paid numeric(15,2) DEFAULT 0,
  deliverables text,
  value_delivered text
);

CREATE OR REPLACE FUNCTION update_projects_timestamp() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_projects_timestamp();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_deal ON projects(deal_id);
CREATE INDEX idx_projects_sales ON projects(sales_id);
CREATE INDEX idx_projects_status ON projects(status);
```

**Migration 3 — Project Analytics Table:**
```sql
CREATE TABLE IF NOT EXISTS project_analytics (
  id bigserial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  project_id bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  organic_traffic integer DEFAULT 0,
  keyword_rankings jsonb DEFAULT '[]'::jsonb,
  domain_authority numeric(5,2),
  backlinks_count integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  lead_sources jsonb DEFAULT '[]'::jsonb,
  form_submissions integer DEFAULT 0,
  phone_calls integer DEFAULT 0,
  revenue_from_leads numeric(15,2) DEFAULT 0,
  estimated_lead_value numeric(15,2) DEFAULT 0,
  page_speed_score integer,
  uptime_percent numeric(5,2) DEFAULT 100.00,
  performance_bonus_eligible boolean DEFAULT false,
  bonus_amount numeric(15,2) DEFAULT 0,
  bonus_reason text,
  UNIQUE(project_id, date)
);

ALTER TABLE project_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view analytics for own projects" ON project_analytics FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert analytics" ON project_analytics FOR INSERT WITH CHECK (project_id IN (SELECT id FROM projects WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())));
CREATE POLICY "Users can update analytics" ON project_analytics FOR UPDATE USING (project_id IN (SELECT id FROM projects WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())));

CREATE INDEX idx_analytics_project ON project_analytics(project_id);
CREATE INDEX idx_analytics_date ON project_analytics(date);
CREATE INDEX idx_analytics_project_date ON project_analytics(project_id, date);
```

**Migration 4 — Invoices Table:**
```sql
CREATE TABLE IF NOT EXISTS invoices (
  id bigserial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  company_id bigint NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  project_id bigint REFERENCES projects(id) ON DELETE SET NULL,
  deal_id bigint REFERENCES deals(id) ON DELETE SET NULL,
  sales_id bigint NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
  invoice_number text NOT NULL,
  title text NOT NULL,
  description text,
  amount numeric(15,2) NOT NULL,
  tax_rate numeric(5,2) DEFAULT 0,
  tax_amount numeric(15,2) DEFAULT 0,
  total_amount numeric(15,2) NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  paid_date date,
  line_items jsonb DEFAULT '[]'::jsonb,
  payment_method text,
  payment_reference text,
  notes text,
  terms text DEFAULT 'Payment due within 30 days of invoice date.'
);

CREATE OR REPLACE FUNCTION update_invoices_timestamp() RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_invoices_timestamp();

CREATE OR REPLACE FUNCTION calculate_invoice_totals() RETURNS trigger AS $$
BEGIN NEW.tax_amount = NEW.amount * (NEW.tax_rate / 100); NEW.total_amount = NEW.amount + NEW.tax_amount; RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER invoices_calculate_totals BEFORE INSERT OR UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own invoices" ON invoices FOR INSERT WITH CHECK (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own invoices" ON invoices FOR UPDATE USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own invoices" ON invoices FOR DELETE USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE INDEX idx_invoices_company ON invoices(company_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

**Migration 5 — Enable Realtime (not in Atomic CRM):**
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE companies;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE deals;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE contact_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE deal_notes;
```

**Migration 6 — Projects Summary View:**
```sql
CREATE OR REPLACE VIEW projects_summary AS
SELECT p.*, c.name as company_name, c.logo as company_logo,
  d.name as deal_name, d.stage as deal_stage, d.amount as deal_amount,
  COUNT(DISTINCT pa.id) as analytics_entries,
  COALESCE(SUM(pa.leads_generated), 0) as total_leads,
  COALESCE(SUM(pa.revenue_from_leads), 0) as total_revenue_from_leads,
  COUNT(DISTINCT i.id) as invoice_count,
  COALESCE(SUM(CASE WHEN i.status = 'Paid' THEN i.total_amount ELSE 0 END), 0) as total_paid_amount,
  COALESCE(SUM(CASE WHEN i.status IN ('Sent', 'Viewed', 'Overdue') THEN i.total_amount ELSE 0 END), 0) as total_outstanding
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
LEFT JOIN deals d ON p.deal_id = d.id
LEFT JOIN project_analytics pa ON p.id = pa.project_id
LEFT JOIN invoices i ON p.id = i.project_id
GROUP BY p.id, c.name, c.logo, d.name, d.stage, d.amount;
```

### PHASE 4: Environment Configuration
1. Create `.env.development` with Supabase URL + anon key + app name
2. Create `.env.production` (same but for prod)
3. **ASK RYAN** for his keys — never hardcode or guess them

### PHASE 5: Customize the Frontend
1. Find/replace ALL references to "Atomic CRM" with "RC Digital CRM"
2. Update login page branding for RC Digital LLC
3. Register 3 new react-admin `<Resource>` components:
   - `projects` (list, show, create, edit views)
   - `project_analytics` (list, show, create views)
   - `invoices` (list, show, create, edit views)
4. Add sidebar nav items: 📁 Projects, 📊 Analytics, 💰 Invoices
5. Extend the data provider in `src/components/atomic-crm/providers/supabase/` to handle new tables — follow existing patterns for deals/contacts
6. Update the configuration to use the RC Digital pipeline stages from Migration 1
7. Build all CRUD components for Projects following the same patterns as existing Deals components:
   - `ProjectList` — table view with company name, status pills, contract value, timeline
   - `ProjectShow` — detail view with all fields, linked deal, linked company, analytics summary
   - `ProjectCreate` — form with company selector, deal selector, tech stack multi-select, dates
   - `ProjectEdit` — same as create but with status transitions
8. Build Invoice components:
   - `InvoiceList` — table with status pills, amounts, due dates, company
   - `InvoiceShow` — full detail with line items rendered as a mini table
   - `InvoiceCreate` — form with line item builder (add/remove rows), auto-calculate totals
   - `InvoiceEdit` — same, with status transitions (Draft→Sent→Paid)
9. Build Analytics components:
   - `AnalyticsList` — table of daily entries per project with key metrics
   - `AnalyticsShow` — detail view with charts (organic traffic over time, leads bar chart)
   - `AnalyticsCreate` — form for logging daily metrics
10. Add custom fields to contact form: `preferred_communication`, `referral_source`, `decision_maker`
11. Add custom fields to company form: `current_website`, `industry_niche`, `annual_revenue_range`, `tech_comfort_level`

### PHASE 6: Twenty-Inspired UI Redesign
Redesign the UI to look like Twenty CRM (the YC-backed CRM with the best UI in the space). Key changes:

1. **Sidebar:** Dark background (#1C1C1E), white icon+label nav, active state with left edge highlight, collapsible sections, ⌘K command palette search at top, user avatar at bottom
2. **Kanban Pipeline Cards:** White bg, 8px border-radius, subtle shadow, show company logo + deal name + amount bold + contact avatars + expected close date. Column headers show stage name + total value as colored pill. Stage colors: Lead/Discovery=purple (#7C5EE9), Proposal/Signed=cyan (#00BCD4), In Build/Review=orange (#FF9800), Delivered/Paid=green (#4CAF50)
3. **Tables:** 48px row height, company logo in first column, sortable headers with arrows, row hover gray bg, status shown as colored pills not plain text, checkbox column for bulk actions
4. **Detail Pages:** Two-column layout (60% main / 40% activity feed), card-based sections, inline editing, activity timeline with avatar+action+timestamp
5. **Dashboard:** Grid of metric cards (icon with colored bg, metric name, large number, trend arrow). Pipeline bar chart. Recent activity feed + upcoming tasks
6. **Typography:** Inter font family, 24px bold h1, 20px semibold h2, 14px body, 12px caption
7. **Design tokens CSS file** at `src/styles/twenty-design-system.css`:
```css
:root {
  --rc-primary: #1a1a2e;
  --rc-accent: #0f3460;
  --rc-highlight: #e94560;
  --rc-success: #10b981;
  --rc-warning: #f59e0b;
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --border-light: #ebebeb;
  --radius-md: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.08);
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### PHASE 7: Integrations
1. **PostHog:** `npm install posthog-js`, init in main entry with `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`. Track events: `deal_created`, `deal_stage_changed`, `deal_won`, `project_started`, `project_delivered`, `invoice_sent`, `invoice_paid`. Identify users on login.
2. **Supabase Realtime:** Create `src/providers/realtimeProvider.ts` with a `useRealtimeSubscription(tableName)` hook that subscribes to postgres_changes and invalidates TanStack Query cache. Use it in deal, project, and invoice list views.
3. **Gmail & Calendar:** Skip for now — mark as TODO for Phase 2 development.

### PHASE 8: Deploy to Vercel
1. Create `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{ "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }]
}
```
2. **ASK RYAN** to connect the repo to Vercel and set env vars
3. Test the build: `npm run build` — fix any errors before deploying

### PHASE 9: Testing & Hardening
1. Add React Error Boundaries around DealPipeline, ProjectList, InvoiceList, Dashboard
2. Add basic Vitest unit tests for invoice total calculations and deal stage validation
3. Run security checklist:
   - All tables have RLS ✓
   - No service role key in frontend ✓
   - Storage bucket is private ✓
   - Edge functions validate auth ✓
4. Test the full flow: Sign up → Create company → Create contact → Create deal → Move through pipeline → Create project → Log analytics → Create invoice → Mark paid

## CRITICAL RULES
- **react-admin patterns:** All CRUD uses react-admin's `<Resource>`, `<List>`, `<Show>`, `<Create>`, `<Edit>` components. Data goes through the ra-supabase data provider, NOT raw Supabase client calls.
- **RLS is mandatory:** Every new table MUST have Row Level Security with policies scoped to `auth.uid()` through the `sales` table.
- **Never expose service role key** in frontend code.
- **Commit after each phase** with a descriptive message.
- **Ask Ryan for credentials** — never guess Supabase keys, project refs, or API keys.
- **Follow existing code patterns** — look at how `deals/` and `contacts/` components are structured before building `projects/` and `invoices/`.

## BRAND
- **Company:** RC Digital LLC
- **App Name:** RC Digital CRM
- **Primary:** #1a1a2e (deep navy)
- **Accent:** #0f3460 (rich blue)
- **Highlight:** #e94560 (red-pink CTAs)
- **Font:** Inter

Start with Phase 1 now. Work autonomously. Commit after each phase. Let's build this.
