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
