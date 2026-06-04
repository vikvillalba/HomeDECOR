import { X } from "lucide-react";

export type OrderStatusFilter =
  | "received"
  | "pending"
  | "delayed"
  | "all";

type OrderFilterPanelProps = {
  statusFilter: OrderStatusFilter;
  registrationDate: string;
  deliverDate: string;
  onStatusChange: (value: OrderStatusFilter) => void;
  onDateChange: (value: string) => void;
  onClose: () => void;
};

export function OrderFilterPanel({
  statusFilter,
  registrationDate,
  deliverDate,
  onStatusChange,
  onDateChange,
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
              checked={statusFilter === "received"}
              onChange={() => onStatusChange("received")}
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
              checked={statusFilter === "delayed"}
              onChange={() => onStatusChange("delayed")}
            />
            Atrasados
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
          <label className="mb-2 block text-sm font-semibold text-[#466582]">
            Fecha de pedido
          </label>

          <input
            type="date"
            value={registrationDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="w-full rounded-full bg-white px-4 py-2 text-[#162B40] outline-none"
          />
        </div>

         <div>
          <label className="mb-2 block text-sm font-semibold text-[#466582]">
            Fecha de entrega
          </label>

          <input
            type="date"
            value={deliverDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="w-full rounded-full bg-white px-4 py-2 text-[#162B40] outline-none"
          />
        </div>
      </div>
    </div>
  );
}