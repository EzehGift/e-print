export default function BrowseCreatorsLoading() {
  return (
    <div className="max-w-content section-pad animate-pulse">
      <div className="flex gap-4 border-b border-border mb-8 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-8 w-52 bg-gray-200 rounded mb-6" />
      <div className="flex flex-wrap gap-1 mb-8">
        {Array.from({ length: 26 }).map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-100 rounded" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
