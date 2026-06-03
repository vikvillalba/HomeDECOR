import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export type DocumentCursor =
  QueryDocumentSnapshot<DocumentData> | null;

export type LoadDocumentPageOptions = {
  cursor: DocumentCursor;
  pageSize: number;
  searchTerm: string;
};

export type DocumentPageResult<TItem> = {
  items: TItem[];
  nextCursor: DocumentCursor;
  hasMore: boolean;
};

type DocumentPageCacheEntry<TItem> = DocumentPageResult<TItem>;

type UseDocumentPageOptions<TItem> = {
  pageSize: number;
  errorMessage: string;
  loadPage: (
    options: LoadDocumentPageOptions
  ) => Promise<DocumentPageResult<TItem>>;
};

export function useDocumentPage<TItem>({
  pageSize,
  errorMessage,
  loadPage,
}: UseDocumentPageOptions<TItem>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] =
    useState<DocumentCursor>(null);
  const [pageCursors, setPageCursors] = useState<
    DocumentCursor[]
  >([null]);
  const [pageCache, setPageCache] = useState<
    Array<DocumentPageCacheEntry<TItem> | undefined>
  >([]);

  const requestIdRef = useRef(0);
  const isPaginatingRef = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadDocuments = useCallback(
    async (
      cursor: DocumentCursor = null,
      cachePageIndex?: number,
      shouldResetPagination = false
    ): Promise<boolean> => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (shouldResetPagination) {
        isPaginatingRef.current = false;
        setPageIndex(0);
        setPageCursors([null]);
        setPageCache([]);
      }

      setIsLoading(true);
      setErrorMsg("");

      try {
        const result = await loadPage({
          cursor,
          pageSize,
          searchTerm: debouncedSearchTerm,
        });

        if (requestId !== requestIdRef.current) {
          return false;
        }

        setItems(result.items);
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);

        if (cachePageIndex !== undefined) {
          setPageCache((current) => {
            const copy = [...current];
            copy[cachePageIndex] = result;
            return copy;
          });
        }

        return true;
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return false;
        }

        console.error(error);
        setErrorMsg(errorMessage);

        return false;
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [debouncedSearchTerm, errorMessage, loadPage, pageSize]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDocuments(null, 0, true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDocuments]);

  const showCachedPage = useCallback(
    (targetPageIndex: number) => {
      const cachedPage = pageCache[targetPageIndex];

      if (!cachedPage) return false;

      requestIdRef.current += 1;
      setItems(cachedPage.items);
      setNextCursor(cachedPage.nextCursor);
      setHasMore(cachedPage.hasMore);
      setPageIndex(targetPageIndex);
      setErrorMsg("");
      setIsLoading(false);

      return true;
    },
    [pageCache]
  );

  async function handleNextPage() {
    if (isPaginatingRef.current) return;

    isPaginatingRef.current = true;

    try {
      const nextPageIndex = pageIndex + 1;
      const cachedPage = pageCache[nextPageIndex];
      const cachedCursor = pageCursors[nextPageIndex] ?? null;
      const cursor = cachedCursor ?? nextCursor;

      if (cachedPage && showCachedPage(nextPageIndex)) return;

      if (isLoading || !cursor) return;
      if (!cachedCursor && !hasMore) return;

      const didLoad = await loadDocuments(
        cursor,
        nextPageIndex
      );

      if (!didLoad) return;

      if (!cachedCursor) {
        setPageCursors((current) => {
          const copy = [...current];
          copy[nextPageIndex] = cursor;
          return copy;
        });
      }

      setPageIndex(nextPageIndex);
    } finally {
      isPaginatingRef.current = false;
    }
  }

  async function handlePreviousPage() {
    if (isPaginatingRef.current) return;

    isPaginatingRef.current = true;

    try {
      if (pageIndex === 0) return;

      const previousPageIndex = pageIndex - 1;
      if (showCachedPage(previousPageIndex)) return;

      if (isLoading) return;

      const previousCursor =
        pageCursors[previousPageIndex] ?? null;
      const didLoad = await loadDocuments(
        previousCursor,
        previousPageIndex
      );

      if (!didLoad) return;

      setPageIndex(previousPageIndex);
    } finally {
      isPaginatingRef.current = false;
    }
  }

  const cachedNextCursor = pageCursors[pageIndex + 1] ?? null;
  const cachedNextPage = pageCache[pageIndex + 1];
  const cachedPreviousPage = pageCache[pageIndex - 1];
  const canGoPrevious =
    pageIndex > 0 && (!isLoading || Boolean(cachedPreviousPage));
  const canGoNext =
    Boolean(cachedNextPage) ||
    (!isLoading &&
      (Boolean(cachedNextCursor) ||
        (hasMore && Boolean(nextCursor))));

  return {
    items,
    searchTerm,
    setSearchTerm,
    isLoading,
    errorMsg,
    pageIndex,
    canGoPrevious,
    canGoNext,
    handlePreviousPage,
    handleNextPage,
  };
}
