/*
  # Add rating field to business_listings table

  1. Changes
    - Add rating column to business_listings table
    - Add check constraint to ensure rating is between 1 and 5
*/

ALTER TABLE business_listings
ADD COLUMN IF NOT EXISTS rating numeric(2,1) CHECK (rating >= 1 AND rating <= 5);