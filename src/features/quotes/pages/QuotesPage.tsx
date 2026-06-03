import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {DocumentSortPanel,type DocumentSortOrder} from "../../documents/components/DocumentSortPanel";
import { DocumentsPage } from "../../documents/pages/DocumentsPage";
import {useDocumentPage,type LoadDocumentPageOptions} from "../../documents/hooks/useDocumentPage";
import { QuoteCard } from "../components/QuoteCard";
import {QuoteFilterPanel,type QuoteStatusFilter,} from "../components/QuoteFilterPanel";
import { getQuotes } from "../services/quoteService";
import type { Quote } from "../types/quote.types";

export function QuotesPage() {
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState<DocumentSortOrder>("recent");
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>("active");
  const [registrationDate, setRegistrationDate] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const loadQuotePage = useCallback(
    async ({
      cursor,
      pageSize,
      searchTerm,
    }: LoadDocumentPageOptions) => {
      const selectedDate = registrationDate
        ? new Date(`${registrationDate}T00:00:00`)
        : null;

      const result = await getQuotes({
        sortOrder,
        statusFilter,
        registrationDate: selectedDate,
        searchTerm,
        pageSize,
        cursor,
      });

      return {
        items: result.quotes,
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
      };
    },
    [registrationDate, sortOrder, statusFilter]
  );

  const {
    items: quotes,
    searchTerm,
    setSearchTerm,
    isLoading,
    errorMsg,
    pageIndex,
    canGoPrevious,
    canGoNext,
    handlePreviousPage,
    handleNextPage,
  } = useDocumentPage<Quote>({
    pageSize: 12,
    errorMessage: "No se pudieron cargar las cotizaciones.",
    loadPage: loadQuotePage,
  });

  return (
    <DocumentsPage
      sectionTitle="Resumen de Cotizaciones"
      tabs={{
        activeTab: "quotes",
        onChange: (tab) => {
          if (tab === "orders") {
            navigate("/orders");
          }
        },
      }}
      search={{
        value: searchTerm,
        onChange: setSearchTerm,
      }}
      toolbar={{
        onOpenSort: () => {
          setIsSortOpen(true);
          setIsFilterOpen(false);
        },
        onOpenFilter: () => {
          setIsFilterOpen(true);
          setIsSortOpen(false);
        },
      }}
      state={{
        isLoading,
        errorMsg,
        emptyMessage: "No hay cotizaciones para mostrar.",
      }}
      pagination={{
        currentPage: pageIndex + 1,
        hasPrevious: canGoPrevious,
        hasNext: canGoNext,
        onPrevious: handlePreviousPage,
        onNext: handleNextPage,
      }}
      items={quotes}
      getItemKey={(quote) => quote.id}
      renderItem={(quote) => <QuoteCard quote={quote} />}
      floatingAction={
        <button
          onClick={() => navigate("/quotes/new")}
          className="absolute bottom-10 right-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#162B40] text-white shadow-[0_4px_8px_rgba(22,43,64,0.45)] transition active:scale-95"
          aria-label="Nueva cotización"
        >
          <Plus size={52} strokeWidth={2.5} />
        </button>
      }
      sortPanel={
        isSortOpen ? (
          <DocumentSortPanel
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value);
              setIsSortOpen(false);
            }}
            onClose={() => setIsSortOpen(false)}
          />
        ) : null
      }
      filterPanel={
        isFilterOpen ? (
          <QuoteFilterPanel
            statusFilter={statusFilter}
            registrationDate={registrationDate}
            onStatusChange={setStatusFilter}
            onDateChange={setRegistrationDate}
            onClose={() => setIsFilterOpen(false)}
          />
        ) : null
      }
    />
  );
}
