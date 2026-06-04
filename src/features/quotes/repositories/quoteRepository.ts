import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "../../../config/firebase";
import type {
  CreateQuoteDocument,
  Quote,
} from "../types/quote.types";
import { normalizeSearchText } from "../utils/buildQuoteSearchTokens";

const quotesCollection = collection(db, "quotes");

export const QUOTE_STATUS = {
  COTIZACION: "cotizacion",
  CONVERTIDA_A_PEDIDO: "convertida_a_pedido",
  CANCELADA: "cancelada",
} as const;

export type QuoteSortOrder = "recent" | "oldest";

export type QuoteStatusFilter =
  | "active"
  | "converted"
  | "cancelled"
  | "all";

export type GetQuotesOptions = {
  sortOrder?: QuoteSortOrder;
  statusFilter?: QuoteStatusFilter;
  registrationDate?: Date | null;
  searchTerm?: string;
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
};

export type GetQuotesResult = {
  quotes: Quote[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
};

export type UpdateQuoteDocument = Partial<
  Omit<
    CreateQuoteDocument,
    "quoteNumber" | "status" | "createdBy" | "createdByEmail"
  >
>;

async function getQuoteOrThrow(quoteId: string) {
  const quoteRef = doc(quotesCollection, quoteId);
  const snapshot = await getDoc(quoteRef);

  if (!snapshot.exists()) {
    throw new Error("La cotización no existe.");
  }

  return {
    quoteRef,
    quote: snapshot.data() as Quote,
  };
}

export async function createQuoteDocument(
  quoteData: CreateQuoteDocument
) {
  const docRef = await addDoc(quotesCollection, {
    ...quoteData,
    status: QUOTE_STATUS.COTIZACION,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getQuoteDocuments(
  options: GetQuotesOptions = {}
): Promise<GetQuotesResult> {
  const {
    sortOrder = "recent",
    statusFilter = "active",
    registrationDate = null,
    searchTerm = "",
    pageSize = 12,
    cursor = null,
  } = options;

  const constraints: QueryConstraint[] = [];

  switch (statusFilter) {
    case "active":
      constraints.push(
        where("status", "==", QUOTE_STATUS.COTIZACION)
      );
      break;

    case "converted":
      constraints.push(
        where(
          "status",
          "==",
          QUOTE_STATUS.CONVERTIDA_A_PEDIDO
        )
      );
      break;

    case "cancelled":
      constraints.push(
        where("status", "==", QUOTE_STATUS.CANCELADA)
      );
      break;

    case "all":
    default:
      break;
  }

  const normalizedSearchTerm = normalizeSearchText(searchTerm);

  if (normalizedSearchTerm.length >= 2) {
    // Las cotizaciones anteriores a searchTokens no aparecerán en búsquedas; recrea los datos falsos o haz un backfill manual.
    constraints.push(
      where(
        "searchTokens",
        "array-contains",
        normalizedSearchTerm
      )
    );
  }

  if (registrationDate) {
    const startOfDay = new Date(registrationDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(registrationDate);
    endOfDay.setHours(23, 59, 59, 999);

    constraints.push(
      where(
        "createdAt",
        ">=",
        Timestamp.fromDate(startOfDay)
      ),
      where(
        "createdAt",
        "<=",
        Timestamp.fromDate(endOfDay)
      )
    );
  }

  constraints.push(
    orderBy(
      "createdAt",
      sortOrder === "recent" ? "desc" : "asc"
    )
  );

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  // Pedimos un registro extra para determinar correctamente si hay más páginas
  constraints.push(limit(pageSize + 1));

  const quotesQuery = query(
    quotesCollection,
    ...constraints
  );

  const snapshot = await getDocs(quotesQuery);

  const hasMore = snapshot.docs.length > pageSize;

  const docs = hasMore
    ? snapshot.docs.slice(0, pageSize)
    : snapshot.docs;

  const quotes = docs.map((document) => {
    const data = document.data() as Omit<Quote, "id">;

    return {
      id: document.id,
      ...data,
    };
  });

  const nextCursor =
    docs.length > 0
      ? docs[docs.length - 1]
      : null;

  return {
    quotes,
    nextCursor,
    hasMore,
  };
}

export async function updateQuoteDocument(
  quoteId: string,
  quoteData: UpdateQuoteDocument
) {
  const { quoteRef, quote } = await getQuoteOrThrow(quoteId);

  if (quote.status !== QUOTE_STATUS.COTIZACION) {
    throw new Error(
      "Solo se pueden editar cotizaciones en estado cotización."
    );
  }

  await updateDoc(quoteRef, {
    ...quoteData,
    updatedAt: serverTimestamp(),
  });
}

export async function cancelQuoteDocument(
  quoteId: string,
  userId: string
) {
  const { quoteRef, quote } = await getQuoteOrThrow(quoteId);

  if (quote.status !== QUOTE_STATUS.COTIZACION) {
    throw new Error(
      "Solo se pueden cancelar cotizaciones en estado cotización."
    );
  }

  await updateDoc(quoteRef, {
    status: QUOTE_STATUS.CANCELADA,
    cancelledAt: serverTimestamp(),
    cancelledBy: userId,
    updatedAt: serverTimestamp(),
  });
}

export async function reactivateQuoteDocument(
  quoteId: string,
  userId: string,
  reactivationReason?: string
) {
  const { quoteRef, quote } = await getQuoteOrThrow(quoteId);

  if (quote.status !== QUOTE_STATUS.CANCELADA) {
    throw new Error(
      "Solo se pueden reactivar cotizaciones canceladas."
    );
  }

  if (quote.activeOrderId) {
    throw new Error(
      "No se puede reactivar una cotización con pedido activo."
    );
  }

  await updateDoc(quoteRef, {
    status: QUOTE_STATUS.COTIZACION,
    activeOrderId: null,
    reactivatedAt: serverTimestamp(),
    reactivatedBy: userId,
    reactivationReason: reactivationReason?.trim() || null,
    updatedAt: serverTimestamp(),
  });
}

export async function getQuoteDocumentById(
  quoteId: string
): Promise<Quote | null> {
  try {
    const { quote, quoteRef } = await getQuoteOrThrow(quoteId);

    return {
      ...quote,
      id: quoteRef.id,
    } as Quote;
  } catch {
    return null;
  }
}
