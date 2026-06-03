import {Plus} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
// import { seedFakeQuotes } from "../../../dev/seedQuotes";
export function QuotesPage() {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState<QuoteSortOrder>("recent");
  const [statusFilter, setStatusFilter] =
    useState<QuoteStatusFilter>("active");
  const [registrationDate, setRegistrationDate] = useState("");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [pageCursors, setPageCursors] = useState<Array<QueryDocumentSnapshot<DocumentData> | null>>([null]);

  async function loadQuotes(cursor: QueryDocumentSnapshot<DocumentData> | null = null) {
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
        pageSize: 12,
        cursor,
      });

      setQuotes(result.quotes);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error(error);
      setErrorMsg("No se pudieron cargar las cotizaciones.");
    } finally {
      setIsLoading(false);
    }
  }

//   async function handleSeedQuotes() {
//   try {
//     await seedFakeQuotes();
//     alert("Se crearon 30 cotizaciones falsas.");
//     await loadQuotes(null);
//   } catch (error) {
//     console.error(error);
//     alert("No se pudieron crear las cotizaciones falsas.");
//   }
// }

  useEffect(() => {
    setPageIndex(0);
    setPageCursors([null]);
    void loadQuotes(null);
  }, [sortOrder, statusFilter, registrationDate]);

  const filteredQuotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return quotes;

    return quotes.filter((quote) => {
      return (
        quote.clientName.toLowerCase().includes(normalizedSearch) ||
        quote.clientPhone.toLowerCase().includes(normalizedSearch) ||
        quote.clientAddress.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [quotes, searchTerm]);

  async function handleNextPage() {
    if (!hasMore || !nextCursor) return;

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
    if (pageIndex === 0) return;

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
          {/* <button
            onClick={handleSeedQuotes}
            className="mt-3 rounded-full bg-[#162B40] px-4 py-2 text-sm font-semibold text-white"
            >
            Crear 30 cotizaciones falsas
          </button> */}

          

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

          {!isLoading && filteredQuotes.length === 0 && (
            <p className="mt-4 text-sm text-[#466582]">
              No hay cotizaciones para mostrar.
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-6">
            {filteredQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        </section>

        <QuotesPagination
          currentPage={pageIndex + 1}
          hasPrevious={pageIndex > 0}
          hasNext={hasMore}
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