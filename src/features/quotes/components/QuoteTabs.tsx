type QuoteTab = "quotes" | "orders";

type QuoteTabsProps = {
  activeTab: QuoteTab;
  onChange: (tab: QuoteTab) => void;
};

export function QuoteTabs({ activeTab, onChange }: QuoteTabsProps) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={() => onChange("quotes")}
        className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
          activeTab === "quotes"
            ? "bg-[#162B40] text-white"
            : "border border-[#466582] bg-white text-[#466582]"
        }`}
      >
        Cotizaciones
      </button>

      <button
        onClick={() => onChange("orders")}
        className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
          activeTab === "orders"
            ? "bg-[#162B40] text-white"
            : "border border-[#466582] bg-white text-[#466582]"
        }`}
      >
        Pedidos
      </button>
    </div>
  );
}