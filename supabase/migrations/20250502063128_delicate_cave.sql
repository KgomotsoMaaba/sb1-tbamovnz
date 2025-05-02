/*
  # Fix RLS policies for business listings

  1. Changes
    - Drop existing RLS policies for business_listings table
    - Create new policies with correct permissions for authenticated users
    
  2. Security
    - Enable RLS on business_listings table
    - Add policies for:
      - SELECT: Anyone can view listings
      - INSERT: Authenticated users can create listings with their user_id
      - UPDATE: Users can update their own listings
      - DELETE: Users can delete their own listings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;

-- Recreate policies with correct permissions
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