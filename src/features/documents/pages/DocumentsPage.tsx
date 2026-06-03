import type { ReactNode } from "react";
import { DocumentGrid } from "../components/DocumentGrid";
import { DocumentGridSkeleton } from "../components/DocumentGridSkeleton";
import { DocumentPagination } from "../components/DocumentPagination";
import {
  DocumentTabs,
  type DocumentTab,
} from "../components/DocumentTabs";
import { DocumentSearchBar } from "../components/DocumentSearchBar";
import { DocumentToolbar } from "../components/DocumentToolbar";

type DocumentsPageProps<TItem> = {
  sectionTitle: string;
  tabs: {
    activeTab: DocumentTab;
    onChange: (tab: DocumentTab) => void;
  };
  search: {
    value: string;
    onChange: (value: string) => void;
  };
  toolbar: {
    onOpenSort: () => void;
    onOpenFilter: () => void;
  };
  state: {
    isLoading: boolean;
    errorMsg: string;
    emptyMessage: string;
  };
  pagination: {
    currentPage: number;
    hasPrevious: boolean;
    hasNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
  };
  items: TItem[];
  getItemKey: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
  floatingAction?: ReactNode;
  sortPanel?: ReactNode;
  filterPanel?: ReactNode;
};

export function DocumentsPage<TItem>({
  sectionTitle,
  tabs,
  search,
  toolbar,
  state,
  pagination,
  items,
  getItemKey,
  renderItem,
  floatingAction,
  sortPanel,
  filterPanel,
}: DocumentsPageProps<TItem>) {
  const shouldShowPagination =
    !state.errorMsg && (state.isLoading || items.length > 0);

  return (
    <main className="min-h-dvh bg-[#EEF0F3]">
      <section className="relative mx-auto min-h-dvh w-full max-w-[834px] bg-[#EEF0F3] px-10 py-10">
        <header>
          <h1 className="text-4xl font-light tracking-wide text-[#162B40]">
            HOME <span className="font-bold">DECOR</span>
          </h1>

          <div className="mt-4">
            <DocumentSearchBar
              value={search.value}
              onChange={search.onChange}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <DocumentTabs
              activeTab={tabs.activeTab}
              onChange={tabs.onChange}
            />

            <DocumentToolbar
              onOpenSort={toolbar.onOpenSort}
              onOpenFilter={toolbar.onOpenFilter}
            />
          </div>
        </header>

        <section className="mt-5">
          <h2 className="text-xl font-semibold text-[#162B40]">
            {sectionTitle}
          </h2>

          {state.errorMsg ? (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {state.errorMsg}
            </p>
          ) : state.isLoading ? (
            <DocumentGridSkeleton />
          ) : items.length === 0 ? (
            <p className="mt-4 text-sm text-[#466582]">
              {state.emptyMessage}
            </p>
          ) : (
            <DocumentGrid
              items={items}
              getItemKey={getItemKey}
              renderItem={renderItem}
            />
          )}
        </section>

        {shouldShowPagination && (
          <DocumentPagination
            currentPage={pagination.currentPage}
            hasPrevious={pagination.hasPrevious}
            hasNext={pagination.hasNext}
            onPrevious={pagination.onPrevious}
            onNext={pagination.onNext}
          />
        )}

        {floatingAction}
        {sortPanel}
        {filterPanel}
      </section>
    </main>
  );
}
