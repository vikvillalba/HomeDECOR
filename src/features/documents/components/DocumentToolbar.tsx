import { ArrowDownUp, Funnel } from "lucide-react";

type DocumentToolbarProps = {
  onOpenSort: () => void;
  onOpenFilter: () => void;
};

export function DocumentToolbar({
  onOpenSort,
  onOpenFilter,
}: DocumentToolbarProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onOpenSort}
        className="text-[#466582] transition hover:opacity-80"
        aria-label="Ordenar documentos"
      >
        <ArrowDownUp size={31} strokeWidth={2.8} />
      </button>

      <button
        type="button"
        onClick={onOpenFilter}
        className="text-[#466582] transition hover:opacity-80"
        aria-label="Filtrar documentos"
      >
        <Funnel size={33} strokeWidth={2.5} />
      </button>
    </div>
  );
}
