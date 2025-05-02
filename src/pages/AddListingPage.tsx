import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape'
];

const categories = [
  'Adventure',
  'Accommodation',
  'Dining',
  'Wellness',
  'Lodge',
  'Entertainment',
  'Education',
  'Services',
  'Safari'
];

const initialFormData = {
  name: '',
  number: '',
  email: '',
  description: '',
  location: '',
  province: '',
  address: '',
  website_url: '',
  image_url: '',
  category: ''
};

const AddListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/signin', { replace: true });
        return;
      }
      setSession(session);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/signin', { replace: true });
        return;
      }
      setSession(session);
    });

    if (id) {
      fetchListing();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, id]);

  const fetchListing = async () => {
    const { data, error } = await supabase
      .from('business_listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching listing:', error);
      navigate('/directory');
      return;
    }

    if (data) {
      setFormData(data);
      if (data.image_url) {
        setPreview(data.image_url);
      }
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (number: string): boolean => {
    if (!number) return true;
    const phoneRegex = /^(?:\+27|0)[1-9][0-9]{8}$/;
    return phoneRegex.test(number.replace(/\s+/g, ''));
  };

  const getValidationError = (field: 'email' | 'number'): string | undefined => {
    if (field === 'email' && formData.email && !validateEmail(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (field === 'number' && formData.number && !validatePhoneNumber(formData.number)) {
      return 'Please enter a valid South African phone number (e.g., 0123456789 or +27123456789)';
    }
    return undefined;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !session) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setPreview(URL.createObjectURL(file));
      setUploading(true);
      setError(null);

      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('business-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError('You must be signed in to create a listing');
      navigate('/signin', { replace: true });
      return;
    }

    try {
      setError(null);
      const listing = {
        ...formData,
        user_id: session.user.id
      };

      if (id) {
        const { error: updateError } = await supabase
          .from('business_listings')
          .update(listing)
          .eq('id', id)
          .eq('user_id', session.user.id); // Add user_id check for extra security

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('business_listings')
          .insert([listing])
          .select()
          .single();

        if (insertError) throw insertError;
      }

      navigate('/directory');
    } catch (error: any) {
      console.error('Error saving listing:', error);
      if (error.message.includes('row-level security') || error.status === 401) {
        setError('Authentication error. Please try signing out and signing in again.');
      } else {
        setError(error.message || 'Failed to save listing. Please try again.');
      }
    }
  };

  const isFormValid = (): boolean => {
    const requiredFields = Boolean(
      formData.name &&
      formData.description &&
      formData.location &&
      formData.province &&
      formData.category
    );

    const validEmail = validateEmail(formData.email);
    const validPhone = validatePhoneNumber(formData.number);

    return requiredFields && 
           (!formData.email || validEmail) && 
           (!formData.number || validPhone) && 
           !uploading;
  };

  if (!session) {
    return null; // Don't render anything while checking auth status
  }

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <h1 className="text-3xl font-heading font-semibold mb-8">
        {id ? 'Edit Listing' : 'Add New Listing'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number</label>
            <input
              type="tel"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="0123456789 or +27123456789"
              className={`w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent ${
                getValidationError('number') ? 'border-red-500' : ''
              }`}
            />
            {getValidationError('number') && (
              <p className="text-red-500 text-xs mt-1">{getValidationError('number')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
              className={`w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent ${
                getValidationError('email') ? 'border-red-500' : ''
              }`}
            />
            {getValidationError('email') && (
              <p className="text-red-500 text-xs mt-1">{getValidationError('email')}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            maxLength={1200}
            rows={4}
            className="w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1200 characters</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Town/City</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
            <select
              value={formData.province}
              onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
              className="w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            rows={2}
            className="w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              className="w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Image</label>
          <div className="mt-1 flex items-center space-x-4">
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Upload size={20} className="mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Choose Image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>
          {preview && (
            <div className="mt-4 relative">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setFormData(prev => ({ ...prev, image_url: '' }));
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/directory')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid()}
            className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {id ? 'Update Listing' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListingPage;