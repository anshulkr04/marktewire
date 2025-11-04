
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItems } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';
import WatchlistFilter from '../filters/WatchlistFilter';
import SentimentFilter from '../filters/SentimentFilter';
import CategoryFilter from '../filters/CategoryFilter';

const Sidebar: React.FC = () => {
  const { currentPage, resetAllFilters, isSidebarOpen } = useAppContext();

  const showWatchlistFilter = ['saved', 'announcements', 'market_data', 'smart_money'].includes(currentPage);
  const showSentimentFilter = ['saved', 'announcements'].includes(currentPage);
  const showCategoryFilter = ['saved', 'announcements'].includes(currentPage);
  
  const shouldDisplayAnyFilter = showWatchlistFilter || showSentimentFilter || showCategoryFilter;

  return (
    <aside 
      className={`bg-slate-50 border-r border-gray-200 flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] pt-6 pb-4 transition-all duration-300 ease-in-out z-20
                 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full'}`}
      aria-hidden={!isSidebarOpen}
    >
      <div 
        className={`flex flex-col h-full transition-opacity duration-200 ease-in-out delay-100 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
        // The pointer-events-none could be applied here if opacity-0 is not enough for some screen readers or edge cases
      >
        {/* Main Navigation */}
        <nav className="px-4 space-y-1 mb-6">
          {NavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              tabIndex={isSidebarOpen ? 0 : -1} 
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150
                ${isActive 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Dynamic Filter Area */}
        {shouldDisplayAnyFilter && (
          <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filters</h3>
                  <button 
                      onClick={resetAllFilters}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      tabIndex={isSidebarOpen ? 0 : -1}
                  >
                      Reset All
                  </button>
              </div>
            {showWatchlistFilter && <WatchlistFilter />}
            {showSentimentFilter && <SentimentFilter />}
            {showCategoryFilter && <CategoryFilter />}
          </div>
        )}
        
        <div className="mt-auto px-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">&copy; {new Date().getFullYear()} CorpIntel</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
