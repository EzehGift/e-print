export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-20 bg-slate-200 rounded-full" />
            <div className="h-3 w-1 bg-slate-200 rounded" />
            <div className="h-3 w-8 bg-slate-200 rounded" />
          </div>
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-full mb-1.5" />
          <div className="h-3 bg-slate-100 rounded w-5/6" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-100 rounded w-full mb-2" />
      <div className="h-4 bg-slate-100 rounded w-5/6" />
    </div>
  )
}
