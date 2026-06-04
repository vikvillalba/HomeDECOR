import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "../../../config/firebase";
import { QUOTE_STATUS } from "../../quotes/repositories/quoteRepository";
import { normalizeSearchText } from "../../quotes/utils/buildQuoteSearchTokens";
import type { CreateOrderDocument, Order } from "../types/order.types";

const ordersCollection = collection(db, "orders");
const quotesCollection = collection(db, "quotes");

export const ORDER_STATUS = {
  PENDIENTE: "pendiente",
  ENTREGADO: "entregado",
  CANCELADO: "cancelado",
} as const;

export type OrderSortOrder = "recent" | "oldest";

export type OrderStatusFilter =
  | "pending"
  | "delivered"
  | "cancelled"
  | "all";

export type GetOrdersOptions = {
  sortOrder?: OrderSortOrder;
  statusFilter?: OrderStatusFilter;
  orderDateFrom?: Date | null;
  orderDateTo?: Date | null;
  deliveryDateFrom?: Date | null;
  deliveryDateTo?: Date | null;
  searchTerm?: string;
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
};

export type GetOrdersResult = {
  orders: Order[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
};

function getStartOfDay(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return startOfDay;
}

function getEndOfDay(date: Date) {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return endOfDay;
}

function addDateRangeConstraints(
  constraints: QueryConstraint[],
  field: "createdAt" | "deliveryDate",
  fromDate?: Date | null,
  toDate?: Date | null
) {
  if (fromDate) {
    constraints.push(
      where(field, ">=", Timestamp.fromDate(getStartOfDay(fromDate)))
    );
  }

  if (toDate) {
    constraints.push(
      where(field, "<=", Timestamp.fromDate(getEndOfDay(toDate)))
    );
  }
}

export async function createOrderFromQuoteDocument(
  orderData: CreateOrderDocument
) {
  const batch = writeBatch(db);
  const orderRef = doc(ordersCollection, orderData.quoteId);
  const quoteRef = doc(quotesCollection, orderData.quoteId);

  batch.set(orderRef, {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.update(quoteRef, {
    status: QUOTE_STATUS.CONVERTIDA_A_PEDIDO,
    activeOrderId: orderRef.id,
    convertedAt: serverTimestamp(),
    convertedBy: orderData.createdBy,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return orderRef.id;
}

export async function getOrderDocuments(
  options: GetOrdersOptions = {}
): Promise<GetOrdersResult> {
  const {
    sortOrder = "recent",
    statusFilter = "pending",
    orderDateFrom = null,
    orderDateTo = null,
    deliveryDateFrom = null,
    deliveryDateTo = null,
    searchTerm = "",
    pageSize = 12,
    cursor = null,
  } = options;

  const constraints: QueryConstraint[] = [];

  switch (statusFilter) {
    case "pending":
      constraints.push(
        where("status", "==", ORDER_STATUS.PENDIENTE)
      );
      break;

    case "delivered":
      constraints.push(
        where("status", "==", ORDER_STATUS.ENTREGADO)
      );
      break;

    case "cancelled":
      constraints.push(
        where("status", "==", ORDER_STATUS.CANCELADO)
      );
      break;

    case "all":
    default:
      break;
  }

  const normalizedSearchTerm = normalizeSearchText(searchTerm);

  if (normalizedSearchTerm.length >= 2) {
    constraints.push(
      where(
        "searchTokens",
        "array-contains",
        normalizedSearchTerm
      )
    );
  }

  addDateRangeConstraints(
    constraints,
    "createdAt",
    orderDateFrom,
    orderDateTo
  );

  addDateRangeConstraints(
    constraints,
    "deliveryDate",
    deliveryDateFrom,
    deliveryDateTo
  );

  constraints.push(
    orderBy(
      "createdAt",
      sortOrder === "recent" ? "desc" : "asc"
    )
  );

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize + 1));

  const ordersQuery = query(ordersCollection, ...constraints);
  const snapshot = await getDocs(ordersQuery);
  const hasMore = snapshot.docs.length > pageSize;
  const docs = hasMore
    ? snapshot.docs.slice(0, pageSize)
    : snapshot.docs;

  const orders = docs.map((document) => {
    const data = document.data() as Omit<Order, "id">;

    return {
      id: document.id,
      ...data,
    };
  });

  const nextCursor =
    docs.length > 0 ? docs[docs.length - 1] : null;

  return {
    orders,
    nextCursor,
    hasMore,
  };
}

export async function updateOrderDeliveryDateDocument(
  orderId: string,
  deliveryDate: Date
) {
  const orderRef = doc(ordersCollection, orderId);

  await updateDoc(orderRef, {
    deliveryDate: Timestamp.fromDate(deliveryDate),
    updatedAt: serverTimestamp(),
  });
}

export async function markOrderDeliveredDocument(
  orderId: string,
  userId: string
) {
  const orderRef = doc(ordersCollection, orderId);

  await updateDoc(orderRef, {
    status: ORDER_STATUS.ENTREGADO,
    deliveredAt: serverTimestamp(),
    deliveredBy: userId,
    updatedAt: serverTimestamp(),
  });
}

export async function cancelOrderDocument(
  orderId: string,
  quoteId: string,
  userId: string,
  cancelReason?: string
) {
  const batch = writeBatch(db);
  const orderRef = doc(ordersCollection, orderId);
  const quoteRef = doc(quotesCollection, quoteId);

  batch.update(orderRef, {
    status: ORDER_STATUS.CANCELADO,
    cancelledAt: serverTimestamp(),
    cancelledBy: userId,
    cancelReason: cancelReason?.trim() || null,
    updatedAt: serverTimestamp(),
  });

  batch.update(quoteRef, {
    status: QUOTE_STATUS.COTIZACION,
    activeOrderId: null,
    convertedAt: null,
    convertedBy: null,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}
