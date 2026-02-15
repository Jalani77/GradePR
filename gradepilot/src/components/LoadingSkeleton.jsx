/**
 * Loading Skeleton Components
 */

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[#FAFAFA] rounded ${className}`}>
      <div className="h-full w-full"></div>
    </div>
  );
}

export function SkeletonText({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[#EEEEEE] rounded ${className}`}></div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header Skeleton */}
      <div className="border-b border-[#EEEEEE] px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EEEEEE] rounded animate-pulse"></div>
            <div>
              <SkeletonText className="h-5 w-32 mb-1" />
              <SkeletonText className="h-3 w-40" />
            </div>
          </div>
          <SkeletonText className="h-8 w-24" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <SkeletonCard key={i} className="h-24 p-4" />
              ))}
            </div>

            {/* Category Cards */}
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} className="h-40" />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SkeletonCard className="h-96" />
            <SkeletonCard className="h-48" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardSkeleton;
