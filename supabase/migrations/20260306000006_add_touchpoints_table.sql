-- Touchpoints track every interaction across the entire customer journey
-- From anonymous visitor -> lead -> contact -> deal -> invoice paid

CREATE TABLE IF NOT EXISTS touchpoints (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT now(),

  -- Who (link to any entity in the funnel)
  lead_id bigint REFERENCES leads(id) ON DELETE SET NULL,
  contact_id bigint REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id bigint REFERENCES deals(id) ON DELETE SET NULL,
  anonymous_id text,  -- for pre-lead tracking (cookie/session ID)

  -- What happened
  touchpoint_type text NOT NULL,
  -- options: 'page_view', 'form_submit', 'ad_click', 'organic_search', 'social_click',
  --          'email_open', 'email_click', 'referral', 'direct', 'call', 'meeting',
  --          'demo', 'proposal_sent', 'contract_signed'

  -- Channel & Source
  channel text NOT NULL,
  -- options: 'organic_search', 'paid_search', 'social_organic', 'social_paid',
  --          'email', 'referral', 'direct', 'display', 'affiliate', 'offline'
  source text,              -- google, linkedin, facebook, newsletter, partner_name
  medium text,              -- cpc, organic, social, email, referral
  campaign text,            -- specific campaign name
  content text,             -- ad variation / CTA
  term text,                -- search keyword

  -- Page data
  page_url text,
  page_title text,
  referrer_url text,

  -- Attribution flags (set by attribution calculation)
  is_first_touch boolean DEFAULT false,
  is_last_touch boolean DEFAULT false,
  is_lead_creation_touch boolean DEFAULT false,  -- the touch that created the lead
  is_deal_creation_touch boolean DEFAULT false,  -- the touch that created the deal

  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  sales_id bigint REFERENCES sales(id)
);

ALTER TABLE touchpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own touchpoints" ON touchpoints FOR SELECT
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid())
    OR sales_id IS NULL);
CREATE POLICY "Users can insert touchpoints" ON touchpoints FOR INSERT
  WITH CHECK (true);  -- allow from edge functions and forms

CREATE INDEX idx_touchpoints_lead ON touchpoints(lead_id);
CREATE INDEX idx_touchpoints_contact ON touchpoints(contact_id);
CREATE INDEX idx_touchpoints_deal ON touchpoints(deal_id);
CREATE INDEX idx_touchpoints_anonymous ON touchpoints(anonymous_id);
CREATE INDEX idx_touchpoints_channel ON touchpoints(channel);
CREATE INDEX idx_touchpoints_created ON touchpoints(created_at DESC);
CREATE INDEX idx_touchpoints_type ON touchpoints(touchpoint_type);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE touchpoints;
