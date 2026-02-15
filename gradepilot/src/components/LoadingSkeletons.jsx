/**
 * Loading Skeleton components
 * Displayed while data is being fetched from Supabase.
 */

function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[#EEEEEE] rounded-lg ${className}`} />
  );
}

/**
 * Skeleton for the stats row at the top of the dashboard
 */
export function StatsRowSkeleton() {
  return (
    <div className="space-y-6">
      {/* Current Grade Card */}
      <div className="card rounded-xl p-5">
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-12 w-32 mb-2" />
        <Skeleton className="h-5 w-10" />
      </div>
      {/* Weight Used */}
      <div className="card rounded-xl p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-16 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      {/* Categories count */}
      <div className="card rounded-xl p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-10 mb-1" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a category card
 */
export function CategoryCardSkeleton() {
  return (
    <div className="card rounded-xl">
      <div className="p-4 border-b border-[#EEEEEE] flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-5 w-32" />
        <div className="flex-1" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-10 rounded-md" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-36" />
          <div className="flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the categories column
 */
export function CategoriesColumnSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-4">
        <CategoryCardSkeleton />
        <CategoryCardSkeleton />
        <CategoryCardSkeleton />
      </div>
    </div>
  );
}

/**
 * Skeleton for the forecast column
 */
export function ForecastSkeleton() {
  return (
    <div className="card rounded-xl p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div>
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div>
        <Skeleton className="h-3 w-44 mb-3" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Full dashboard skeleton — 3-column layout
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header skeleton */}
      <header className="border-b border-[#EEEEEE] bg-white px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <StatsRowSkeleton />
          </div>
          {/* Column 2 */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <CategoriesColumnSkeleton />
          </div>
          {/* Column 3 */}
          <div className="order-3">
            <ForecastSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardSkeleton;
