
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { RoutesPath } from '../constants';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoadingAuth } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || RoutesPath.DASHBOARD;

  useEffect(() => {
    if (isAuthenticated && !isLoadingAuth) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      await login(email, password);
      // Navigation will be handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error(err);
    }
  };
  
  if (isLoadingAuth && !isAuthenticated) { // Still loading initial auth state and not yet authenticated
      return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl text-center">
             <p className="text-gray-600">Checking authentication status...</p>
        </div>
      )
  }


  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl">
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
          Sign in to MarketWire
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        {/* <div className="flex items-center justify-between">
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div> */}

        <Button type="submit" className="w-full" disabled={isLoadingAuth}>
          {isLoadingAuth ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
