/*
  # Add category field to business_listings table

  1. Changes
    - Add category field to business_listings table
    - Make category field required
*/

ALTER TABLE business_listings
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Services';