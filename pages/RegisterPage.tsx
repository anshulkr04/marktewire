
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { RoutesPath } from '../constants';

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated, isLoadingAuth } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'free' | 'premium' | string>('free');
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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      await register(email, password, accountType);
      // Navigation will be handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error(err);
    }
  };
  
  if (isLoadingAuth && !isAuthenticated) {
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
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">Account Type</label>
          <select 
            id="accountType" 
            name="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as 'free' | 'premium')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="free">Free</option>
            {/* <option value="premium">Premium</option> */} {/* Backend might restrict this or handle it via /upgrade_account */}
          </select>
        </div>


        <Button type="submit" className="w-full" disabled={isLoadingAuth}>
          {isLoadingAuth ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
