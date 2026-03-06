/**
 * Invoice calculation utilities.
 * Mirrors the database trigger logic for client-side preview.
 */

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export function calculateLineItemsTotal(lineItems: LineItem[]): number {
  return lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );
}

export function calculateTaxAmount(amount: number, taxRate: number): number {
  return amount * (taxRate / 100);
}

export function calculateInvoiceTotal(
  amount: number,
  taxRate: number,
): { taxAmount: number; totalAmount: number } {
  const taxAmount = calculateTaxAmount(amount, taxRate);
  return {
    taxAmount,
    totalAmount: amount + taxAmount,
  };
}
