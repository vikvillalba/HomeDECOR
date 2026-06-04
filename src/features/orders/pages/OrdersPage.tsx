import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentSortPanel, type DocumentSortOrder } from "../../documents/components/DocumentSortPanel";
import { useDocumentPage, type LoadDocumentPageOptions } from "../../documents/hooks/useDocumentPage";
import { DocumentsPage } from "../../documents/pages/DocumentsPage";
import { OrderCard } from "../components/OrderCard";
import { OrderFilterPanel, type OrderStatusFilter } from "../components/OrderFilterPanel";
import { getOrders } from "../services/orderService";
import type { Order } from "../types/order.types";

function parseDateInput(value: string) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

export function OrdersPage() {
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState<DocumentSortOrder>("recent");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("pending");
  const [orderDateFrom, setOrderDateFrom] = useState("");
  const [orderDateTo, setOrderDateTo] = useState("");
  const [deliveryDateFrom, setDeliveryDateFrom] = useState("");
  const [deliveryDateTo, setDeliveryDateTo] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const loadOrderPage = useCallback(
    async ({
      cursor,
      pageSize,
      searchTerm,
    }: LoadDocumentPageOptions) => {
      const result = await getOrders({
        sortOrder,
        statusFilter,
        orderDateFrom: parseDateInput(orderDateFrom),
        orderDateTo: parseDateInput(orderDateTo),
        deliveryDateFrom: parseDateInput(deliveryDateFrom),
        deliveryDateTo: parseDateInput(deliveryDateTo),
        searchTerm,
        pageSize,
        cursor,
      });

      return {
        items: result.orders,
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
      };
    },
    [
      deliveryDateFrom,
      deliveryDateTo,
      orderDateFrom,
      orderDateTo,
      sortOrder,
      statusFilter,
    ]
  );

  const {
    items: orders,
    searchTerm,
    setSearchTerm,
    isLoading,
    errorMsg,
    pageIndex,
    canGoPrevious,
    canGoNext,
    handlePreviousPage,
    handleNextPage,
  } = useDocumentPage<Order>({
    pageSize: 6,
    errorMessage: "No se pudieron cargar los pedidos.",
    loadPage: loadOrderPage,
  });

  return (
    <DocumentsPage
      sectionTitle="Resumen de Pedidos"
      tabs={{
        activeTab: "orders",
        onChange: (tab) => {
          if (tab === "quotes") {
            navigate("/quotes");
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
        emptyMessage: "No hay pedidos para mostrar.",
      }}
      pagination={{
        currentPage: pageIndex + 1,
        hasPrevious: canGoPrevious,
        hasNext: canGoNext,
        onPrevious: handlePreviousPage,
        onNext: handleNextPage,
      }}
      items={orders}
      getItemKey={(order) => order.id}
      renderItem={(order) => <OrderCard order={order} />}
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
          <OrderFilterPanel
            statusFilter={statusFilter}
            orderDateFrom={orderDateFrom}
            orderDateTo={orderDateTo}
            deliveryDateFrom={deliveryDateFrom}
            deliveryDateTo={deliveryDateTo}
            onStatusChange={setStatusFilter}
            onOrderDateFromChange={setOrderDateFrom}
            onOrderDateToChange={setOrderDateTo}
            onDeliveryDateFromChange={setDeliveryDateFrom}
            onDeliveryDateToChange={setDeliveryDateTo}
            onClose={() => setIsFilterOpen(false)}
          />
        ) : null
      }
    />
  );
}
