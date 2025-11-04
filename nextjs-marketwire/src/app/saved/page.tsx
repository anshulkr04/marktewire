import MainLayout from '@/app/components/layout/MainLayout'

export default function SavedPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Saved Items</h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Interesting Analysis of Tech Sector Trends
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Saved 2 days ago • Announcement</p>
                    <p className="mt-2 text-sm text-gray-600">
      Comprehensive analysis of emerging trends in the technology sector, including AI adoption...
                    </p>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700">Notes:</label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={2}
                        placeholder="Add your notes here..."
                        defaultValue="Focus on cloud computing companies mentioned"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Market Data: Q3 Earnings Summary
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Saved 1 week ago • Market Data</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Summary of key quarterly earnings results across major indices...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}