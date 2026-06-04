import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { convertQuoteToOrder } from "../../orders/services/orderService";
import type { Quote } from "../types/quote.types";
import { QuoteProductCard } from "../components/QuoteProductCard";
import {
  getQuoteById,
  reactivateQuote,
} from "../services/quoteService";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 2,
});

function formatDate(quote: Quote) {
  if (!quote.createdAt) return "";

  return quote.createdAt.toDate().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return `$${currencyFormatter.format(value)}`;
}

function getTodayDateInputValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

export function QuoteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderErrorMsg, setOrderErrorMsg] = useState("");
  const [isReactivateFormOpen, setIsReactivateFormOpen] = useState(false);
  const [reactivationReason, setReactivationReason] = useState("");
  const [isReactivating, setIsReactivating] = useState(false);
  const [reactivationErrorMsg, setReactivationErrorMsg] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      try {
        setIsLoading(true);

        if (id) {
          const data = await getQuoteById(id);
          setQuote(data);
        }
      } catch (error) {
        console.error("Error al cargar la cotización", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchQuote();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-[#162B40]">
        Cargando detalles...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-10 text-center text-red-500">
        Cotización no encontrada.
      </div>
    );
  }

  const canRequestOrder = quote.status === "cotizacion";
  const canReactivateQuote = quote.status === "cancelada";
  const minDeliveryDate = getTodayDateInputValue();

  async function handleCreateOrder() {
    if (!quote) return;

    if (!user) {
      setOrderErrorMsg("Necesitas iniciar sesión para crear un pedido.");
      return;
    }

    if (!deliveryDate) {
      setOrderErrorMsg("Selecciona una fecha de entrega.");
      return;
    }

    if (deliveryDate < minDeliveryDate) {
      setOrderErrorMsg("La fecha de entrega no puede ser anterior a hoy.");
      return;
    }

    try {
      setIsSubmittingOrder(true);
      setOrderErrorMsg("");

      await convertQuoteToOrder(
        quote,
        new Date(`${deliveryDate}T00:00:00`),
        user
      );

      navigate("/orders");
    } catch (error) {
      console.error(error);
      setOrderErrorMsg("No se pudo crear el pedido.");
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  async function handleReactivateQuote() {
    if (!quote) return;

    if (!user) {
      setReactivationErrorMsg(
        "Necesitas iniciar sesión para reactivar la cotización."
      );
      return;
    }

    try {
      setIsReactivating(true);
      setReactivationErrorMsg("");

      await reactivateQuote(
        quote.id,
        user,
        reactivationReason
      );

      setQuote({
        ...quote,
        status: "cotizacion",
        activeOrderId: null,
        reactivationReason:
          reactivationReason.trim() || null,
      });
      setIsReactivateFormOpen(false);
      setReactivationReason("");
    } catch (error) {
      console.error(error);
      setReactivationErrorMsg(
        "No se pudo reactivar la cotización."
      );
    } finally {
      setIsReactivating(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#EEF0F3]">
      <section className="relative mx-auto w-full max-w-[834px] bg-[#EEF0F3] px-10 pt-10">
        <header>
          <h1 className="text-4xl font-light tracking-wide text-[#162B40]">
            HOME <span className="font-bold">DECOR</span>
          </h1>
        </header>

        <div className="mt-5 flex items-center justify-between pb-4">
          <button
            onClick={() => navigate("/quotes")}
            className="flex items-center gap-1 text-[#162B40] transition hover:text-[#162B40]"
          >
            <ChevronLeft size={25} />
          </button>

          <p className="text-xl font-medium text-[#162B40]">
            Detalles de la Cotización
          </p>

          <div className="flex gap-3">
            <button className="rounded-full bg-[#405F7E] p-3 text-[#FFFFFF] shadow-sm hover:bg-[#162B40]">
              <Download size={20} />
            </button>

            <button
              disabled={!canRequestOrder}
              className="rounded-full bg-[#405F7E] p-3 text-[#FFFFFF] shadow-sm hover:bg-[#162B40] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pencil size={20} />
            </button>

            <button
              disabled={!canRequestOrder}
              className="rounded-full bg-[#405F7E] p-3 text-[#FFFFFF] shadow-sm hover:bg-[#162B40] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <article className="mt-3 rounded-2xl bg-[#162B40] p-4 shadow-sm">
          <h3 className="text-center text-2xl font-medium text-[#FFFFFF]">
            {quote.clientName}
          </h3>
          <p className="mt-1 text-center font-normal text-[#FFFFFF]">
            {quote.clientPhone}
          </p>
          <p className="mt-1 text-center text-[#FFFFFF]">
            {quote.clientAddress}
          </p>
          <p className="text-center font-normal text-[#FFFFFF]">
            {formatDate(quote)}
          </p>
        </article>

        <div className="mt-4 flex flex-col gap-3">
          {quote.products && quote.products.length > 0 ? (
            quote.products.map((product, index) => (
              <QuoteProductCard key={index} product={product} />
            ))
          ) : (
            <p className="italic text-[#466582]">
              Esta cotización no tiene productos agregados.
            </p>
          )}
        </div>

        <div className="mt-3 flex w-full flex-col items-center p-4">
          <div className="flex w-full max-w-sm flex-col gap-3 text-[23px] text-[#162B40]">
            <div className="flex w-full items-center">
              <span className="w-1/2 pr-4 text-right font-medium">
                Subtotal
              </span>
              <span className="w-1/2 pl-4 text-left font-bold italic">
                {formatCurrency(quote.subtotal)}
              </span>
            </div>

            <div className="flex w-full items-center">
              <span className="w-1/2 pr-4 text-right font-medium">
                Descuento
              </span>
              <span className="w-1/2 pl-4 text-left font-bold">
                {quote.discountPercent}%
              </span>
            </div>

            <div className="flex w-full items-center rounded-2xl bg-[#D8DEE7] py-2.5 text-[24px] font-bold">
              <span className="w-1/2 pr-4 text-right">
                Total
              </span>
              <span className="w-1/2 pl-4 text-left text-[#0F963C]">
                {formatCurrency(quote.total)}
              </span>
            </div>

            <div className="flex w-full items-center">
              <span className="w-1/2 pr-4 text-right font-medium">
                Anticipo
              </span>
              <span className="w-1/2 pl-4 text-left font-bold">
                {formatCurrency(quote.advancePayment)}
              </span>
            </div>

            <div className="flex w-full items-center">
              <span className="w-1/2 pr-4 text-right font-medium">
                Resto
              </span>
              <span className="w-1/2 pl-4 text-left font-bold">
                {formatCurrency(quote.remainingPayment)}
              </span>
            </div>
          </div>

          {orderErrorMsg && (
            <p className="mt-5 w-full rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
              {orderErrorMsg}
            </p>
          )}

          {reactivationErrorMsg && (
            <p className="mt-5 w-full rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
              {reactivationErrorMsg}
            </p>
          )}

          {canRequestOrder ? (
            <button
              onClick={() => setIsOrderFormOpen(true)}
              disabled={isSubmittingOrder}
              className="mt-7 w-full rounded-full bg-[#162B40] p-4 text-[20px] font-normal text-white shadow-sm transition-colors hover:bg-[#203d5b] disabled:opacity-50"
            >
              Pedir Cotización
            </button>
          ) : (
            <>
              <p className="mt-7 w-full rounded-full bg-[#D8DEE7] p-4 text-center text-[18px] font-medium text-[#466582]">
                Esta cotización ya no se puede convertir a pedido.
              </p>

              {canReactivateQuote && (
                <button
                  onClick={() => setIsReactivateFormOpen(true)}
                  disabled={isReactivating}
                  className="mt-4 w-full rounded-full bg-[#466582] p-4 text-[20px] font-normal text-white shadow-sm transition-colors hover:bg-[#203d5b] disabled:opacity-50"
                >
                  Reactivar cotización
                </button>
              )}
            </>
          )}
        </div>

        {isOrderFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
            <div className="w-full max-w-md rounded-3xl bg-[#D9E1EC] p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-[#162B40]">
                Crear pedido
              </h2>

              <label className="mt-5 mb-2 block text-lg font-semibold text-[#162B40]">
                Fecha de entrega
              </label>

              <input
                type="date"
                min={minDeliveryDate}
                value={deliveryDate}
                onChange={(event) => {
                  setDeliveryDate(event.target.value);
                  setOrderErrorMsg("");
                }}
                className="w-full rounded-full bg-white px-4 py-3 text-[#162B40] outline-none"
              />

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    setIsOrderFormOpen(false);
                    setOrderErrorMsg("");
                  }}
                  disabled={isSubmittingOrder}
                  className="w-full rounded-full bg-white px-4 py-3 text-[18px] font-medium text-[#466582] disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleCreateOrder}
                  disabled={isSubmittingOrder}
                  className="w-full rounded-full bg-[#162B40] px-4 py-3 text-[18px] font-medium text-white shadow-sm transition-colors hover:bg-[#203d5b] disabled:opacity-50"
                >
                  {isSubmittingOrder ? "Guardando..." : "Guardar pedido"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isReactivateFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-8">
            <div className="w-full max-w-md rounded-3xl bg-[#D9E1EC] p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-[#162B40]">
                Reactivar cotización
              </h2>

              <label className="mt-5 mb-2 block text-lg font-semibold text-[#162B40]">
                Razón opcional
              </label>

              <textarea
                value={reactivationReason}
                onChange={(event) => {
                  setReactivationReason(event.target.value);
                  setReactivationErrorMsg("");
                }}
                placeholder="Ej. El cliente retomó la cotización"
                className="min-h-28 w-full resize-none rounded-2xl bg-white px-4 py-3 text-[#162B40] outline-none"
              />

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    setIsReactivateFormOpen(false);
                    setReactivationErrorMsg("");
                  }}
                  disabled={isReactivating}
                  className="w-full rounded-full bg-white px-4 py-3 text-[18px] font-medium text-[#466582] disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleReactivateQuote}
                  disabled={isReactivating}
                  className="w-full rounded-full bg-[#162B40] px-4 py-3 text-[18px] font-medium text-white shadow-sm transition-colors hover:bg-[#203d5b] disabled:opacity-50"
                >
                  {isReactivating
                    ? "Reactivando..."
                    : "Reactivar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
