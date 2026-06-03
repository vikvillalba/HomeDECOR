import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { QUOTE_STATUS } from "../features/quotes/repositories/quoteRepository";
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

export async function seedFakeQuotes() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Necesitas iniciar sesión antes de crear datos falsos.");
  }

  const quotesCollection = collection(db, "quotes");

  for (let i = 1; i <= 30; i++) {
    const input = createFakeQuoteInput(i);
    const totals = calculateQuoteTotals(input);
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