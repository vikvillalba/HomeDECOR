import type { Timestamp } from "firebase/firestore";

export type QuoteStatus = "cotizacion" | "convertida_a_pedido" | "cancelada";

export type QuoteProductInput = {
  area: string;
  productName: string;
  model: string;
  description: string;
  width: number;
  height: number;
  quantity: number;
  unitPrice: number;
};

export type QuoteProduct = QuoteProductInput & {
  total: number;
};

export type CreateQuoteInput = {
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  products: QuoteProductInput[];
  discountPercent: number;
  advancePayment: number;
};

export type CreateQuoteDocument = {
  quoteNumber: number;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  products: QuoteProduct[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  advancePayment: number;
  remainingPayment: number;
  status: QuoteStatus;
  createdBy: string;
  createdByEmail: string;
};

export type Quote = CreateQuoteDocument & {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  deletedAt?: Timestamp | null;
  deletedBy?: string | null;
};