
-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN first_name text,
  ADD COLUMN last_name text;

-- Update the handle_new_user trigger function to store first/last name from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;
