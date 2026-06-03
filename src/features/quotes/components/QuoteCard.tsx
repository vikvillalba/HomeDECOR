import type { Quote } from "../types/quote.types";

type QuoteCardProps = {
  quote: Quote;
};

function formatDate(quote: Quote) {
  if (!quote.createdAt) return "";

  return quote.createdAt.toDate().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-[0_3px_5px_rgba(22,43,64,0.22)]">
      <h3 className="text-2xl font-bold text-[#162B40]">
        {quote.clientName}
      </h3>

      <p className="mt-1 text-lg font-medium text-[#466582]">
        {quote.clientPhone}
      </p>

      <p className="mt-1 text-lg font-medium text-[#466582]">
        {quote.clientAddress}
      </p>

      <p className="mt-1 text-lg font-medium text-[#466582]">
        {formatDate(quote)}
      </p>
    </article>
  );
}