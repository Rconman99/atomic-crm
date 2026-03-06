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
