
-- Create a table for plant listings
create table public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  photo_url text, -- plant main photo, stored in Supabase Storage
  name text not null,
  price numeric not null,
  description text,
  location text,
  created_at timestamp with time zone default now() not null
);

-- Enable row-level security
alter table public.plants enable row level security;

-- Allow users to view their own and other plants (since listings are public)
create policy "Allow all users to view plants"
  on public.plants for select
  using (true);

-- Allow users to insert (post) their own plants
create policy "Allow logged in users to post plants"
  on public.plants for insert
  with check (auth.uid() = user_id);

-- Allow users to update/delete only their own plants
create policy "Allow owners to update their own plants"
  on public.plants for update
  using (auth.uid() = user_id);

create policy "Allow owners to delete their own plants"
  on public.plants for delete
  using (auth.uid() = user_id);
