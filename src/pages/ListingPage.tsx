import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

const ListingPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<BusinessListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('business_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      navigate('/directory');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Listing Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/directory')}
            className="inline-flex items-center text-accent-600 hover:text-accent-700"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <button
        onClick={() => navigate('/directory')}
        className="inline-flex items-center text-accent-600 hover:text-accent-700 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Directory
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {listing.image_url && (
          <div className="w-full h-64 md:h-96 relative">
            <img
              src={listing.image_url}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent">
              <span className="inline-block px-3 py-1 bg-accent-500 text-white rounded-full text-sm">
                {listing.category}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-heading font-semibold mb-2">{listing.name}</h1>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
            <MapPin size={18} className="mr-2" />
            <span>{listing.location}, {listing.province}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                {listing.number && (
                  <div className="flex items-center">
                    <Phone size={18} className="text-accent-600 dark:text-accent-400 mr-3" />
                    <a href={`tel:${listing.number}`} className="hover:text-accent-600 dark:hover:text-accent-400">
                      {listing.number}
                    </a>
                  </div>
                )}
                
                {listing.email && (
                  <div className="flex items-center">
                    <Mail size={18} className="text-accent-600 dark:text-accent-400 mr-3" />
                    <a href={`mailto:${listing.email}`} className="hover:text-accent-600 dark:hover:text-accent-400">
                      {listing.email}
                    </a>
                  </div>
                )}
                
                {listing.website_url && (
                  <div className="flex items-center">
                    <Globe size={18} className="text-accent-600 dark:text-accent-400 mr-3" />
                    <a 
                      href={listing.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent-600 dark:hover:text-accent-400"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {listing.address && (
                  <div className="flex items-start mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <MapPin size={18} className="text-accent-600 dark:text-accent-400 mr-3 mt-1" />
                    <address className="not-italic">
                      {listing.address}
                    </address>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;