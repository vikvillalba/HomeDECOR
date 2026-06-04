import type { Quote } from "../types/quote.types";

type QuoteCardProps = {
  quote: Quote;
  openDetails : () => void
};

function formatDate(quote: Quote) {
  if (!quote.createdAt) return "";

  return quote.createdAt.toDate().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function QuoteCard({ quote , openDetails}: QuoteCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-[0_3px_5px_rgba(22,43,64,0.22)] h-50 " onClick={openDetails}>
      <h3 className="text-xl font-medium text-[#162B40]">
        {quote.clientName}
      </h3>

      <p className="mt-1 text-lg font-normal text-[#466582]">
        {quote.clientPhone}
      </p>

      <p className="mt-1 text-lg font-normal text-[#466582]">
        {quote.clientAddress}
      </p>

      <p className="mt-1 text-lg font-normal text-[#466582]">
        {formatDate(quote)}
      </p>
    </article>
  );
}