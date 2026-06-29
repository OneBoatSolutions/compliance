export default function Skeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse" role="status" aria-live="polite" aria-busy="true">
      {/* LOADING TEXT */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"
          />
          <p className="text-sm text-gray-600">Loading compliance controls...</p>
        </div>
      </div>

      {/* HEADER */}
      <div className="space-y-3">
        <div aria-hidden="true" className="h-4 w-40 bg-gray-200 rounded" />
        <div aria-hidden="true" className="h-6 w-80 bg-gray-300 rounded" />
        <div aria-hidden="true" className="h-3 w-60 bg-gray-200 rounded" />
      </div>

      {/* METRICS BAR */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((item, i) => (
          <div key={i} aria-hidden="true" className="h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 flex-wrap">
        <div aria-hidden="true" className="h-10 w-72 bg-gray-200 rounded-lg" />
        <div aria-hidden="true" className="h-10 w-40 bg-gray-200 rounded-lg" />
        <div aria-hidden="true" className="h-10 w-40 bg-gray-200 rounded-lg" />
        <div aria-hidden="true" className="h-10 w-40 bg-gray-200 rounded-lg" />
      </div>

      {/* CHECKLIST GROUPS */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((item, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            {/* GROUP HEADER */}
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <div className="space-y-2">
                <div aria-hidden="true" className="h-4 w-48 bg-gray-300 rounded" />
                <div aria-hidden="true" className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div aria-hidden="true" className="h-2 w-32 bg-gray-300 rounded" />
            </div>

            {/* CONTROL CARDS */}
            <div className="p-4 space-y-3">
              {Array.from({ length: 2 }).map((item, j) => (
                <div
                  key={j}
                  className="bg-white border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="space-y-2">
                    <div aria-hidden="true" className="h-3 w-32 bg-gray-200 rounded" />
                    <div aria-hidden="true" className="h-4 w-56 bg-gray-300 rounded" />
                    <div aria-hidden="true" className="h-3 w-20 bg-gray-200 rounded" />
                  </div>

                  <div aria-hidden="true" className="h-6 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
