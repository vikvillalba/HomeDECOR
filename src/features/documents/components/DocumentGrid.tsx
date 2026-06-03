import type { ReactNode } from "react";

type DocumentGridProps<TItem> = {
  items: TItem[];
  getItemKey: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
};

export function DocumentGrid<TItem>({
  items,
  getItemKey,
  renderItem,
}: DocumentGridProps<TItem>) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-6">
      {items.map((item) => (
        <div key={getItemKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
