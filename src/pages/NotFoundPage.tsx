import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <img
            src="https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg"
            alt="404 Illustration"
            className="w-64 h-64 object-cover mx-auto rounded-lg shadow-lg"
          />
        </div>
        
        <h1 className="text-4xl font-heading font-bold text-textPrimary dark:text-white mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-textSecondary dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-textPrimary dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
          >
            <Home size={20} className="mr-2" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;