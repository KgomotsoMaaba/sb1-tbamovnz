/*
  # Final Fix for RLS Policies

  1. Changes
    - Set up storage bucket with correct permissions
    - Configure proper RLS policies for storage
    - Fix business_listings RLS policies
    - Ensure proper user_id handling
*/

-- First ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop all existing storage policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new storage policies
CREATE POLICY "Allow public to view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-images');

CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-images');

-- Drop all existing business_listings policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view business listings" ON business_listings;
  DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
  DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;
  DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new business_listings policies
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