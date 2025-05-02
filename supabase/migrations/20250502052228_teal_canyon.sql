/*
  # Fix Business Listings RLS Policies

  1. Changes
    - Drop existing RLS policies
    - Create new policies with correct authentication checks
    - Fix insert policy to properly handle user_id
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;

-- Create new policies with correct auth checks
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