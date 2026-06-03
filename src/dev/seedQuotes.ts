import { addDoc, collection, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { QUOTE_STATUS } from "../features/quotes/repositories/quoteRepository";
import { buildQuoteSearchTokens } from "../features/quotes/utils/buildQuoteSearchTokens";
import { calculateQuoteTotals } from "../features/quotes/utils/calculateQuoteTotals";
import type { CreateQuoteInput } from "../features/quotes/types/quote.types";

const fakeClients = [
  "Dr. Jesús García",
  "María Fernanda López",
  "Carlos Ramírez",
  "Ana Sofía Torres",
  "Luis Hernández",
  "Claudia Mendoza",
  "Jorge Martínez",
  "Valeria Castro",
  "Roberto Sánchez",
  "Diana Gutiérrez",
];

const fakeAddresses = [
  "Calle ejemplo #0000",
  "Av. Principal #123",
  "Privada Los Pinos #45",
  "Blvd. Las Torres #900",
  "Calle Cedros #231",
  "Col. Centro #88",
  "Residencial Montecarlo #12",
  "Calle Río Fuerte #654",
];

const fakeProducts = [
  {
    area: "Comedor",
    productName: "Cortina Ondulada Traslúcida",
    model: "Izam Cream",
    description: "Cortinero blanco a muro con acoplamiento derecho.",
    width: 3.23,
    height: 1.95,
    quantity: 1,
    unitPrice: 8550,
  },
  {
    area: "Recámara Principal",
    productName: "Cortina Ondulada Doble",
    model: "Izam Cream",
    description: "Cortina doble con tela traslúcida y blackout.",
    width: 2.5,
    height: 2.3,
    quantity: 2,
    unitPrice: 7115,
  },
  {
    area: "Centro de TV",
    productName: "Persiana Enrollable",
    model: "Screen 5%",
    description: "Persiana enrollable con instalación incluida.",
    width: 2.1,
    height: 1.7,
    quantity: 1,
    unitPrice: 6250,
  },
  {
    area: "Sala",
    productName: "Cortina Blackout",
    model: "Grey Soft",
    description: "Cortina blackout con riel y accesorios.",
    width: 3.8,
    height: 2.4,
    quantity: 1,
    unitPrice: 9800,
  },
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomDateWithinLastDays(days: number) {
  const date = new Date();
  const randomDaysAgo = Math.floor(Math.random() * days);
  const randomHour = Math.floor(Math.random() * 10) + 8;
  const randomMinute = Math.floor(Math.random() * 60);

  date.setDate(date.getDate() - randomDaysAgo);
  date.setHours(randomHour, randomMinute, 0, 0);

  return date;
}

function createFakeQuoteInput(index: number): CreateQuoteInput {
  const selectedProducts = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => randomItem(fakeProducts)
  );

  return {
    clientName: randomItem(fakeClients),
    clientPhone: `64410${String(10000 + index).slice(-5)}`,
    clientAddress: randomItem(fakeAddresses),
    products: selectedProducts,
    discountPercent: Math.random() > 0.5 ? 10 : 0,
    advancePayment: Math.random() > 0.5 ? 7500 : 0,
  };
}

function getRandomStatus() {
  const statuses = [
    QUOTE_STATUS.COTIZACION,
    QUOTE_STATUS.COTIZACION,
    QUOTE_STATUS.COTIZACION,
    QUOTE_STATUS.CONVERTIDA_A_PEDIDO,
    QUOTE_STATUS.CANCELADA,
  ];

  return randomItem(statuses);
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function buildInputFromStoredQuote(data: Record<string, unknown>): CreateQuoteInput {
  const products = Array.isArray(data.products) ? data.products : [];

  return {
    clientName: asString(data.clientName),
    clientPhone: asString(data.clientPhone),
    clientAddress: asString(data.clientAddress),
    products: products.map((product) => {
      const productData =
        product && typeof product === "object"
          ? (product as Record<string, unknown>)
          : {};

      return {
        area: asString(productData.area),
        productName: asString(productData.productName),
        model: asString(productData.model),
        description: asString(productData.description),
        width: asNumber(productData.width),
        height: asNumber(productData.height),
        quantity: asNumber(productData.quantity),
        unitPrice: asNumber(productData.unitPrice),
      };
    }),
    discountPercent: asNumber(data.discountPercent),
    advancePayment: asNumber(data.advancePayment),
  };
}

export async function backfillQuoteSearchTokens() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Necesitas iniciar sesiÃ³n antes de actualizar datos.");
  }

  const quotesCollection = collection(db, "quotes");
  const snapshot = await getDocs(quotesCollection);
  let updatedCount = 0;

  for (const document of snapshot.docs) {
    const data = document.data();

    if (Array.isArray(data.searchTokens) && data.searchTokens.length > 0) {
      continue;
    }

    await updateDoc(document.ref, {
      searchTokens: buildQuoteSearchTokens(buildInputFromStoredQuote(data)),
    });

    updatedCount += 1;
  }

  return updatedCount;
}

export async function seedFakeQuotes() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Necesitas iniciar sesión antes de crear datos falsos.");
  }

  const quotesCollection = collection(db, "quotes");

  for (let i = 1; i <= 30; i++) {
    const input = createFakeQuoteInput(i);
    const totals = calculateQuoteTotals(input);
    const searchTokens = buildQuoteSearchTokens(input);
    const status = getRandomStatus();
    const createdAt = Timestamp.fromDate(randomDateWithinLastDays(30));

    await addDoc(quotesCollection, {
      quoteNumber: 1000 + i,

      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientAddress: input.clientAddress,

      products: totals.products,

      subtotal: totals.subtotal,
      discountPercent: input.discountPercent,
      discountAmount: totals.discountAmount,
      total: totals.total,

      advancePayment: input.advancePayment,
      remainingPayment: totals.remainingPayment,

      searchTokens,
      status,

      createdBy: user.uid,
      createdByEmail: user.email ?? "",

      createdAt,
      updatedAt: createdAt,

      ...(status === QUOTE_STATUS.CANCELADA
        ? {
            cancelledAt: createdAt,
            cancelledBy: user.uid,
          }
        : {}),
    });
  }
}
