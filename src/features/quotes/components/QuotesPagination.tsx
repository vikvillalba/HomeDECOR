import { ChevronLeft, ChevronRight } from "lucide-react";

type QuotesPaginationProps = {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function QuotesPagination({
  currentPage,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: QuotesPaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-5">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="text-[#9aa8b8] disabled:opacity-40"
      >
        <ChevronLeft size={25} />
      </button>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#466582] text-lg font-bold text-white">
        {currentPage}
      </span>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="text-[#466582] disabled:opacity-40"
      >
        <ChevronRight size={25} />
      </button>
    </div>
  );
}