export default function Loading() {
  return (
    <div className="max-w-content section-pad">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 bg-slate-200 rounded-lg" />
        <div className="h-4 w-96 bg-slate-100 rounded-lg" />
        <div className="space-y-3 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-20 bg-slate-200 rounded-full" />
                <div className="h-3 w-8 bg-slate-100 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-5/6 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
