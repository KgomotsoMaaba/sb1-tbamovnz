/*
  # Fix Business Listings Insert Policy

  1. Changes
    - Drop existing insert policy
    - Create new insert policy with correct syntax
    - Ensure proper authentication checks
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;

-- Create new insert policy with correct syntax
CREATE POLICY "Users can create their own business listings"
ON business_listings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);