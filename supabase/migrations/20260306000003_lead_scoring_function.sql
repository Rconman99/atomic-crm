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
