-- RC Digital LLC: Custom Pipeline Stages
-- Replaces default Atomic CRM deal stages with RC Digital's pipeline

UPDATE configuration SET value = '{
  "dealStages": [
    "Lead",
    "Discovery Call",
    "Proposal Sent",
    "Signed",
    "In Build",
    "Review",
    "Delivered",
    "Paid"
  ],
  "dealCategories": [
    "Website Build",
    "App Development",
    "Redesign",
    "Maintenance",
    "Consulting"
  ],
  "dealGenders": [],
  "noteStatuses": ["cold", "warm", "hot"],
  "taskTypes": ["Email", "Call", "Meeting", "Follow-up", "Demo", "Proposal", "Review"],
  "companySectors": [
    "Healthcare",
    "Legal",
    "Real Estate",
    "Restaurant",
    "Retail",
    "Tech Startup",
    "Construction",
    "Finance",
    "Education",
    "Nonprofit",
    "Other"
  ],
  "companySize": ["1-10", "11-50", "51-200", "201-500", "500+"]
}'::jsonb WHERE key = 'deals';
