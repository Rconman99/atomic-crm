-- RC Digital LLC: Enable Supabase Realtime
-- Atomic CRM doesn't include this — we're adding live updates

-- Enable realtime on core tables
ALTER PUBLICATION supabase_realtime ADD TABLE companies;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE deals;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE contact_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE deal_notes;
