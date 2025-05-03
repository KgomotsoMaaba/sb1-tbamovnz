import React, { useState, useCallback, useEffect } from 'react';
import { Search, MapPin, Tag, AlertCircle, RefreshCw } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { supabase, testConnection } from '../../lib/supabase';

interface SearchBarProps {
  onSearch: (results: any[]) => void;
  type: 'events' | 'listings';
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, type, className = '' }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    province: '',
    startDate: '',
    endDate: '',
  });
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const debouncedFilters = useDebounce(filters, 300);

  const searchItems = useCallback(async (isRetry = false) => {
    if (isLoading && !isRetry) return;
    
    setIsLoading(true);
    setError(null);
    if (isRetry) setRetrying(true);

    try {
      // Test connection before proceeding
      const isConnected = await testConnection();
      setConnectionStatus(isConnected);
      
      if (!isConnected) {
        throw new Error('Unable to connect to the database. Please check your internet connection and try again.');
      }

      let queryBuilder = supabase
        .from(type === 'events' ? 'events' : 'business_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (debouncedQuery) {
        queryBuilder = queryBuilder.or(`name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%${type === 'listings' ? ',location.ilike.%' + debouncedQuery + '%' : ''}`);
      }
      
      if (debouncedFilters.category) {
        queryBuilder = queryBuilder.eq('category', debouncedFilters.category);
      }
      
      if (type === 'listings' && debouncedFilters.province) {
        queryBuilder = queryBuilder.eq('province', debouncedFilters.province);
      }
      
      if (type === 'events') {
        if (debouncedFilters.startDate) {
          queryBuilder = queryBuilder.gte('start_date', debouncedFilters.startDate);
        }
        if (debouncedFilters.endDate) {
          queryBuilder = queryBuilder.lte('end_date', debouncedFilters.endDate);
        }
      }

      const { data, error: queryError } = await queryBuilder;

      if (queryError) {
        if (queryError.message.includes('Failed to fetch') || queryError.message.includes('NetworkError')) {
          throw new Error('Connection error. Please check your internet connection and try again.');
        }
        throw queryError;
      }

      setError(null);
      onSearch(data || []);
    } catch (error: any) {
      console.error('Error searching:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
      onSearch([]);
    } finally {
      setIsLoading(false);
      setRetrying(false);
    }
  }, [debouncedQuery, debouncedFilters, type, onSearch, isLoading]);

  useEffect(() => {
    if (initialLoad) {
      searchItems();
      setInitialLoad(false);
    } else if (!debouncedQuery && !Object.values(debouncedFilters).some(Boolean)) {
      searchItems();
    } else {
      const timeoutId = setTimeout(() => {
        searchItems();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [searchItems, debouncedQuery, debouncedFilters, initialLoad]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRetry = () => {
    searchItems(true);
  };

  const selectClasses = `
    w-full pl-10 pr-4 py-2.5 
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100
    border-none rounded-lg
    focus:outline-none focus:ring-2 focus:ring-accent-500
    appearance-none cursor-pointer
  `;

  const optionClasses = `
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100
    hover:bg-gray-50 dark:hover:bg-gray-700
  `;

  return (
    <div className={`${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-accent-500 focus-within:border-transparent">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${type}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-accent-500 focus-within:border-transparent">
            <Tag className="absolute left-3 text-gray-400" size={20} />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className={selectClasses}
            >
              <option value="" className={optionClasses}>All Categories</option>
              {type === 'events' ? (
                <>
                  <option value="Adventure" className={optionClasses}>Adventure</option>
                  <option value="Cultural" className={optionClasses}>Cultural</option>
                  <option value="Entertainment" className={optionClasses}>Entertainment</option>
                  <option value="Sports" className={optionClasses}>Sports</option>
                  <option value="Education" className={optionClasses}>Education</option>
                </>
              ) : (
                <>
                  <option value="Adventure" className={optionClasses}>Adventure</option>
                  <option value="Accommodation" className={optionClasses}>Accommodation</option>
                  <option value="Dining" className={optionClasses}>Dining</option>
                  <option value="Wellness" className={optionClasses}>Wellness</option>
                  <option value="Services" className={optionClasses}>Services</option>
                </>
              )}
            </select>
          </div>
        </div>

        {type === 'listings' && (
          <div className="flex-1 min-w-0">
            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-accent-500 focus-within:border-transparent">
              <MapPin className="absolute left-3 text-gray-400" size={20} />
              <select
                value={filters.province}
                onChange={(e) => handleFilterChange('province', e.target.value)}
                className={selectClasses}
              >
                <option value="" className={optionClasses}>All Provinces</option>
                <option value="Eastern Cape" className={optionClasses}>Eastern Cape</option>
                <option value="Free State" className={optionClasses}>Free State</option>
                <option value="Gauteng" className={optionClasses}>Gauteng</option>
                <option value="KwaZulu-Natal" className={optionClasses}>KwaZulu-Natal</option>
                <option value="Limpopo" className={optionClasses}>Limpopo</option>
                <option value="Mpumalanga" className={optionClasses}>Mpumalanga</option>
                <option value="North West" className={optionClasses}>North West</option>
                <option value="Northern Cape" className={optionClasses}>Northern Cape</option>
                <option value="Western Cape" className={optionClasses}>Western Cape</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertCircle size={20} />
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="ml-auto flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
            disabled={retrying}
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}
    </div>
  );
};