
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { IconRefresh, IconSearch, IconSettings, IconMenu2, IconLogin, IconUserPlus, IconLogout } from '../../constants'; // Added new icons

const TopBar: React.FC = () => {
  const { currentUser, isAuthenticated, logout, toggleSidebar } = useAppContext();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="bg-white shadow-sm h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-30">
      {/* Left Side: Burger Menu & Logo */}
      <div className="flex items-center">
        {isAuthenticated && ( // Only show burger if authenticated and sidebar is relevant
          <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full hover:bg-gray-200 text-gray-600 mr-2 lg:mr-3"
              aria-label="Toggle sidebar"
          >
              <IconMenu2 className="h-6 w-6" />
          </button>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        <span className="text-2xl font-semibold text-gray-800">MarketWire</span>
      </div>

      {/* Center: Search Bar (Only if authenticated) */}
      {isAuthenticated && (
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search announcements..."
            />
          </div>
        </div>
      )}
      {!isAuthenticated && <div className="flex-1 mx-4"></div>} {/* Spacer if not authenticated */}


      {/* Right Side: Icons & User Profile / Auth Links */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {isAuthenticated && currentUser ? (
          <>
            <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600 hidden sm:inline-block">
              <IconRefresh className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600 hidden sm:inline-block">
              <IconSettings className="h-5 w-5" /> {/* Placeholder for Layout Toggle */}
            </button>
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200"
              >
                {currentUser.avatarUrl ? (
                  <img className="h-8 w-8 rounded-full" src={currentUser.avatarUrl} alt="User" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {currentUser.name ? currentUser.name.substring(0, 1).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden md:inline-block">{currentUser.name}</span>
                <svg className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <a href="#/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100">
                <IconLogin className="w-5 h-5 mr-1 sm:mr-1.5" />
                <span className="hidden sm:inline">Login</span>
            </Link>
            <Link to="/register" className="flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md">
                <IconUserPlus className="w-5 h-5 mr-1 sm:mr-1.5" />
                 <span className="hidden sm:inline">Register</span>
                 <span className="sm:hidden">Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
