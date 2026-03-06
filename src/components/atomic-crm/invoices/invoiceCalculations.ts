// Invoice calculation utilities (mirrors the DB trigger logic)

export function calculateInvoiceTotals(amount: number, taxRate: number) {
  const taxAmount = amount * (taxRate / 100);
  const totalAmount = amount + taxAmount;
  return {
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

export function sumLineItems(
  lineItems: Array<{ quantity: number; unit_price: number }>,
): number {
  return lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );
}

export type InvoiceStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Paid"
  | "Overdue"
  | "Cancelled";

const VALID_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  Draft: ["Sent", "Cancelled"],
  Sent: ["Viewed", "Paid", "Overdue", "Cancelled"],
  Viewed: ["Paid", "Overdue", "Cancelled"],
  Paid: [],
  Overdue: ["Paid", "Cancelled"],
  Cancelled: [],
};

export function isValidStatusTransition(
  from: InvoiceStatus,
  to: InvoiceStatus,
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
