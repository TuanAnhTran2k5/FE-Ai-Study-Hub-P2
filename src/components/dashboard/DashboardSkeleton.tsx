export default function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 bg-secondary/15 rounded-3xl w-full" />
      
      {/* Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-secondary/15 rounded-3xl" />
        ))}
      </div>
      
      {/* Main Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left column */}
        <div className="md:col-span-8 space-y-6">
          <div className="h-44 bg-secondary/15 rounded-3xl" />
          <div className="h-80 bg-secondary/15 rounded-3xl" />
        </div>
        
        {/* Right column */}
        <div className="md:col-span-4 space-y-6">
          <div className="h-56 bg-secondary/15 rounded-3xl" />
          <div className="h-44 bg-secondary/15 rounded-3xl" />
          <div className="h-44 bg-secondary/15 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
