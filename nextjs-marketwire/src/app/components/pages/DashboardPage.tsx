
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { mockAnnouncements, mockCorporateActions, mockKeyDocuments, mockCompanies } from '../services/mockData';
import { RoutesPath, IconBell, IconListDetails, IconChartBar } from '../constants';
import { AnnouncementItem, CorporateAction, KeyDocument } from '../types';

const DashboardPage: React.FC = () => {
  const { watchlists } = useAppContext();

  // Filter announcements, corporate actions, and key documents for companies in any watchlist
  const watchlistCompanyIds = new Set(watchlists.flatMap(wl => wl.companies));
  
  const liveFeedItems: AnnouncementItem[] = mockAnnouncements
    .filter(ann => watchlistCompanyIds.has(ann.company.id))
    .slice(0, 5); // Show recent 5

  const upcomingCorporateActions: CorporateAction[] = mockCorporateActions
    .filter(ca => {
      const company = mockCompanies.find(c => c.name === ca.companyName);
      return company ? watchlistCompanyIds.has(company.id) : false;
    })
    .slice(0, 3);

  const latestKeyDocuments: KeyDocument[] = mockKeyDocuments
    .filter(kd => {
      const company = mockCompanies.find(c => c.name === kd.companyName);
      return company ? watchlistCompanyIds.has(company.id) : false;
    })
    .slice(0, 3);


  if (watchlists.length === 0 || watchlistCompanyIds.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-white rounded-lg shadow">
        <IconBell className="w-16 h-16 text-blue-500 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to MarketWire!</h2>
        <p className="text-gray-500 mb-6">
          Get started by creating a watchlist to personalize your feed and receive relevant updates.
        </p>
        <Link
          to={RoutesPath.WATCHLIST}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-150"
        >
          Create Your First Watchlist
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Live Feed */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Feed</h2>
        {liveFeedItems.length > 0 ? (
          <div className="space-y-4">
            {liveFeedItems.map((item) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">{item.company.name}</p>
                    <p className="text-md text-gray-700 mt-1">{item.headline}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent announcements from your watchlists.</p>
        )}
      </div>

      {/* Right Column: Context Widgets */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Corporate Actions</h2>
            <Link to={`${RoutesPath.MARKET_DATA}?tab=corporate_actions`} className="text-sm text-blue-600 hover:underline">View All →</Link>
          </div>
          {upcomingCorporateActions.length > 0 ? (
            <div className="space-y-3">
              {upcomingCorporateActions.map(action => (
                <div key={action.id} className="text-sm">
                  <p className="font-medium text-gray-700">{action.companyName}: <span className="text-gray-600">{action.actionType}</span></p>
                  <p className="text-xs text-gray-500">{action.date}</p>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-4">
                <IconListDetails className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No upcoming corporate actions from your watchlists.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Latest Key Documents</h2>
            <Link to={`${RoutesPath.MARKET_DATA}?tab=key_documents`} className="text-sm text-blue-600 hover:underline">View All →</Link>
          </div>
          {latestKeyDocuments.length > 0 ? (
            <div className="space-y-3">
              {latestKeyDocuments.map(doc => (
                <div key={doc.id} className="text-sm">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">{doc.title}</a>
                  <p className="text-xs text-gray-500">{doc.companyName} - {doc.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
                <IconChartBar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No new key documents from your watchlists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
