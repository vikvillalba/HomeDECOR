import type { User } from "firebase/auth";
import type { CreateQuoteInput } from "../types/quote.types";
import { calculateQuoteTotals } from "../utils/calculateQuoteTotals";
import {
  QUOTE_STATUS,
  cancelQuoteDocument,
  createQuoteDocument,
  getQuoteDocuments,
  updateQuoteDocument,
  type GetQuotesOptions,
  type UpdateQuoteDocument,
} from "../repositories/quoteRepository";

export async function createQuote(input: CreateQuoteInput, user: User) {
  const totals = calculateQuoteTotals(input);

  const quoteId = await createQuoteDocument({
    quoteNumber: Date.now(),

    clientName: input.clientName.trim(),
    clientPhone: input.clientPhone.trim(),
    clientAddress: input.clientAddress.trim(),

    products: totals.products,

    subtotal: totals.subtotal,
    discountPercent: input.discountPercent,
    discountAmount: totals.discountAmount,
    total: totals.total,

    advancePayment: input.advancePayment,
    remainingPayment: totals.remainingPayment,

    status: QUOTE_STATUS.COTIZACION,

    createdBy: user.uid,
    createdByEmail: user.email ?? "",
  });

  return quoteId;
}

export async function getQuotes(options: GetQuotesOptions = {}) {
  return getQuoteDocuments(options);
}

export async function updateQuote(
  quoteId: string,
  quoteData: UpdateQuoteDocument
) {
  return updateQuoteDocument(quoteId, quoteData);
}

export async function updateQuoteFromInput(
  quoteId: string,
  input: CreateQuoteInput
) {
  const totals = calculateQuoteTotals(input);

  return updateQuoteDocument(quoteId, {
    clientName: input.clientName.trim(),
    clientPhone: input.clientPhone.trim(),
    clientAddress: input.clientAddress.trim(),

    products: totals.products,

    subtotal: totals.subtotal,
    discountPercent: input.discountPercent,
    discountAmount: totals.discountAmount,
    total: totals.total,

    advancePayment: input.advancePayment,
    remainingPayment: totals.remainingPayment,
  });
}

export async function cancelQuote(quoteId: string, user: User) {
  return cancelQuoteDocument(quoteId, user.uid);
}