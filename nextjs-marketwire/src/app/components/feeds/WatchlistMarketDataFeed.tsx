
import React, { useState, useMemo, useEffect } from 'react';
import { mockMarketResults } from '../../services/mockData';
import { MarketResultItem, Company } from '../../types';
import Pagination from '../../components/ui/Pagination';
import { IconBookmark } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

const ITEMS_PER_PAGE = 7;

interface WatchlistMarketDataFeedProps {
  watchlistCompanyIds: string[];
}

const WatchlistMarketDataFeed: React.FC<WatchlistMarketDataFeedProps> = ({ watchlistCompanyIds }) => {
  const { companies } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [feedMarketResults, setFeedMarketResults] = useState<MarketResultItem[]>([]);

  useEffect(() => {
    const hydratedResults = mockMarketResults.map(res => {
        const companyDetail = companies.find(c => c.id === res.company.id);
        return {
            ...res,
            company: companyDetail || res.company,
        };
    });
    setFeedMarketResults(hydratedResults);
  }, [companies]);

  const toggleSaveItem = (id: string) => {
    setFeedMarketResults(prev => prev.map(item => item.id === id ? {...item, isSaved: !item.isSaved} : item));
     // TODO: Integrate with global saved items context or API
  };

  const relevantResults = useMemo(() => {
    return feedMarketResults
      .filter(item => watchlistCompanyIds.includes(item.company.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [feedMarketResults, watchlistCompanyIds]);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return relevantResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [relevantResults, currentPage]);
  
  const totalPages = Math.ceil(relevantResults.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when watchlist companies change
  }, [watchlistCompanyIds]);

  if (relevantResults.length === 0) {
    return <p className="text-gray-500 py-6 text-center">No market data results for companies in this watchlist.</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Headline</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EPS</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Save</th>
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
                  <div className="text-sm text-gray-700 max-w-xs break-words" title={item.aiHeadline}>{item.aiHeadline}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.revenue}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.netProfit}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.eps}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => toggleSaveItem(item.id)} title={item.isSaved ? "Unsave item" : "Save item"} className={`p-1.5 rounded-md ${item.isSaved ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                    <IconBookmark className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {totalPages > 1 && (
        <div className="mt-auto pt-3 flex justify-end items-center border-t border-gray-200">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default WatchlistMarketDataFeed;
