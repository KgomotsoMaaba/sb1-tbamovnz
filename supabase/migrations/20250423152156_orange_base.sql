/*
  # Add Business Listings Table

  1. New Tables
    - `business_listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `location` (text)
      - `province` (text)
      - `image_url` (text)
      - `website_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on business_listings table
    - Add policies for authenticated users to:
      - Read all listings
      - Create their own listings
      - Update their own listings
      - Delete their own listings
*/

CREATE TABLE IF NOT EXISTS business_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  province text NOT NULL,
  image_url text,
  website_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE business_listings ENABLE ROW LEVEL SECURITY;

-- Policies
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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business listings"
  ON business_listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_business_listings_updated_at
  BEFORE UPDATE ON business_listings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();