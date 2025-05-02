/*
  # Final Fix for Business Listings RLS

  1. Changes
    - Drop all existing policies to ensure clean state
    - Create new policies with correct permissions
    - Fix INSERT policy to properly handle authenticated users
*/

-- Drop all existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view business listings" ON business_listings;
  DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
  DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;
  DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;
  DROP POLICY IF EXISTS "Allow insert for user-owned listings" ON business_listings;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies
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