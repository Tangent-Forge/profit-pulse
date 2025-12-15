export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)] p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-8 w-48 bg-[var(--tf-deep-charcoal)] rounded-lg animate-pulse"></div>
          <div className="h-6 w-64 bg-[var(--tf-deep-charcoal)] rounded-lg animate-pulse"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--tf-deep-charcoal)] rounded-xl p-6 space-y-3"
            >
              <div className="h-4 w-24 bg-[var(--tf-steel-gray)] rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-[var(--tf-steel-gray)] rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Ideas list skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[var(--tf-deep-charcoal)] rounded-xl p-6 space-y-3"
            >
              <div className="h-6 w-48 bg-[var(--tf-steel-gray)] rounded animate-pulse"></div>
              <div className="h-4 w-full bg-[var(--tf-steel-gray)] rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-[var(--tf-steel-gray)] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
