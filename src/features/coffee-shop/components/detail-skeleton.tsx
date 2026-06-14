export function CoffeeShopDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-6 px-6 py-6">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="aspect-[16/9] w-full animate-pulse rounded-card bg-muted md:aspect-[21/9]" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
          <div className="h-40 w-full animate-pulse rounded-card bg-muted" />
        </div>
        <div className="h-80 w-full animate-pulse rounded-card bg-muted" />
      </div>
    </div>
  );
}