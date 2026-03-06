import { describe, it, expect } from "vitest";
import {
  calculateLineItemsTotal,
  calculateTaxAmount,
  calculateInvoiceTotal,
  type LineItem,
} from "./invoiceCalculations";

describe("calculateLineItemsTotal", () => {
  it("returns 0 for empty line items", () => {
    expect(calculateLineItemsTotal([])).toBe(0);
  });

  it("sums quantity * unit_price for each line item", () => {
    const items: LineItem[] = [
      { description: "Design", quantity: 1, unit_price: 5000 },
      { description: "Development", quantity: 2, unit_price: 3000 },
    ];
    expect(calculateLineItemsTotal(items)).toBe(11000);
  });

  it("handles fractional quantities", () => {
    const items: LineItem[] = [
      { description: "Hourly work", quantity: 2.5, unit_price: 100 },
    ];
    expect(calculateLineItemsTotal(items)).toBe(250);
  });

  it("handles zero quantity", () => {
    const items: LineItem[] = [
      { description: "Free item", quantity: 0, unit_price: 500 },
    ];
    expect(calculateLineItemsTotal(items)).toBe(0);
  });
});

describe("calculateTaxAmount", () => {
  it("calculates tax at 0%", () => {
    expect(calculateTaxAmount(10000, 0)).toBe(0);
  });

  it("calculates tax at 10%", () => {
    expect(calculateTaxAmount(10000, 10)).toBe(1000);
  });

  it("calculates tax at 8.25%", () => {
    expect(calculateTaxAmount(10000, 8.25)).toBe(825);
  });

  it("handles zero amount", () => {
    expect(calculateTaxAmount(0, 10)).toBe(0);
  });
});

describe("calculateInvoiceTotal", () => {
  it("returns correct totals with no tax", () => {
    const result = calculateInvoiceTotal(5000, 0);
    expect(result.taxAmount).toBe(0);
    expect(result.totalAmount).toBe(5000);
  });

  it("returns correct totals with 10% tax", () => {
    const result = calculateInvoiceTotal(5000, 10);
    expect(result.taxAmount).toBe(500);
    expect(result.totalAmount).toBe(5500);
  });

  it("returns correct totals with fractional tax rate", () => {
    const result = calculateInvoiceTotal(10000, 8.875);
    expect(result.taxAmount).toBe(887.5);
    expect(result.totalAmount).toBe(10887.5);
  });

  it("handles zero amount", () => {
    const result = calculateInvoiceTotal(0, 10);
    expect(result.taxAmount).toBe(0);
    expect(result.totalAmount).toBe(0);
  });
});
