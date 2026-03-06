import { describe, it, expect } from "vitest";
import {
  calculateInvoiceTotals,
  sumLineItems,
  isValidStatusTransition,
} from "./invoiceCalculations";

describe("calculateInvoiceTotals", () => {
  it("calculates tax and total for standard rate", () => {
    const result = calculateInvoiceTotals(1000, 10);
    expect(result.taxAmount).toBe(100);
    expect(result.totalAmount).toBe(1100);
  });

  it("handles zero tax rate", () => {
    const result = calculateInvoiceTotals(5000, 0);
    expect(result.taxAmount).toBe(0);
    expect(result.totalAmount).toBe(5000);
  });

  it("handles fractional amounts correctly", () => {
    const result = calculateInvoiceTotals(99.99, 8.25);
    expect(result.taxAmount).toBe(8.25);
    expect(result.totalAmount).toBe(108.24);
  });

  it("handles zero amount", () => {
    const result = calculateInvoiceTotals(0, 10);
    expect(result.taxAmount).toBe(0);
    expect(result.totalAmount).toBe(0);
  });
});

describe("sumLineItems", () => {
  it("sums multiple line items", () => {
    const items = [
      { quantity: 2, unit_price: 500 },
      { quantity: 1, unit_price: 1000 },
      { quantity: 3, unit_price: 200 },
    ];
    expect(sumLineItems(items)).toBe(2600);
  });

  it("returns 0 for empty array", () => {
    expect(sumLineItems([])).toBe(0);
  });

  it("handles single item", () => {
    expect(sumLineItems([{ quantity: 1, unit_price: 4999 }])).toBe(4999);
  });
});

describe("isValidStatusTransition", () => {
  it("allows Draft → Sent", () => {
    expect(isValidStatusTransition("Draft", "Sent")).toBe(true);
  });

  it("allows Draft → Cancelled", () => {
    expect(isValidStatusTransition("Draft", "Cancelled")).toBe(true);
  });

  it("blocks Draft → Paid (must go through Sent first)", () => {
    expect(isValidStatusTransition("Draft", "Paid")).toBe(false);
  });

  it("allows Sent → Paid", () => {
    expect(isValidStatusTransition("Sent", "Paid")).toBe(true);
  });

  it("allows Overdue → Paid", () => {
    expect(isValidStatusTransition("Overdue", "Paid")).toBe(true);
  });

  it("blocks Paid → anything (terminal state)", () => {
    expect(isValidStatusTransition("Paid", "Draft")).toBe(false);
    expect(isValidStatusTransition("Paid", "Sent")).toBe(false);
    expect(isValidStatusTransition("Paid", "Cancelled")).toBe(false);
  });

  it("blocks Cancelled → anything (terminal state)", () => {
    expect(isValidStatusTransition("Cancelled", "Draft")).toBe(false);
    expect(isValidStatusTransition("Cancelled", "Paid")).toBe(false);
  });
});
