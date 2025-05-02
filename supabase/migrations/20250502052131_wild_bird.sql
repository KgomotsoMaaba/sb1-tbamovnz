/*
  # Fix RLS policies for business listings and storage

  1. Changes
    - Add storage bucket policies for business-images
    - Update business_listings policies to properly handle inserts
    
  2. Security
    - Enable RLS on storage bucket
    - Add policies for authenticated users to upload and read images
    - Fix business_listings insert policy
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
SELECT 'business-images', 'business-images'
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'business-images'
);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies for the bucket
DROP POLICY IF EXISTS "Anyone can view business images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload business images" ON storage.objects;

-- Add policies for the storage bucket
CREATE POLICY "Anyone can view business images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-images');

CREATE POLICY "Authenticated users can upload business images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-images'
  AND (storage.foldername(name))[1] = 'business-images'
);

-- Fix business_listings insert policy
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;

CREATE POLICY "Users can create their own business listings"
ON business_listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);