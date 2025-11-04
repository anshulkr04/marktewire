import MainLayout from '@/app/components/layout/MainLayout'

export default function AnnouncementsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Apple Inc. Reports Q4 Earnings
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">AAPL • 2 hours ago</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Apple reported better-than-expected quarterly earnings driven by strong iPhone sales and services growth...
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Tesla Announces New Gigafactory Location
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">TSLA • 4 hours ago</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Tesla announced plans for a new gigafactory in Mexico, expanding its production capacity for Model Y vehicles...
                    </p>
                  </div>
                </div>
              </div>

              <div className="pb-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Microsoft Azure Revenue Growth Accelerates
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">MSFT • 6 hours ago</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Microsoft's cloud computing division showed strong growth in the latest quarter, outpacing competitors...
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