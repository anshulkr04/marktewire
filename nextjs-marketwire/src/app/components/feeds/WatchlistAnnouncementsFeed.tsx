import React, { useState, useMemo, useEffect } from 'react';
import { mockAnnouncements } from '../../services/mockData';
import { AnnouncementItem, Sentiment, Company } from '../../types';
import Pagination from '../../components/ui/Pagination';
import { IconBookmark } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

const ITEMS_PER_PAGE = 7;

const SentimentDot: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const color = sentiment === Sentiment.Positive ? 'bg-green-500' :
                sentiment === Sentiment.Negative ? 'bg-red-500' : 'bg-yellow-400';
  return <div className={`w-2.5 h-2.5 rounded-full ${color}`} title={sentiment}></div>;
};

interface WatchlistAnnouncementsFeedProps {
  watchlistCompanyIds: string[];
}

const WatchlistAnnouncementsFeed: React.FC<WatchlistAnnouncementsFeedProps> = ({ watchlistCompanyIds }) => {
  const { companies } = useAppContext(); 
  const [currentPage, setCurrentPage] = useState(1);
  
  const [feedAnnouncements, setFeedAnnouncements] = useState<AnnouncementItem[]>([]);

  useEffect(() => {
    // Simulate fetching and preparing data with full company objects
    // In a real app, this might involve an API call or more complex data hydration
    const hydratedAnnouncements = mockAnnouncements.map(ann => {
      const companyDetail = companies.find(c => c.id === ann.company.id);
      return {
        ...ann,
        company: companyDetail || ann.company, // Ensure full company object
      };
    });
    setFeedAnnouncements(hydratedAnnouncements);
  }, [companies]); // Re-hydrate if global companies list changes, though mock data won't

  const toggleSaveItem = (id: string) => {
    setFeedAnnouncements(prev => prev.map(item => item.id === id ? {...item, isSaved: !item.isSaved} : item));
    // TODO: Integrate with global saved items context or API
  };

  const relevantAnnouncements = useMemo(() => {
    return feedAnnouncements
      .filter(ann => watchlistCompanyIds.includes(ann.company.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [feedAnnouncements, watchlistCompanyIds]);

  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return relevantAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [relevantAnnouncements, currentPage]);

  const totalPages = Math.ceil(relevantAnnouncements.length / ITEMS_PER_PAGE);
  
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when watchlist companies change
  }, [watchlistCompanyIds]);


  if (relevantAnnouncements.length === 0) {
    return <p className="text-gray-500 py-6 text-center">No announcements for companies in this watchlist.</p>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headline</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Save</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAnnouncements.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-700">{item.company.name}</div>
                  <div className="text-xs text-gray-500">{item.company.ticker}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-700 max-w-md break-words" title={item.headline}>{item.headline}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <SentimentDot sentiment={item.sentiment} />
                </td>
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

export default WatchlistAnnouncementsFeed;