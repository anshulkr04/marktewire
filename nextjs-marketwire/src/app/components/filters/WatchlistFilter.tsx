
'use client'

import React from 'react'
import FilterSection from './FilterSection'
import { useAppContext } from '../contexts/AppContext'

const WatchlistFilter: React.FC = () => {
  const { watchlists, selectedWatchlistFilters, setSelectedWatchlistFilters } = useAppContext();

  const handleCheckboxChange = (watchlistId: string) => {
    setSelectedWatchlistFilters(prev => 
      prev.includes(watchlistId) 
        ? prev.filter(id => id !== watchlistId)
        : [...prev, watchlistId]
    );
  };

  return (
    <FilterSection title="Watchlists">
      {watchlists.map((watchlist) => (
        <label key={watchlist.id} className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-gray-100 p-1 rounded-md cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={selectedWatchlistFilters.includes(watchlist.id)}
            onChange={() => handleCheckboxChange(watchlist.id)}
          />
          <span>{watchlist.name}</span>
        </label>
      ))}
    </FilterSection>
  );
};

export default WatchlistFilter;
    