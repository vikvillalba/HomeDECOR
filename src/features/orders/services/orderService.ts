import type { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import type { Quote } from "../../quotes/types/quote.types";
import {
  ORDER_STATUS,
  createOrderFromQuoteDocument,
  cancelOrderDocument,
  getOrderDocuments,
  markOrderDeliveredDocument,
  updateOrderDeliveryDateDocument,
  type GetOrdersOptions,
} from "../repositories/orderRepository";
import type {
  Order,
  OrderDisplayStatus,
} from "../types/order.types";

function assertValidDeliveryDate(deliveryDate: Date) {
  if (Number.isNaN(deliveryDate.getTime())) {
    throw new Error("La fecha de entrega no es válida.");
  }
}

function isPastDate(value: Timestamp, now = new Date()) {
  const date = value.toDate();
  const deliveryDay = new Date(date);
  const currentDay = new Date(now);

  deliveryDay.setHours(0, 0, 0, 0);
  currentDay.setHours(0, 0, 0, 0);

  return deliveryDay < currentDay;
}

export function getOrderDisplayStatus(
  order: Order,
  now = new Date()
): OrderDisplayStatus {
  if (
    order.status === ORDER_STATUS.PENDIENTE &&
    isPastDate(order.deliveryDate, now)
  ) {
    return "atrasado";
  }

  return order.status;
}

export async function convertQuoteToOrder(
  quote: Quote,
  deliveryDate: Date,
  user: User
) {
  if (quote.status !== "cotizacion") {
    throw new Error(
      "Solo se pueden convertir cotizaciones activas a pedido."
    );
  }

  if (quote.activeOrderId) {
    throw new Error("La cotización ya tiene un pedido activo.");
  }

  assertValidDeliveryDate(deliveryDate);

  return createOrderFromQuoteDocument({
    orderNumber: quote.quoteNumber,
    quoteId: quote.id,
    quoteNumber: quote.quoteNumber,

    clientName: quote.clientName,
    clientPhone: quote.clientPhone,
    clientAddress: quote.clientAddress,

    products: quote.products,

    subtotal: quote.subtotal,
    discountPercent: quote.discountPercent,
    discountAmount: quote.discountAmount,
    total: quote.total,

    advancePayment: quote.advancePayment,
    remainingPayment: quote.remainingPayment,

    searchTokens: quote.searchTokens,
    status: ORDER_STATUS.PENDIENTE,
    deliveryDate: Timestamp.fromDate(deliveryDate),

    createdBy: user.uid,
    createdByEmail: user.email ?? "",
  });
}

export async function getOrders(options: GetOrdersOptions = {}) {
  return getOrderDocuments(options);
}

export async function updateOrderDeliveryDate(
  order: Order,
  deliveryDate: Date
) {
  if (order.status !== ORDER_STATUS.PENDIENTE) {
    throw new Error(
      "Solo se puede editar la fecha de pedidos pendientes."
    );
  }

  assertValidDeliveryDate(deliveryDate);

  return updateOrderDeliveryDateDocument(order.id, deliveryDate);
}

export async function markOrderAsDelivered(
  order: Order,
  user: User
) {
  if (order.status !== ORDER_STATUS.PENDIENTE) {
    throw new Error(
      "Solo se pueden marcar como entregados los pedidos pendientes."
    );
  }

  return markOrderDeliveredDocument(order.id, user.uid);
}

export async function cancelOrder(
  order: Order,
  user: User,
  cancelReason?: string
) {
  if (order.status !== ORDER_STATUS.PENDIENTE) {
    throw new Error(
      "Solo se pueden cancelar pedidos pendientes."
    );
  }

  return cancelOrderDocument(
    order.id,
    order.quoteId,
    user.uid,
    cancelReason
  );
}
