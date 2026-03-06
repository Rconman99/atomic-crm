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
