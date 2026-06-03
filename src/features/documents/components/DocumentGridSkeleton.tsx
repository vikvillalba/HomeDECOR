export function DocumentGridSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-6">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-xl bg-white shadow-sm"
        />
      ))}
    </div>
  );
}
