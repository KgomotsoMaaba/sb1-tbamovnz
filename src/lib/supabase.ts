import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format:', error);
  throw new Error('Invalid Supabase URL format. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Test connection with retries and better error handling
export const testConnection = async (retries = 3, delay = 1000): Promise<boolean> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { error } = await supabase.from('business_listings').select('count').single();
      
      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.warn(`Network error on attempt ${attempt}:`, error);
          if (attempt === retries) {
            console.error('Network connection failed after all retries');
            return false;
          }
        } else if (error.message.includes('JWT')) {
          console.error('Authentication error:', error);
          return false;
        } else {
          console.warn(`Database error on attempt ${attempt}:`, error);
          if (attempt === retries) {
            console.error('Database connection failed after all retries');
            return false;
          }
        }
      } else {
        return true;
      }
    } catch (error: any) {
      console.warn(`Connection attempt ${attempt} failed:`, error);
      if (attempt === retries) {
        console.error('All connection attempts failed');
        return false;
      }
    }
    
    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};