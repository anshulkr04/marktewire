
import React, { useState, useMemo } from 'react';
import { mockMarketResults } from '../services/mockData';
import { MarketResultItem } from '../types';
import Pagination from '../components/ui/Pagination';
import { IconBookmark, IconChevronDown } from '../constants';
import { useAppContext } from '../contexts/AppContext';

const ITEMS_PER_PAGE = 7;

const MarketDataPage: React.FC = () => {
  const { watchlists, selectedWatchlistFilters } = useAppContext();
  const [activeTab, setActiveTab] = useState('Results');
  const [currentPage, setCurrentPage] = useState(1);
  const [marketResultsData, setMarketResultsData] = useState<MarketResultItem[]>(mockMarketResults);
  const [watchlistFilterOpen, setWatchlistFilterOpen] = useState(false);
  const [selectedPageWatchlist, setSelectedPageWatchlist] = useState<string>('all'); // 'all' or watchlist.id

  const toggleSaveItem = (id: string) => {
    setMarketResultsData(prev => prev.map(item => item.id === id ? {...item, isSaved: !item.isSaved} : item));
  };
  
  const tabs = ['Results', 'Large Deals', 'Corporate Actions', 'Key Documents'];

  const filteredResults = useMemo(() => {
    let results = [...marketResultsData]; // In a real app, data would change based on activeTab

    // Filter by selected page watchlist (dropdown)
    if (selectedPageWatchlist !== 'all') {
        const watchlist = watchlists.find(wl => wl.id === selectedPageWatchlist);
        if (watchlist) {
            results = results.filter(item => watchlist.companies.includes(item.company.id));
        }
    } else {
      // Filter by sidebar watchlist if "All Companies" is selected in dropdown
      if (selectedWatchlistFilters.length > 0) {
        const companyIdsInSelectedWatchlists = new Set<string>();
        selectedWatchlistFilters.forEach(wlId => {
          const watchlist = watchlists.find(wl => wl.id === wlId);
          watchlist?.companies.forEach(compId => companyIdsInSelectedWatchlists.add(compId));
        });
        results = results.filter(item => companyIdsInSelectedWatchlists.has(item.company.id));
      }
    }
    return results;
  }, [marketResultsData, selectedPageWatchlist, selectedWatchlistFilters, watchlists]);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResults, currentPage]);
  
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

  const renderResultsTable = () => (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Headline</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EPS</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedResults.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.company.name}</div>
                  <div className="text-xs text-gray-500">{item.company.ticker}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-700 max-w-xs truncate" title={item.aiHeadline}>{item.aiHeadline}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.revenue}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.netProfit}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.eps}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => toggleSaveItem(item.id)} className={`p-1.5 rounded-md ${item.isSaved ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                    <IconBookmark className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredResults.length === 0 && (
        <div className="text-center py-10 text-gray-500">
            No market data matches your current filters for this tab.
        </div>
      )}
      {totalPages > 1 && (
         <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Page {currentPage} of {totalPages} ({filteredResults.length} items)</p>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </>
  );

  const renderContentForTab = () => {
    switch (activeTab) {
      case 'Results':
        return renderResultsTable();
      case 'Large Deals':
        // TODO: Implement sub-tabs for Bulk Deals, Block Deals etc.
        return <div className="p-4 text-gray-500">Large Deals content (e.g., Bulk Deals, Block Deals) will be shown here.</div>;
      case 'Corporate Actions':
        return <div className="p-4 text-gray-500">Corporate Actions list will be shown here.</div>;
      case 'Key Documents':
        // TODO: Implement sub-tabs for Concall Transcripts, Annual Reports etc.
        return <div className="p-4 text-gray-500">Key Documents (e.g., Concall Transcripts, Annual Reports) will be shown here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Market Data</h1>
        <div className="relative">
          <button
            onClick={() => setWatchlistFilterOpen(!watchlistFilterOpen)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {selectedPageWatchlist === 'all' ? 'All Companies (No Watchlist Filter)' : watchlists.find(wl => wl.id === selectedPageWatchlist)?.name}
            <IconChevronDown className={`w-4 h-4 ml-2 transition-transform ${watchlistFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          {watchlistFilterOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setSelectedPageWatchlist('all'); setWatchlistFilterOpen(false); setCurrentPage(1); }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                All Companies (No Watchlist Filter)
              </a>
              {watchlists.map(wl => (
                <a
                  key={wl.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setSelectedPageWatchlist(wl.id); setWatchlistFilterOpen(false); setCurrentPage(1); }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {wl.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {setActiveTab(tab); setCurrentPage(1);}}
              className={`pb-3 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderContentForTab()}
      </div>
    </div>
  );
};

export default MarketDataPage;
    