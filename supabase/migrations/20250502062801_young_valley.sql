/*
  # Fix Business Listings RLS Policies

  1. Changes
    - Drop existing RLS policies for business_listings table
    - Create new policies with correct conditions for INSERT, UPDATE, DELETE, and SELECT
    
  2. Security
    - Enable RLS on business_listings table
    - Add policies to allow:
      - Anyone to view business listings
      - Authenticated users to create their own listings
      - Users to update and delete their own listings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;

-- Recreate policies with correct conditions
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