# Phase 12: Attribution Engine — Multi-Touch Tracking

Read CLAUDE.md for project context. This phase adds full-funnel attribution tracking from first touch to revenue.

## Migration 1: Touchpoints Table

Create `supabase/migrations/20260306000005_add_touchpoints_table.sql`:

```sql
-- Touchpoints track every interaction across the entire customer journey
-- From anonymous visitor → lead → contact → deal → invoice paid

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
```

## Migration 2: Attribution Summary View

Create `supabase/migrations/20260306000006_attribution_summary_view.sql`:

```sql
-- Channel performance summary
CREATE OR REPLACE VIEW channel_attribution_summary
WITH (security_invoker=on) AS
SELECT
  t.channel,
  t.source,
  COUNT(DISTINCT t.lead_id) as leads_generated,
  COUNT(DISTINCT t.contact_id) as contacts_touched,
  COUNT(DISTINCT t.deal_id) as deals_influenced,
  COUNT(DISTINCT CASE WHEN t.is_first_touch THEN t.lead_id END) as first_touch_leads,
  COUNT(DISTINCT CASE WHEN t.is_last_touch THEN t.deal_id END) as last_touch_deals,
  COALESCE(SUM(DISTINCT CASE WHEN t.is_first_touch AND d.stage IN ('won') THEN d.amount END), 0) as first_touch_revenue,
  COALESCE(SUM(DISTINCT CASE WHEN t.is_last_touch AND d.stage IN ('won') THEN d.amount END), 0) as last_touch_revenue,
  COUNT(*) as total_touchpoints
FROM touchpoints t
LEFT JOIN deals d ON t.deal_id = d.id
GROUP BY t.channel, t.source
ORDER BY leads_generated DESC;

-- Lead source performance
CREATE OR REPLACE VIEW lead_source_performance
WITH (security_invoker=on) AS
SELECT
  l.source,
  l.utm_source,
  l.utm_medium,
  l.utm_campaign,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN l.status = 'qualified' THEN 1 END) as qualified_leads,
  COUNT(CASE WHEN l.status = 'converted' THEN 1 END) as converted_leads,
  ROUND(
    COUNT(CASE WHEN l.status = 'converted' THEN 1 END)::numeric /
    NULLIF(COUNT(*), 0) * 100, 1
  ) as conversion_rate,
  AVG(l.lead_score) as avg_lead_score,
  AVG(EXTRACT(EPOCH FROM (l.converted_at - l.created_at)) / 86400)::integer as avg_days_to_convert
FROM leads l
GROUP BY l.source, l.utm_source, l.utm_medium, l.utm_campaign
ORDER BY total_leads DESC;

-- Full customer journey view
CREATE OR REPLACE VIEW customer_journeys
WITH (security_invoker=on) AS
SELECT
  COALESCE(c.first_name || ' ' || c.last_name, l.first_name || ' ' || l.last_name) as person_name,
  COALESCE(c.email, l.email) as email,
  l.id as lead_id,
  c.id as contact_id,
  d.id as deal_id,
  l.source as lead_source,
  l.created_at as lead_created,
  l.converted_at as converted_at,
  d.created_at as deal_created,
  d.stage as deal_stage,
  d.amount as deal_amount,
  COUNT(t.id) as total_touchpoints,
  MIN(t.created_at) as first_touch_date,
  MAX(t.created_at) as last_touch_date,
  EXTRACT(EPOCH FROM (COALESCE(l.converted_at, now()) - l.created_at)) / 86400 as days_in_funnel
FROM leads l
LEFT JOIN contacts c ON l.converted_contact_id = c.id
LEFT JOIN deals d ON l.converted_deal_id = d.id
LEFT JOIN touchpoints t ON t.lead_id = l.id OR t.contact_id = c.id
GROUP BY l.id, c.id, d.id, c.first_name, c.last_name, l.first_name, l.last_name, c.email, l.email,
  l.source, l.created_at, l.converted_at, d.created_at, d.stage, d.amount
ORDER BY l.created_at DESC;
```

## Migration 3: Auto-Set First/Last Touch Triggers

Create `supabase/migrations/20260306000007_attribution_triggers.sql`:

```sql
-- When a new touchpoint is created, check if it's the first touch for this lead
CREATE OR REPLACE FUNCTION set_attribution_flags()
RETURNS trigger AS $$
DECLARE
  existing_count integer;
BEGIN
  -- Check if this is the first touchpoint for the lead
  IF NEW.lead_id IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_count FROM touchpoints
    WHERE lead_id = NEW.lead_id AND id != NEW.id;

    IF existing_count = 0 THEN
      NEW.is_first_touch = true;
    END IF;
  END IF;

  -- Update previous last_touch to false, set this as last_touch
  IF NEW.lead_id IS NOT NULL THEN
    UPDATE touchpoints SET is_last_touch = false
    WHERE lead_id = NEW.lead_id AND is_last_touch = true AND id != NEW.id;
    NEW.is_last_touch = true;
  END IF;

  IF NEW.contact_id IS NOT NULL THEN
    UPDATE touchpoints SET is_last_touch = false
    WHERE contact_id = NEW.contact_id AND is_last_touch = true AND id != NEW.id;
    NEW.is_last_touch = true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER touchpoint_attribution_flags
  BEFORE INSERT ON touchpoints
  FOR EACH ROW EXECUTE FUNCTION set_attribution_flags();
```

## Rules
- All views use `WITH (security_invoker=on)` — learned from the projects_summary audit finding
- Follow existing migration naming pattern
- RLS on touchpoints table
- Commit: "feat: add attribution engine with touchpoints, channel analytics, and customer journeys"
