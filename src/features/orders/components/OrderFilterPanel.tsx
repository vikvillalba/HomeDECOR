import { X } from "lucide-react";

export type OrderStatusFilter =
  | "pending"
  | "delivered"
  | "cancelled"
  | "all";

type OrderFilterPanelProps = {
  statusFilter: OrderStatusFilter;
  orderDateFrom: string;
  orderDateTo: string;
  deliveryDateFrom: string;
  deliveryDateTo: string;
  onStatusChange: (value: OrderStatusFilter) => void;
  onOrderDateFromChange: (value: string) => void;
  onOrderDateToChange: (value: string) => void;
  onDeliveryDateFromChange: (value: string) => void;
  onDeliveryDateToChange: (value: string) => void;
  onClose: () => void;
};

export function OrderFilterPanel({
  statusFilter,
  orderDateFrom,
  orderDateTo,
  deliveryDateFrom,
  deliveryDateTo,
  onStatusChange,
  onOrderDateFromChange,
  onOrderDateToChange,
  onDeliveryDateFromChange,
  onDeliveryDateToChange,
  onClose,
}: OrderFilterPanelProps) {
  return (
    <div className="absolute right-0 top-28 z-20 w-72 rounded-3xl bg-[#D9E1EC] p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-[#162B40]">
          Filtrar por
        </h3>

        <button onClick={onClose} className="text-[#162B40]">
          <X size={25} />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
            <input
              type="radio"
              checked={statusFilter === "delivered"}
              onChange={() => onStatusChange("delivered")}
            />
            Recibidos
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
            <input
              type="radio"
              checked={statusFilter === "pending"}
              onChange={() => onStatusChange("pending")}
            />
            Pendientes
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
            <input
              type="radio"
              checked={statusFilter === "cancelled"}
              onChange={() => onStatusChange("cancelled")}
            />
            Cancelados
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
            <input
              type="radio"
              checked={statusFilter === "all"}
              onChange={() => onStatusChange("all")}
            />
            Todos
          </label>
        </div>

        <div>
          <label className="mb-2 block text-lg font-semibold text-[#466582]">
            Fecha de pedido
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <input
              type="date"
              value={orderDateFrom}
              onChange={(event) =>
                onOrderDateFromChange(event.target.value)
              }
              className="min-w-0 rounded-full bg-white px-2 py-1.5 text-xs text-[#162B40] outline-none"
            />

            <span className="text-[#466582]">a</span>

            <input
              type="date"
              value={orderDateTo}
              onChange={(event) =>
                onOrderDateToChange(event.target.value)
              }
              className="min-w-0 rounded-full bg-white px-2 py-1.5 text-xs text-[#162B40] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-lg font-semibold text-[#466582]">
            Fecha de entrega
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <input
              type="date"
              value={deliveryDateFrom}
              onChange={(event) =>
                onDeliveryDateFromChange(event.target.value)
              }
              className="min-w-0 rounded-full bg-white px-2 py-1.5 text-xs text-[#162B40] outline-none"
            />

            <span className="text-[#466582]">a</span>

            <input
              type="date"
              value={deliveryDateTo}
              onChange={(event) =>
                onDeliveryDateToChange(event.target.value)
              }
              className="min-w-0 rounded-full bg-white px-2 py-1.5 text-xs text-[#162B40] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
