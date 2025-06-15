
-- (Already created in last attempt) Create a public bucket for plant images (no-op if already exists)
insert into storage.buckets (id, name, public) 
  values ('plant-images', 'plant-images', true)
  on conflict do nothing;

-- Allow public read (download) for any object in plant-images
create policy "Public read for plant-images" on storage.objects
  for select
  using (bucket_id = 'plant-images');

-- Allow authenticated users to upload images
create policy "Authenticated upload plant-images" on storage.objects
  for insert
  with check (
    auth.role() = 'authenticated'
    and bucket_id = 'plant-images'
  );

-- Allow authenticated users to delete images they uploaded
create policy "Authenticated delete plant-images" on storage.objects
  for delete
  using (
    auth.role() = 'authenticated'
    and bucket_id = 'plant-images'
  );
