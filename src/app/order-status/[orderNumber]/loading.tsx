// src/app/order-status/[orderNumber]/loading.tsx
export default function OrderStatusLoading() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Order Header Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-48 mb-8" />
              
              {/* Progress Skeleton */}
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="mt-2 h-4 bg-gray-200 rounded w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right Column Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }