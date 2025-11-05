'use client'

import { useSearchParams } from 'next/navigation'
import MainLayout from '@/app/components/layout/MainLayout'

export default function MarketDataPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'corporate-actions'

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Market Data</h1>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <a
              href="/market-data?tab=corporate-actions"
              className={`${
                tab === 'corporate-actions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Corporate Actions
            </a>
            <a
              href="/market-data?tab=key-documents"
              className={`${
                tab === 'key-documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Key Documents
            </a>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {tab === 'corporate-actions' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Corporate Actions</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">AAPL Stock Split</h3>
                        <p className="text-sm text-gray-500 mt-1">Apple Inc. • Effective Dec 15, 2024</p>
                        <p className="text-sm text-gray-600 mt-2">4-for-1 stock split for shareholders of record</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">TSLA Dividend Declaration</h3>
                        <p className="text-sm text-gray-500 mt-1">Tesla Inc. • Ex-Dec 20, 2024</p>
                        <p className="text-sm text-gray-600 mt-2">Quarterly dividend of $0.25 per share</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Declared
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'key-documents' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Key Documents</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Annual Report 2024</h3>
                        <p className="text-sm text-gray-500 mt-1">Microsoft Corp. • Filed Nov 1, 2024</p>
                        <p className="text-sm text-gray-600 mt-2">Form 10-K Annual Report</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Prospectus</h3>
                        <p className="text-sm text-gray-500 mt-1">Rivian Automotive • Filed Oct 28, 2024</p>
                        <p className="text-sm text-gray-600 mt-2">Secondary Offering Prospectus</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}