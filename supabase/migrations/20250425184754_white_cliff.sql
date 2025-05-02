/*
  # Update business_listings table fields

  1. Changes
    - Rename contact_number to number
    - Remove mobile_number field
    - Rename physical_address to address
*/

ALTER TABLE business_listings 
  RENAME COLUMN contact_number TO number;

ALTER TABLE business_listings
  DROP COLUMN IF EXISTS mobile_number;

ALTER TABLE business_listings
  RENAME COLUMN physical_address TO address;