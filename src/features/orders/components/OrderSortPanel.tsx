import { X } from "lucide-react";

export type OrderSortOrder = "recent" | "oldest";

type OrderSortPanelProps = {
  value: OrderSortOrder;
  onChange: (value: OrderSortOrder) => void;
  onClose: () => void;
};

export function QuoteSortPanel({
  value,
  onChange,
  onClose,
}: OrderSortPanelProps) {
  return (
    <div className="absolute right-0 top-28 z-20 w-64 rounded-3xl bg-[#D9E1EC] p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#162B40]">
          Ordenar por
        </h3>

        <button onClick={onClose} className="text-[#162B40]">
          <X size={25} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
          <input
            type="radio"
            name="sort"
            checked={value === "recent"}
            onChange={() => onChange("recent")}
          />
          Más reciente
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-[#466582]">
          <input
            type="radio"
            name="sort"
            checked={value === "oldest"}
            onChange={() => onChange("oldest")}
          />
          Más antiguo
        </label>
      </div>
    </div>
  );
}