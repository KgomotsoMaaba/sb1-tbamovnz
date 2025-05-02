import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthButton from '../components/auth/AuthButton';
import { SearchBar } from '../components/search/SearchBar';

interface BusinessListing {
  id: string;
  name: string;
  description: string;
  location: string;
  province: string;
  number: string;
  email: string;
  address: string;
  image_url: string;
  website_url: string;
  category: string;
  user_id: string;
}

const DirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [session, setSession] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const fetchListings = useCallback(async (isNewSearch: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('business_listings')
        .select('*', { count: 'exact' });

      // Apply search filters if they exist
      if (searchParams) {
        if (searchParams.query) {
          query = query.or(`name.ilike.%${searchParams.query}%,description.ilike.%${searchParams.query}%,location.ilike.%${searchParams.query}%`);
        }
        if (searchParams.category) {
          query = query.eq('category', searchParams.category);
        }
        if (searchParams.province) {
          query = query.eq('province', searchParams.province);
        }
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setListings(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [isLoading, searchParams]);

  const handleSearch = useCallback((results: any) => {
    setSearchParams(results);
    setError(null);
    fetchListings(true);
  }, [fetchListings]);

  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('business_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setListings(prev => prev.filter(listing => listing.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const truncateDescription = (text: string, maxLines: number = 3) => {
    const words = text.split(' ');
    const averageWordsPerLine = 12;
    const maxWords = averageWordsPerLine * maxLines;
    
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-semibold">Business Directory</h1>
        {session ? (
          <button
            onClick={() => navigate('/directory/add')}
            className="flex items-center bg-accent-600 hover:bg-accent-700 text-white px-3 py-1.5 rounded-lg transition-colors font-heading text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Listing
          </button>
        ) : (
          <AuthButton />
        )}
      </div>

      <SearchBar 
        type="listings"
        onSearch={handleSearch}
        className="mb-8"
      />

      {deletingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-heading font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <div 
            key={listing.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-fade-in"
          >
            {listing.image_url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={listing.image_url}
                  alt={listing.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-heading font-semibold text-gray-800 dark:text-white">{listing.name}</h3>
                {listing.category && (
                  <span className="text-xs px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300 rounded-full">
                    {listing.category}
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {truncateDescription(listing.description)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {listing.location}, {listing.province}
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/directory/listing/${listing.id}`)}
                  className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 flex items-center text-sm"
                >
                  View Full Listing
                  <ExternalLink size={16} className="ml-1" />
                </button>

                {session?.user.id === listing.user_id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/directory/edit/${listing.id}`)}
                      className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(listing.id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        {error && (
          <div className="text-center py-4">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button
              onClick={() => fetchListings(true)}
              className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              Retry loading
            </button>
          </div>
        )}

        {!error && listings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No listings found. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;