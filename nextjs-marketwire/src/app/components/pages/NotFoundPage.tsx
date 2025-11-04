
import React from 'react';
import { Link } from 'react-router-dom';
import { RoutesPath } from '../constants';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-white rounded-lg shadow">
      <svg className="w-32 h-32 text-red-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path> {/* A little X mark */}
      </svg>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to={RoutesPath.DASHBOARD}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-150"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
    