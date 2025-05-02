/*
  # Add Search System

  1. Changes
    - Enable pg_trgm extension for fuzzy text search
    - Add location coordinates to business_listings
    - Create GIN indexes for fast text search
    - Add distance calculation function
    - Add search functions for events and listings
*/

-- Enable the pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add location coordinates to business_listings
ALTER TABLE business_listings
ADD COLUMN IF NOT EXISTS latitude decimal(10,8),
ADD COLUMN IF NOT EXISTS longitude decimal(11,8);

-- Create GIN indexes for fast text search
CREATE INDEX IF NOT EXISTS idx_events_title_trgm ON events USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_events_description_trgm ON events USING gin(description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_business_listings_name_trgm ON business_listings USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_business_listings_description_trgm ON business_listings USING gin(description gin_trgm_ops);

-- Create a function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 decimal,
  lon1 decimal,
  lat2 decimal,
  lon2 decimal
)
RETURNS decimal
LANGUAGE plpgsql
AS $$
DECLARE
  R decimal := 6371; -- Earth's radius in kilometers
  dlat decimal;
  dlon decimal;
  a decimal;
  c decimal;
BEGIN
  -- Convert degrees to radians
  lat1 := radians(lat1);
  lon1 := radians(lon1);
  lat2 := radians(lat2);
  lon2 := radians(lon2);
  
  -- Haversine formula
  dlat := lat2 - lat1;
  dlon := lon2 - lon1;
  a := sin(dlat/2)^2 + cos(lat1) * cos(lat2) * sin(dlon/2)^2;
  c := 2 * asin(sqrt(a));
  
  RETURN R * c;
END;
$$;

-- Create a function to search events
CREATE OR REPLACE FUNCTION search_events(
  search_query text,
  category_filter text DEFAULT NULL,
  date_start timestamp with time zone DEFAULT NULL,
  date_end timestamp with time zone DEFAULT NULL,
  user_latitude decimal DEFAULT NULL,
  user_longitude decimal DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  category text,
  distance decimal
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.end_date,
    e.category,
    NULL::decimal as distance
  FROM events e
  WHERE 
    (search_query IS NULL OR 
     title ILIKE '%' || search_query || '%' OR 
     description ILIKE '%' || search_query || '%')
    AND (category_filter IS NULL OR category = category_filter)
    AND (date_start IS NULL OR e.start_date >= date_start)
    AND (date_end IS NULL OR e.end_date <= date_end)
  ORDER BY 
    CASE 
      WHEN date_start IS NOT NULL THEN e.start_date
      ELSE e.created_at
    END;
END;
$$;

-- Create a function to search business listings
CREATE OR REPLACE FUNCTION search_listings(
  search_query text,
  category_filter text DEFAULT NULL,
  province_filter text DEFAULT NULL,
  user_latitude decimal DEFAULT NULL,
  user_longitude decimal DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  location text,
  province text,
  category text,
  distance decimal
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.description,
    b.location,
    b.province,
    b.category,
    CASE
      WHEN user_latitude IS NOT NULL AND user_longitude IS NOT NULL AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
      THEN calculate_distance(user_latitude, user_longitude, b.latitude, b.longitude)
      ELSE NULL
    END as distance
  FROM business_listings b
  WHERE 
    (search_query IS NULL OR 
     name ILIKE '%' || search_query || '%' OR 
     description ILIKE '%' || search_query || '%' OR
     location ILIKE '%' || search_query || '%')
    AND (category_filter IS NULL OR category = category_filter)
    AND (province_filter IS NULL OR province = province_filter)
  ORDER BY 
    CASE
      WHEN user_latitude IS NOT NULL AND user_longitude IS NOT NULL AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
      THEN calculate_distance(user_latitude, user_longitude, b.latitude, b.longitude)
      ELSE NULL
    END NULLS LAST,
    name;
END;
$$;