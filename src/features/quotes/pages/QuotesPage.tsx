import {Plus} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {DocumentData, QueryDocumentSnapshot} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getQuotes } from "../services/quoteService";
import type { Quote } from "../types/quote.types";
import { QuoteCard } from "../components/QuoteCard";
import { QuoteSearchBar } from "../components/QuoteSearchBar";
import { QuoteTabs } from "../components/QuoteTabs";
import { QuotesToolbar } from "../components/QuotesToolbar";
import {QuoteSortPanel,type QuoteSortOrder} from "../components/QuoteSortPanel";
import {QuoteFilterPanel, type QuoteStatusFilter} from "../components/QuoteFilterPanel";
import { QuotesPagination } from "../components/QuotesPagination";
export function QuotesPage() {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState<QuoteSortOrder>("recent");
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>("active");
  const [registrationDate, setRegistrationDate] = useState("");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [pageCursors, setPageCursors] = useState<Array<QueryDocumentSnapshot<DocumentData> | null>>([null]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadQuotes = useCallback( async (cursor: QueryDocumentSnapshot<DocumentData> | null = null) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const selectedDate = registrationDate
        ? new Date(`${registrationDate}T00:00:00`)
        : null;

      const result = await getQuotes({
        sortOrder,
        statusFilter,
        registrationDate: selectedDate,
        searchTerm: debouncedSearchTerm,
        pageSize: 12,
        cursor,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setQuotes(result.quotes);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error(error);
      setErrorMsg("No se pudieron cargar las cotizaciones.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  },
  [debouncedSearchTerm, registrationDate, sortOrder, statusFilter]
);

 useEffect(() => {
  setPageIndex(0);
  setPageCursors([null]);
  void loadQuotes(null);
}, [loadQuotes]);

  async function handleNextPage() {
    if (isLoading || !hasMore || !nextCursor) return;

    const nextPageIndex = pageIndex + 1;

    setPageCursors((current) => {
        const copy = [...current];
        copy[nextPageIndex] = nextCursor;
        return copy;
    });

    setPageIndex(nextPageIndex);
    await loadQuotes(nextCursor);
  }

  async function handlePreviousPage() {
    if (isLoading || pageIndex === 0) return;

    const previousPageIndex = pageIndex - 1;
    const previousCursor = pageCursors[previousPageIndex] ?? null;

    setPageIndex(previousPageIndex);
    await loadQuotes(previousCursor);
  }

  return (
    <main className="min-h-dvh bg-[#EEF0F3]">
      <section className="relative mx-auto min-h-dvh w-full max-w-[834px] bg-[#EEF0F3] px-10 py-10">
        <header>
          <h1 className="text-4xl font-light tracking-wide text-[#162B40]">
            HOME <span className="font-bold">DECOR</span>
          </h1>

          <div className="mt-4">
            <QuoteSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <QuoteTabs
              activeTab="quotes"
              onChange={(tab) => {
                if (tab === "orders") {
                  navigate("/orders");
                }
              }}
            />

            <QuotesToolbar
              onOpenSort={() => {
                setIsSortOpen(true);
                setIsFilterOpen(false);
              }}
              onOpenFilter={() => {
                setIsFilterOpen(true);
                setIsSortOpen(false);
              }}
            />
          </div>
        </header>

        <section className="mt-5">
          <h2 className="text-xl font-semibold text-[#162B40]">
            Resumen de Cotizaciones
          </h2>


          {errorMsg && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMsg}
            </p>
          )}

          {!isLoading && quotes.length === 0 && (
            <p className="mt-4 text-sm text-[#466582]">
              No hay cotizaciones para mostrar.
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-6">
            {quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        </section>

        <QuotesPagination
          currentPage={pageIndex + 1}
          hasPrevious={!isLoading && pageIndex > 0}
          hasNext={!isLoading && hasMore}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />

        <button
          onClick={() => navigate("/quotes/new")}
          className="absolute bottom-10 right-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#162B40] text-white shadow-[0_4px_8px_rgba(22,43,64,0.45)] transition active:scale-95"
          aria-label="Nueva cotización"
        >
          <Plus size={52} strokeWidth={2.5} />
        </button>

        {isSortOpen && (
          <QuoteSortPanel
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value);
              setIsSortOpen(false);
            }}
            onClose={() => setIsSortOpen(false)}
          />
        )}

        {isFilterOpen && (
          <QuoteFilterPanel
            statusFilter={statusFilter}
            registrationDate={registrationDate}
            onStatusChange={setStatusFilter}
            onDateChange={setRegistrationDate}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </section>
    </main>
  );
}
