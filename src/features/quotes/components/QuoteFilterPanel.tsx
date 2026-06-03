import { X } from "lucide-react";

export type QuoteStatusFilter =
  | "active"
  | "converted"
  | "cancelled"
  | "all";

type QuoteFilterPanelProps = {
  statusFilter: QuoteStatusFilter;
  registrationDate: string;
  onStatusChange: (value: QuoteStatusFilter) => void;
  onDateChange: (value: string) => void;
  onClose: () => void;
};

export function QuoteFilterPanel({
  statusFilter,
  registrationDate,
  onStatusChange,
  onDateChange,
  onClose,
}: QuoteFilterPanelProps) {
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
              checked={statusFilter === "active"}
              onChange={() => onStatusChange("active")}
            />
            Activas
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
            <input
              type="radio"
              checked={statusFilter === "converted"}
              onChange={() => onStatusChange("converted")}
            />
            Convertidas a pedido
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
            <input
              type="radio"
              checked={statusFilter === "cancelled"}
              onChange={() => onStatusChange("cancelled")}
            />
            Canceladas
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
            <input
              type="radio"
              checked={statusFilter === "all"}
              onChange={() => onStatusChange("all")}
            />
            Todas
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#466582]">
            Fecha de registro
          </label>

          <input
            type="date"
            value={registrationDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="w-full rounded-full bg-white px-4 py-2 text-[#162B40] outline-none"
          />
        </div>
      </div>
    </div>
  );
}