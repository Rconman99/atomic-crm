CREATE OR REPLACE FUNCTION convert_lead_to_contact(
  p_lead_id bigint,
  p_deal_name text DEFAULT NULL,
  p_deal_amount bigint DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_lead leads%ROWTYPE;
  v_contact_id bigint;
  v_deal_id bigint;
  v_company_id bigint;
  v_result jsonb;
BEGIN
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found'; END IF;
  IF v_lead.sales_id != (SELECT id FROM sales WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: lead does not belong to current user';
  END IF;
  IF v_lead.status = 'converted' THEN RAISE EXCEPTION 'Lead already converted'; END IF;

  -- Find or create company
  IF v_lead.company_name IS NOT NULL THEN
    SELECT id INTO v_company_id FROM companies WHERE name = v_lead.company_name LIMIT 1;
    IF v_company_id IS NULL THEN
      INSERT INTO companies (name, sales_id) VALUES (v_lead.company_name, v_lead.sales_id)
      RETURNING id INTO v_company_id;
    END IF;
  END IF;

  -- Create contact
  INSERT INTO contacts (first_name, last_name, email, phone_1_number, title, company_id, sales_id, linkedin_url, first_seen, status)
  VALUES (v_lead.first_name, v_lead.last_name, v_lead.email, v_lead.phone, v_lead.job_title, v_company_id, v_lead.sales_id, v_lead.linkedin_url, v_lead.created_at, 'is_customer')
  RETURNING id INTO v_contact_id;

  -- Optionally create deal
  IF p_deal_name IS NOT NULL THEN
    INSERT INTO deals (name, company_id, contact_ids, stage, amount, sales_id)
    VALUES (p_deal_name, v_company_id, ARRAY[v_contact_id], 'opportunity', p_deal_amount, v_lead.sales_id)
    RETURNING id INTO v_deal_id;
  END IF;

  -- Mark lead as converted
  UPDATE leads SET
    status = 'converted',
    converted_at = now(),
    converted_contact_id = v_contact_id,
    converted_deal_id = v_deal_id
  WHERE id = p_lead_id;

  -- Log the conversion activity
  INSERT INTO lead_activities (lead_id, sales_id, activity_type, description, metadata)
  VALUES (p_lead_id, v_lead.sales_id, 'status_change', 'Lead converted to contact',
    jsonb_build_object('contact_id', v_contact_id, 'deal_id', v_deal_id, 'company_id', v_company_id));

  v_result = jsonb_build_object('contact_id', v_contact_id, 'deal_id', v_deal_id, 'company_id', v_company_id);
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
