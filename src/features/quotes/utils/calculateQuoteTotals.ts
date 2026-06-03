import type {
  CreateQuoteInput,
  QuoteProduct,
} from "../types/quote.types";

export function calculateQuoteTotals(input: CreateQuoteInput) {
  const products: QuoteProduct[] = input.products.map((product) => {
    const total = product.quantity * product.unitPrice;

    return {
      ...product,
      total,
    };
  });

  const subtotal = products.reduce((sum, product) => {
    return sum + product.total;
  }, 0);

  const discountAmount = subtotal * (input.discountPercent / 100);
  const total = subtotal - discountAmount;
  const remainingPayment = total - input.advancePayment;

  return {
    products,
    subtotal,
    discountAmount,
    total,
    remainingPayment,
  };
}