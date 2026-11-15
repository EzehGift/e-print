export default function BrowseSubjectsLoading() {
  return (
    <div className="max-w-content section-pad animate-pulse">
      <div className="flex gap-4 border-b border-border mb-8 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-8 w-56 bg-gray-200 rounded mb-8" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-100 rounded-full" style={{ width: `${60 + (i % 5) * 20}px` }} />
        ))}
      </div>
    </div>
  )
}
