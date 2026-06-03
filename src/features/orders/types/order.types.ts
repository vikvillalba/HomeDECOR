import type { Timestamp } from "firebase/firestore";
import type { QuoteProduct } from "../../quotes/types/quote.types";

export type OrderStatus = "pendiente" | "entregado" | "cancelado";

export type OrderDisplayStatus = OrderStatus | "atrasado";

export type CreateOrderDocument = {
  orderNumber: number;
  quoteId: string;
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
  searchTokens: string[];
  status: OrderStatus;
  deliveryDate: Timestamp;
  createdBy: string;
  createdByEmail: string;
};

export type Order = CreateOrderDocument & {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  deliveredAt?: Timestamp | null;
  deliveredBy?: string | null;
  cancelledAt?: Timestamp | null;
  cancelledBy?: string | null;
  cancelReason?: string | null;
};
