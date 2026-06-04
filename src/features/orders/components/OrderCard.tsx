import type { OrderDisplayStatus } from "../types/order.types";
import type { Order } from "../types/order.types";
import { getOrderDisplayStatus } from "../services/orderService";

type OrderCardProps = {
  order: Order;
  openDetails?: () => void;
};

function formatTimestampDate(value: Order["createdAt"]) {
  if (!value) return "";

  const date = value.toDate();
  const day = date.toLocaleDateString("es-MX", {
    day: "2-digit",
  });
  const month = date.toLocaleDateString("es-MX", {
    month: "long",
  });
  const year = date.toLocaleDateString("es-MX", {
    year: "numeric",
  });

  return `${day}/${month}/${year}`;
}

function OrderStatusBadge({
  status,
}: {
  status: OrderDisplayStatus;
}) {
  const styles = {
    pendiente: {
      label: "Pendiente",
      className: "bg-[#C8EBD4] text-[#2C8B4F]",
    },
    entregado: {
      label: "Recibido",
      className: "bg-[#E2E2E2] text-[#7A7A7A]",
    },
    cancelado: {
      label: "Cancelado",
      className: "bg-[#F0D0D0] text-[#A33D3D]",
    },
    atrasado: {
      label: "Atrasado",
      className: "bg-[#F4D7B8] text-[#A96321]",
    },
  } satisfies Record<
    OrderDisplayStatus,
    { label: string; className: string }
  >;

  return (
    <span
      className={`mt-4 inline-flex min-w-28 items-center justify-center rounded-full px-5 py-1.5 text-sm font-semibold ${styles[status].className}`}
    >
      {styles[status].label}
    </span>
  );
}

export function OrderCard({ order, openDetails }: OrderCardProps) {
  const displayStatus = getOrderDisplayStatus(order);

  return (
    <article
      onClick={openDetails}
      className={`min-h-52 rounded-2xl bg-white p-6 shadow-[0_3px_5px_rgba(22,43,64,0.22)] ${
        openDetails ? "cursor-pointer transition active:scale-[0.99]" : ""
      }`}
    >
      <h3 className="text-2xl font-semibold text-[#162B40]">
        {order.clientName}
      </h3>

      <p className="mt-1 text-lg font-medium text-[#466582]">
        {order.clientPhone}
      </p>

      <p className="mt-1 text-lg font-medium text-[#466582]">
        {order.clientAddress}
      </p>

      <p className="mt-4 text-xs font-semibold text-[#466582]">
        Fecha de pedido
      </p>
      <p className="text-lg font-semibold text-[#162B40]">
        {formatTimestampDate(order.createdAt)}
      </p>

      <p className="mt-3 text-xs font-semibold text-[#466582]">
        Fecha de entrega
      </p>
      <p className="text-lg font-semibold text-[#162B40]">
        {formatTimestampDate(order.deliveryDate)}
      </p>

      <OrderStatusBadge status={displayStatus} />
    </article>
  );
}
