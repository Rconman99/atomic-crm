-- RC Digital LLC: Project Analytics Table
-- Daily analytics per project — SEO, leads, revenue attribution

CREATE TABLE IF NOT EXISTS project_analytics (
  id bigserial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),

  project_id bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,

  -- SEO Metrics
  organic_traffic integer DEFAULT 0,
  keyword_rankings jsonb DEFAULT '[]'::jsonb,
  -- format: [{"keyword": "best dentist miami", "position": 3, "change": +2}]
  domain_authority numeric(5,2),
  backlinks_count integer DEFAULT 0,

  -- Lead Generation
  leads_generated integer DEFAULT 0,
  lead_sources jsonb DEFAULT '[]'::jsonb,
  -- format: [{"source": "organic", "count": 5}, {"source": "paid", "count": 3}]
  form_submissions integer DEFAULT 0,
  phone_calls integer DEFAULT 0,

  -- Revenue Attribution
  revenue_from_leads numeric(15,2) DEFAULT 0,
  estimated_lead_value numeric(15,2) DEFAULT 0,

  -- Site Performance
  page_speed_score integer,          -- Google PageSpeed 0-100
  uptime_percent numeric(5,2) DEFAULT 100.00,

  -- Performance Bonuses (what Ryan should earn)
  performance_bonus_eligible boolean DEFAULT false,
  bonus_amount numeric(15,2) DEFAULT 0,
  bonus_notes text,

  -- Unique constraint: one entry per project per day
  UNIQUE(project_id, date)
);

-- Row Level Security
ALTER TABLE project_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics for own projects"
  ON project_analytics FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())
  ));

CREATE POLICY "Users can insert analytics for own projects"
  ON project_analytics FOR INSERT
  WITH CHECK (project_id IN (
    SELECT id FROM projects WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())
  ));

CREATE POLICY "Users can update analytics for own projects"
  ON project_analytics FOR UPDATE
  USING (project_id IN (
    SELECT id FROM projects WHERE sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())
  ));

-- Indexes
CREATE INDEX idx_analytics_project ON project_analytics(project_id);
CREATE INDEX idx_analytics_date ON project_analytics(date);
CREATE INDEX idx_analytics_project_date ON project_analytics(project_id, date);
