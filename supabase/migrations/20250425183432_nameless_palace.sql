/*
  # Add new fields to business_listings table

  1. Changes
    - Add contact_number field
    - Add mobile_number field
    - Add email field
    - Add physical_address field
*/

ALTER TABLE business_listings
ADD COLUMN IF NOT EXISTS contact_number text,
ADD COLUMN IF NOT EXISTS mobile_number text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS physical_address text;