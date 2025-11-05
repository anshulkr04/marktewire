
import React, { useState, useMemo } from 'react';
import { mockInvestors, mockSmartMoneyActivities } from '../services/mockData';
import { Investor, SmartMoneyActivity } from '../types';
import { IconSearch, IconCheck, IconChevronDown } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';

const SmartMoneyPage: React.FC = () => {
  const { investors: globalInvestors, setInvestors, watchlists, selectedWatchlistFilters } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFeedFilter, setActivityFeedFilter] = useState('all_followed'); // 'all_followed' or watchlist.id
  const [activityFilterOpen, setActivityFilterOpen] = useState(false);

  const handleFollowToggle = (investorId: string) => {
    setInvestors(prevInvestors => 
      prevInvestors.map(inv => 
        inv.id === investorId ? { ...inv, isFollowed: !inv.isFollowed } : inv
      )
    );
  };

  const filteredInvestors = useMemo(() => {
    return globalInvestors.filter(investor => 
      investor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [globalInvestors, searchTerm]);

  const filteredActivities = useMemo(() => {
    let activities = [...mockSmartMoneyActivities]; // Replace with actual fetching logic
    
    if (activityFeedFilter === 'all_followed') {
      const followedInvestorNames = new Set(globalInvestors.filter(inv => inv.isFollowed).map(inv => inv.name));
      activities = activities.filter(act => followedInvestorNames.has(act.investorName));
    } else { // Filter by specific watchlist
      const watchlist = watchlists.find(wl => wl.id === activityFeedFilter);
      if (watchlist) {
        const investorNamesInWatchlist = new Set(
            globalInvestors
            .filter(inv => watchlist.superInvestors.includes(inv.id))
            .map(inv => inv.name)
        );
        activities = activities.filter(act => investorNamesInWatchlist.has(act.investorName));
      } else {
        activities = []; // Should not happen if UI is correct
      }
    }
    return activities.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by most recent
  }, [mockSmartMoneyActivities, globalInvestors, activityFeedFilter, watchlists]);


  return (
    <div className="space-y-8">
      {/* Investor Directory */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Investor Directory (Global Follows)</h2>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search investors to follow/unfollow globally..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-6 text-sm" role="alert">
          <p><span className="font-bold">Tip:</span> Follow your favorite investors (globally) to get a personalized feed of their deals and mentions below. You can further refine this feed by selecting a watchlist.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredInvestors.map((investor) => (
            <div key={investor.id} className="p-4 border border-gray-200 rounded-md flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
              <img src={`https://picsum.photos/seed/${investor.id}/80/80`} alt={investor.name} className="w-16 h-16 rounded-full mb-3"/>
              <p className="text-md font-medium text-gray-800 mb-3">{investor.name}</p>
              <Button
                onClick={() => handleFollowToggle(investor.id)}
                variant={investor.isFollowed ? 'success' : 'secondary'}
                size="sm"
                className="w-full"
                leftIcon={investor.isFollowed ? <IconCheck className="w-4 h-4" /> : null}
              >
                {investor.isFollowed ? 'Followed Globally' : 'Follow Globally'}
              </Button>
            </div>
          ))}
           {filteredInvestors.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-4">No investors found matching your search.</p>
          )}
        </div>
      </div>

      {/* Smart Money Activity Feed */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Smart Money Activity Feed</h2>
            <div className="relative">
                <button
                    onClick={() => setActivityFilterOpen(!activityFilterOpen)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    {activityFeedFilter === 'all_followed' ? 'All Globally Followed Investors' : watchlists.find(wl => wl.id === activityFeedFilter)?.name || 'Select Watchlist'}
                    <IconChevronDown className={`w-4 h-4 ml-2 transition-transform ${activityFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                {activityFilterOpen && (
                    <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 max-h-60 overflow-y-auto">
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActivityFeedFilter('all_followed'); setActivityFilterOpen(false); }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            All Globally Followed Investors
                        </a>
                        {watchlists.map(wl => (
                            <a
                            key={wl.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActivityFeedFilter(wl.id); setActivityFilterOpen(false); }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                            {wl.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-blue-600 font-medium">{activity.investorName}</p>
                        <p className="text-md text-gray-700 mt-1">{activity.activity}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No activities to display for the current filter.</p>
        )}
      </div>
    </div>
  );
};

export default SmartMoneyPage;
    