
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import MarketDataPage from './pages/MarketDataPage';
import SmartMoneyPage from './pages/SmartMoneyPage';
import WatchlistPage from './pages/WatchlistPage';
import SavedPage from './pages/SavedPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage'; // New
import RegisterPage from './pages/RegisterPage'; // New
import { useAppContext } from './contexts/AppContext';
import { RoutesPath } from './constants';
import { PageName } from './types';

// Define new route paths
const ExtendedRoutesPath = {
  ...RoutesPath,
  LOGIN: '/login',
  REGISTER: '/register',
};

// ProtectedRoute component
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useAppContext();
  const location = useLocation();

  if (isLoadingAuth) {
    // Optional: Render a global loading spinner here
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ExtendedRoutesPath.LOGIN} state={{ from: location }} replace />;
  }
  return <Outlet />; // Renders child routes if authenticated
};


const App: React.FC = () => {
  const { setCurrentPage, isSidebarOpen, isAuthenticated, isLoadingAuth } = useAppContext();

  const RouteChangeHandler: React.FC<{ page: PageName }> = ({ page }) => {
    React.useEffect(() => {
      setCurrentPage(page);
    }, [page]);
    return null;
  };

  // Main layout for authenticated users
  const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar />
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />
        <main 
          className={`flex-1 p-6 overflow-y-auto bg-white transition-all duration-300 ease-in-out 
                     ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
  
  // Minimal layout for login/register pages
  const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {children}
    </div>
  );


  if (isLoadingAuth && !isAuthenticated) { // Show full page loader only if not yet authenticated and still loading initial auth state.
    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-xl font-semibold text-gray-700 mt-3">MarketWire</span>
            <p className="text-sm text-gray-500 mt-1">Loading application...</p>
        </div>
    );
  }


  return (
    <HashRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path={ExtendedRoutesPath.LOGIN} element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path={ExtendedRoutesPath.REGISTER} element={<AuthLayout><RegisterPage /></AuthLayout>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout><Navigate to={RoutesPath.DASHBOARD} replace /></MainLayout>} />
          <Route path={RoutesPath.DASHBOARD} element={<MainLayout><RouteChangeHandler page="dashboard" /><DashboardPage /></MainLayout>} />
          <Route path={RoutesPath.ANNOUNCEMENTS} element={<MainLayout><RouteChangeHandler page="announcements" /><AnnouncementsPage /></MainLayout>} />
          <Route path={RoutesPath.MARKET_DATA} element={<MainLayout><RouteChangeHandler page="market_data" /><MarketDataPage /></MainLayout>} />
          <Route path={RoutesPath.SMART_MONEY} element={<MainLayout><RouteChangeHandler page="smart_money" /><SmartMoneyPage /></MainLayout>} />
          <Route path={RoutesPath.WATCHLIST} element={<MainLayout><RouteChangeHandler page="watchlist" /><WatchlistPage /></MainLayout>} />
          <Route path={RoutesPath.SAVED} element={<MainLayout><RouteChangeHandler page="saved" /><SavedPage /></MainLayout>} />
        </Route>
        
        {/* Fallback for any other path including unmatched protected paths */}
        <Route path="*" element={isAuthenticated ? <MainLayout><RouteChangeHandler page="not_found" /><NotFoundPage /></MainLayout> : <Navigate to={ExtendedRoutesPath.LOGIN} replace />} />

      </Routes>
    </HashRouter>
  );
};

export default App;
