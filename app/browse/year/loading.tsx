export default function BrowseYearLoading() {
  return (
    <div className="max-w-content section-pad animate-pulse">
      <div className="flex gap-4 border-b border-border mb-8 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-4 bg-gray-200 rounded" />
            <div className="flex-1 h-5 bg-gray-100 rounded-full" />
            <div className="w-16 h-4 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
