-- RC Digital LLC: Projects Summary View
-- Aggregates project data with company, deal, analytics, and invoice info

CREATE OR REPLACE VIEW projects_summary
WITH (security_invoker=on) AS
SELECT p.*,
  c.name as company_name,
  c.logo as company_logo,
  d.name as deal_name,
  d.stage as deal_stage,
  d.amount as deal_amount,
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
