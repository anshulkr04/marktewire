import MainLayout from '@/app/components/layout/MainLayout'

export default function WatchlistPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Watchlist</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Watchlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Tech Stocks</h3>
              <p className="text-sm text-gray-500 mt-1">12 companies</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Financial Sector</h3>
              <p className="text-sm text-gray-500 mt-1">8 companies</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Healthcare</h3>
              <p className="text-sm text-gray-500 mt-1">6 companies</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}