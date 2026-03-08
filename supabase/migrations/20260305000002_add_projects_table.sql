-- RC Digital LLC: Projects Table
-- Tracks what Ryan is actually building for each client

CREATE TABLE IF NOT EXISTS projects (
  id bigserial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Core project info
  name text NOT NULL,
  description text,
  project_type text NOT NULL DEFAULT 'Website Build',
  -- project_type options: 'Website Build', 'App Development', 'Redesign', 'Maintenance', 'Consulting'

  -- Relationships
  company_id bigint NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  deal_id bigint REFERENCES deals(id) ON DELETE SET NULL,
  contact_ids bigint[] DEFAULT '{}',
  sales_id bigint NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,

  -- Project details
  tech_stack text[],          -- e.g., ['Next.js', 'Supabase', 'Vercel']
  domain text,                -- e.g., 'clientsite.com'
  staging_url text,           -- e.g., 'staging.clientsite.com'
  production_url text,        -- e.g., 'clientsite.com'
  repo_url text,              -- GitHub repo link

  -- Timeline
  start_date date,
  target_end_date date,
  actual_end_date date,
  status text NOT NULL DEFAULT 'Not Started',
  -- status options: 'Not Started', 'In Progress', 'In Review', 'Delivered', 'Maintenance'

  -- PM & Action Plans
  pm_notes text,
  action_items jsonb DEFAULT '[]'::jsonb,
  -- action_items format: [{"task": "Set up hosting", "done": false, "due": "2026-03-15"}]

  -- Value tracking
  contract_value numeric(15,2),
  monthly_retainer numeric(15,2) DEFAULT 0,
  total_paid numeric(15,2) DEFAULT 0,

  -- What was built
  deliverables text,
  value_delivered text
);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_projects_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_projects_timestamp();

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_deal ON projects(deal_id);
CREATE INDEX idx_projects_sales ON projects(sales_id);
CREATE INDEX idx_projects_status ON projects(status);
