/*
  # Add Auth Trigger for Profile Creation

  1. Changes
    - Add trigger function to handle new user creation
    - Create trigger on auth.users table
    - Function creates a profile record when a new user signs up

  2. Security
    - Function executes with security definer permissions
    - Only triggered on new user creation
*/

-- Create a secure trigger function that creates a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();