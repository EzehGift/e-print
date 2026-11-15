export default function SearchLoading() {
  return (
    <div className="max-w-content section-pad">
      <div className="animate-pulse">
        <div className="h-8 w-72 bg-gray-200 rounded mb-6" />
        <div className="flex gap-8">
          <div className="w-56 shrink-0 hidden md:block space-y-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 w-32 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card space-y-2">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
