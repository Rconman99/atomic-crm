# Phase 10: Lead Management — Database & Backend

Read CLAUDE.md for project context. This phase adds the lead management foundation.

## Migration 1: Leads Table

Create `supabase/migrations/20260306000001_add_leads_table.sql`:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Identity
  first_name text,
  last_name text,
  email text,
  phone text,
  company_name text,
  job_title text,
  linkedin_url text,

  -- Source tracking
  source text NOT NULL DEFAULT 'manual',
  -- options: 'manual', 'website_form', 'landing_page', 'referral', 'linkedin', 'cold_outbound', 'google_ads', 'social_media', 'event', 'partner'
  source_detail text,         -- e.g., specific form name, campaign name, referrer name
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  landing_page_url text,      -- first page they hit
  referrer_url text,          -- where they came from

  -- Qualification
  lead_score integer DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  -- status options: 'new', 'contacted', 'qualifying', 'qualified', 'unqualified', 'converted', 'lost'
  qualification_notes text,

  -- Assignment
  sales_id bigint NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
  assigned_at timestamptz,

  -- Conversion tracking
  converted_at timestamptz,
  converted_contact_id bigint REFERENCES contacts(id),
  converted_deal_id bigint REFERENCES deals(id),

  -- Extra context
  tags bigint[],
  notes text,
  custom_fields jsonb DEFAULT '{}'::jsonb
);

-- Triggers
CREATE OR REPLACE FUNCTION update_leads_timestamp()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_leads_timestamp();

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads" ON leads FOR SELECT
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own leads" ON leads FOR INSERT
  WITH CHECK (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own leads" ON leads FOR UPDATE
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own leads" ON leads FOR DELETE
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX idx_leads_sales ON leads(sales_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_score ON leads(lead_score DESC);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

## Migration 2: Lead Activities Table

Create `supabase/migrations/20260306000002_add_lead_activities_table.sql`:

```sql
CREATE TABLE IF NOT EXISTS lead_activities (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  lead_id bigint NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  sales_id bigint REFERENCES sales(id),

  activity_type text NOT NULL,
  -- options: 'page_view', 'form_submit', 'email_open', 'email_click', 'call', 'meeting', 'note', 'status_change', 'score_change', 'email_sent'

  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  -- metadata examples:
  --   page_view: {"url": "/pricing", "duration_seconds": 45}
  --   form_submit: {"form_name": "Contact Us", "fields": {...}}
  --   email_open: {"subject": "Follow up", "campaign_id": "..."}
  --   status_change: {"from": "new", "to": "contacted"}

  score_delta integer DEFAULT 0  -- how much this activity changed the lead score
);

ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lead activities" ON lead_activities FOR SELECT
  USING (lead_id IN (SELECT id FROM leads WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())));
CREATE POLICY "Users can insert own lead activities" ON lead_activities FOR INSERT
  WITH CHECK (lead_id IN (SELECT id FROM leads WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())));

CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX idx_lead_activities_created ON lead_activities(created_at DESC);
```

## Migration 3: Lead Scoring Function

Create `supabase/migrations/20260306000003_lead_scoring_function.sql`:

```sql
-- Auto-calculate lead score based on activities
CREATE OR REPLACE FUNCTION recalculate_lead_score()
RETURNS trigger AS $$
DECLARE
  new_score integer;
BEGIN
  SELECT COALESCE(SUM(score_delta), 0) INTO new_score
  FROM lead_activities WHERE lead_id = NEW.lead_id;

  UPDATE leads SET lead_score = new_score WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_recalculate_lead_score
  AFTER INSERT OR UPDATE ON lead_activities
  FOR EACH ROW EXECUTE FUNCTION recalculate_lead_score();

-- Default scoring rules (applied via app logic):
-- +5  form_submit
-- +3  email_click
-- +2  email_open
-- +1  page_view
-- +10 meeting booked
-- +8  call completed
-- -5  unsubscribe
-- -10 bounce
```

## Migration 4: Lead-to-Contact Conversion Function

Create `supabase/migrations/20260306000004_lead_conversion_function.sql`:

```sql
CREATE OR REPLACE FUNCTION convert_lead_to_contact(
  p_lead_id bigint,
  p_deal_name text DEFAULT NULL,
  p_deal_amount bigint DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_lead leads%ROWTYPE;
  v_contact_id bigint;
  v_deal_id bigint;
  v_company_id bigint;
  v_result jsonb;
BEGIN
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found'; END IF;
  IF v_lead.status = 'converted' THEN RAISE EXCEPTION 'Lead already converted'; END IF;

  -- Find or create company
  IF v_lead.company_name IS NOT NULL THEN
    SELECT id INTO v_company_id FROM companies WHERE name = v_lead.company_name LIMIT 1;
    IF v_company_id IS NULL THEN
      INSERT INTO companies (name, sales_id) VALUES (v_lead.company_name, v_lead.sales_id)
      RETURNING id INTO v_company_id;
    END IF;
  END IF;

  -- Create contact
  INSERT INTO contacts (first_name, last_name, email, phone_1_number, title, company_id, sales_id, linkedin_url, first_seen, status)
  VALUES (v_lead.first_name, v_lead.last_name, v_lead.email, v_lead.phone, v_lead.job_title, v_company_id, v_lead.sales_id, v_lead.linkedin_url, v_lead.created_at, 'is_customer')
  RETURNING id INTO v_contact_id;

  -- Optionally create deal
  IF p_deal_name IS NOT NULL THEN
    INSERT INTO deals (name, company_id, contact_ids, stage, amount, sales_id)
    VALUES (p_deal_name, v_company_id, ARRAY[v_contact_id], 'opportunity', p_deal_amount, v_lead.sales_id)
    RETURNING id INTO v_deal_id;
  END IF;

  -- Mark lead as converted
  UPDATE leads SET
    status = 'converted',
    converted_at = now(),
    converted_contact_id = v_contact_id,
    converted_deal_id = v_deal_id
  WHERE id = p_lead_id;

  -- Log the conversion activity
  INSERT INTO lead_activities (lead_id, sales_id, activity_type, description, metadata)
  VALUES (p_lead_id, v_lead.sales_id, 'status_change', 'Lead converted to contact',
    jsonb_build_object('contact_id', v_contact_id, 'deal_id', v_deal_id, 'company_id', v_company_id));

  v_result = jsonb_build_object('contact_id', v_contact_id, 'deal_id', v_deal_id, 'company_id', v_company_id);
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Enable Realtime

Add leads and lead_activities to existing realtime publication:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE lead_activities;
```

## Rules
- Follow existing migration naming pattern
- RLS on every table — match the pattern from projects/invoices
- All tables get `security_invoker=on` on any views
- Use existing `sales` table for user ownership (sales_id pattern)
- Commit: "feat: add lead management tables, scoring, and conversion function"
