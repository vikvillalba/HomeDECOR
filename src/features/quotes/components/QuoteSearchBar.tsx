import { Search } from "lucide-react";

type QuoteSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function QuoteSearchBar({ value, onChange }: QuoteSearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#162B40]"
      />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar..."
        className="w-full rounded-full border border-[#c7d0da] bg-white py-2 pl-10 pr-4 text-sm text-[#162B40] shadow-sm outline-none placeholder:italic placeholder:text-[#b4bdc8] focus:ring-2 focus:ring-[#162B40]"
      />
    </div>
  );
}