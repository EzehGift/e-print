export default function BrowseDivisionsLoading() {
  return (
    <div className="max-w-content section-pad animate-pulse">
      <div className="flex gap-4 border-b border-border mb-8 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-8 w-56 bg-gray-200 rounded mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card">
            <div className="h-5 w-64 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
