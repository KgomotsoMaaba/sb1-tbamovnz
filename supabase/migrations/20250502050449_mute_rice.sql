/*
  # Fix RLS policies for business listings

  1. Changes
    - Drop and recreate RLS policies for business_listings table to ensure proper user_id handling
    - Ensure INSERT policy properly handles user_id assignment
    - Maintain existing SELECT, UPDATE, and DELETE policies

  2. Security
    - Maintain RLS enabled
    - Ensure authenticated users can only manage their own listings
    - Allow public read access to all listings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;

-- Recreate policies with correct user_id handling
CREATE POLICY "Anyone can view business listings"
ON business_listings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can create their own business listings"
ON business_listings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business listings"
ON business_listings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business listings"
ON business_listings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);