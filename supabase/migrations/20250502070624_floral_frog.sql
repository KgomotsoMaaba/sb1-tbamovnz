/*
  # Fix RLS policies for business_listings table

  1. Changes
    - Update INSERT policy to use correct auth.uid() function
    - Update UPDATE policy to use correct auth.uid() function
    - Update DELETE policy to use correct auth.uid() function

  2. Security
    - Maintains existing security model but fixes function calls
    - Ensures authenticated users can only manage their own listings
*/

-- Drop existing policies that use incorrect uid() function
DROP POLICY IF EXISTS "Users can create their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can update their own business listings" ON business_listings;
DROP POLICY IF EXISTS "Users can delete their own business listings" ON business_listings;

-- Recreate policies with correct auth.uid() function
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