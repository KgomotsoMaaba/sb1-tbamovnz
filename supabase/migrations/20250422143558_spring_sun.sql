/*
  # Add indexes for performance optimization

  1. Changes
    - Add indexes on frequently queried columns
    - Add index on events start_date and end_date
    - Add index on profiles email
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS events_start_date_idx ON events (start_date);
CREATE INDEX IF NOT EXISTS events_end_date_idx ON events (end_date);
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events (user_id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);