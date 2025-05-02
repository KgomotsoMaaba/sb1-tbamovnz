/*
  # Fix RLS Policies for Storage and Business Listings

  1. Changes
    - Fix storage bucket RLS policies
    - Update business listings RLS policies
    - Ensure proper user authentication checks
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-images' 
  AND (storage.foldername(name))[1] = 'business-images'
);

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-images' 
  AND owner = auth.uid()
);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-images' 
  AND owner = auth.uid()
);

-- Drop existing business listings policies
DROP POLICY IF EXISTS "Anyone can view business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;

-- Create new business listings policies
CREATE POLICY "Anyone can view business listings"
ON business_listings FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can create their own business listings"
ON business_listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business listings"
ON business_listings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business listings"
ON business_listings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);