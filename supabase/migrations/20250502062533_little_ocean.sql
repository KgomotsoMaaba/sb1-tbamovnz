/*
  # Add storage and business listings RLS policies

  1. Changes
    - Add storage bucket for business images if it doesn't exist
    - Add RLS policies for business-images bucket to allow authenticated users to upload
    - Update business_listings RLS policies to ensure proper insert permissions
  
  2. Security
    - Enable RLS on storage bucket
    - Add policies to allow authenticated users to upload images
    - Ensure business_listings policies are correctly configured
*/

-- Create storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('business-images', 'business-images')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Add storage policies for business-images bucket
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;
  
  -- Create new policies
  CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'business-images'
    AND auth.role() = 'authenticated'
  );

  CREATE POLICY "Allow public to view images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'business-images');
END $$;

-- Update business_listings policies
DO $$
BEGIN
  -- Drop existing insert policy if it exists
  DROP POLICY IF EXISTS "Users can create their own business listings" ON public.business_listings;
  
  -- Create new insert policy
  CREATE POLICY "Users can create their own business listings"
  ON public.business_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );
END $$;