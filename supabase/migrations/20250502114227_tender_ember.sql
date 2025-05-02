/*
  # Fix Business Listings RLS Policies

  1. Changes
    - Drop and recreate the INSERT policy for business_listings table to fix RLS violation
    - Policy ensures authenticated users can only create listings with their own user_id
  
  2. Security
    - Maintains existing security model
    - Fixes authorization for INSERT operations
    - Ensures data integrity by validating user_id matches authenticated user
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;

-- Create new INSERT policy with correct qualification
CREATE POLICY "Users can create their own business listings"
ON business_listings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);