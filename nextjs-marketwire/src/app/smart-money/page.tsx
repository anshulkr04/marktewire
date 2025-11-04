import MainLayout from '@/app/components/layout/MainLayout'

export default function SmartMoneyPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Smart Money</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Institutional Flows</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Vanguard Group</h3>
                  <p className="text-xs text-gray-500">Increased AAPL position</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+$2.3B</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">BlackRock</h3>
                  <p className="text-xs text-gray-500">Reduced TSLA position</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">-$1.1B</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Fidelity</h3>
                  <p className="text-xs text-gray-500">New NVDA position</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+$890M</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Insider Trading</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Tim Cook (AAPL CEO)</h3>
                  <p className="text-xs text-gray-500">Sale of 50,000 shares</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">-$9.8M</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Elon Musk (TSLA CEO)</h3>
                  <p className="text-xs text-gray-500">Purchase of 100,000 shares</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+$24.5M</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Satya Nadella (MSFT CEO)</h3>
                  <p className="text-xs text-gray-500">Sale of 25,000 shares</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">-$8.2M</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}