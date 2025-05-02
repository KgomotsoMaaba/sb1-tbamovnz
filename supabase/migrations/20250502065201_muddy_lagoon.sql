/*
  # Fix Business Listings RLS Policy

  1. Changes
    - Drop and recreate INSERT policy for business_listings table
    - Fix policy to properly handle user_id validation
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;

-- Create new policy with correct syntax
CREATE POLICY "Users can create their own business listings"
ON business_listings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);