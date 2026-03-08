-- RC Digital LLC: Invoices Table
-- Billing and payment tracking for client projects

CREATE TABLE IF NOT EXISTS invoices (
  id bigserial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Relationships
  company_id bigint NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  project_id bigint REFERENCES projects(id) ON DELETE SET NULL,
  deal_id bigint REFERENCES deals(id) ON DELETE SET NULL,
  sales_id bigint NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,

  -- Invoice details
  invoice_number text NOT NULL,
  description text,
  amount numeric(15,2) NOT NULL,
  tax_rate numeric(5,2) DEFAULT 0,
  tax_amount numeric(15,2) DEFAULT 0,
  total_amount numeric(15,2) NOT NULL,

  -- Line items
  line_items jsonb DEFAULT '[]'::jsonb,
  -- format: [{"description": "Homepage design", "quantity": 1, "rate": 2500, "amount": 2500}]

  -- Status
  status text NOT NULL DEFAULT 'Draft',
  -- status options: 'Draft', 'Sent', 'Viewed', 'Paid', 'Overdue', 'Cancelled'

  -- Dates
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  paid_date date,

  -- Payment
  payment_method text,
  -- options: 'Stripe', 'PayPal', 'Zelle', 'Check', 'Cash', 'Wire', 'Crypto'
  payment_reference text,  -- e.g., Stripe payment ID

  -- Notes
  notes text,
  terms text DEFAULT 'Payment due within 30 days of invoice date.'
);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_invoices_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoices_timestamp();

-- Auto-calculate tax_amount and total_amount
CREATE OR REPLACE FUNCTION calculate_invoice_totals()
RETURNS trigger AS $$
BEGIN
  NEW.tax_amount = NEW.amount * (NEW.tax_rate / 100);
  NEW.total_amount = NEW.amount + NEW.tax_amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoices_calculate_totals
  BEFORE INSERT OR UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

-- Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  WITH CHECK (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  USING (sales_id = (SELECT id FROM sales WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX idx_invoices_company ON invoices(company_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_sales ON invoices(sales_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
